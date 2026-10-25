using Backend.Models;
using Backend.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public interface IInteractionService
{
    // Favorites
    Task<List<Place>> GetFavoritesAsync(string userId);
    Task<bool> ToggleFavoriteAsync(string userId, string placeId);
    Task<bool> IsFavoriteAsync(string userId, string placeId);

    // View History
    Task<List<Place>> GetViewHistoryAsync(string userId, int limit = 20);
    Task RecordViewAsync(string userId, string placeId);
    Task<bool> ClearViewHistoryAsync(string userId);

    // Place Proposals
    Task<PlaceProposal> CreateProposalAsync(string userId, string type, string? placeId, BsonDocument payload);
    Task<List<PlaceProposal>> GetProposalsAsync(string? status = null);
    Task<bool> ProcessProposalAsync(string proposalId, string adminId, bool approve, string? rejectionReason);

    // Reports
    Task<Report> CreateReportAsync(string reporterId, string targetType, string placeId, string targetId, string reason);
    Task<List<Report>> GetReportsAsync(string? status = null);
    Task<bool> ResolveReportAsync(string reportId, string adminId, bool deleteContent, IPlaceService placeService);

    // Admin Dashboard Aggregation
    Task<BsonDocument> GetAdminStatsAsync();
}

public class InteractionService : IInteractionService
{
    private readonly MongoDbContext _context;

    public InteractionService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Place>> GetFavoritesAsync(string userId)
    {
        var favs = await _context.Favorites.Find(f => f.UserId == userId).ToListAsync();
        var placeIds = favs.Select(f => f.PlaceId).ToList();
        if (!placeIds.Any()) return new List<Place>();

        return await _context.Places.Find(p => placeIds.Contains(p.Id) && p.Status == "active").ToListAsync();
    }

    public async Task<bool> ToggleFavoriteAsync(string userId, string placeId)
    {
        var existing = await _context.Favorites.Find(f => f.UserId == userId && f.PlaceId == placeId).FirstOrDefaultAsync();
        if (existing != null)
        {
            await _context.Favorites.DeleteOneAsync(f => f.Id == existing.Id);
            return false; // Removed
        }

        var fav = new Favorite
        {
            UserId = userId,
            PlaceId = placeId,
            CreatedAt = DateTime.UtcNow
        };
        await _context.Favorites.InsertOneAsync(fav);
        return true; // Added
    }

    public async Task<bool> IsFavoriteAsync(string userId, string placeId)
    {
        return await _context.Favorites.Find(f => f.UserId == userId && f.PlaceId == placeId).AnyAsync();
    }

    public async Task<List<Place>> GetViewHistoryAsync(string userId, int limit = 20)
    {
        var history = await _context.ViewHistories.Find(h => h.UserId == userId)
            .SortByDescending(h => h.ViewedAt)
            .Limit(limit)
            .ToListAsync();

        var placeIds = history.Select(h => h.PlaceId).Distinct().ToList();
        if (!placeIds.Any()) return new List<Place>();

        var places = await _context.Places.Find(p => placeIds.Contains(p.Id)).ToListAsync();
        var placeMap = places.ToDictionary(p => p.Id, p => p);

        // Giữ thứ tự xem gần nhất
        return placeIds.Where(id => placeMap.ContainsKey(id)).Select(id => placeMap[id]).ToList();
    }

    public async Task RecordViewAsync(string userId, string placeId)
    {
        // Cập nhật hoặc thêm mới lịch sử xem
        var filter = Builders<ViewHistory>.Filter.And(
            Builders<ViewHistory>.Filter.Eq(h => h.UserId, userId),
            Builders<ViewHistory>.Filter.Eq(h => h.PlaceId, placeId)
        );

        var update = Builders<ViewHistory>.Update
            .Set(h => h.ViewedAt, DateTime.UtcNow)
            .SetOnInsert(h => h.Id, ObjectId.GenerateNewId().ToString());

        await _context.ViewHistories.UpdateOneAsync(filter, update, new UpdateOptions { IsUpsert = true });
    }

    public async Task<bool> ClearViewHistoryAsync(string userId)
    {
        var result = await _context.ViewHistories.DeleteManyAsync(h => h.UserId == userId);
        return result.DeletedCount > 0;
    }

    public async Task<PlaceProposal> CreateProposalAsync(string userId, string type, string? placeId, BsonDocument payload)
    {
        var proposal = new PlaceProposal
        {
            ProposerId = userId,
            Type = type,
            PlaceId = placeId,
            Payload = payload,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        if (type == "edit" && !string.IsNullOrEmpty(placeId))
        {
            var currentPlace = await _context.Places.Find(p => p.Id == placeId).FirstOrDefaultAsync();
            if (currentPlace != null)
            {
                proposal.OriginalVersion = currentPlace.ToBsonDocument();
            }
        }

        await _context.PlaceProposals.InsertOneAsync(proposal);
        return proposal;
    }

    public async Task<List<PlaceProposal>> GetProposalsAsync(string? status = null)
    {
        var filter = string.IsNullOrEmpty(status) 
            ? FilterDefinition<PlaceProposal>.Empty 
            : Builders<PlaceProposal>.Filter.Eq(p => p.Status, status);

        return await _context.PlaceProposals.Find(filter)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ProcessProposalAsync(string proposalId, string adminId, bool approve, string? rejectionReason)
    {
        var proposal = await _context.PlaceProposals.Find(p => p.Id == proposalId).FirstOrDefaultAsync();
        if (proposal == null || proposal.Status != "pending") return false;

        if (approve)
        {
            proposal.Status = "approved";
            proposal.ReviewedBy = adminId;
            proposal.ReviewedAt = DateTime.UtcNow;

            if (proposal.Type == "create")
            {
                // Trích xuất payload để tạo place mới
                var name = proposal.Payload.GetValue("name", "").AsString;
                var desc = proposal.Payload.GetValue("description", "").AsString;
                var catId = proposal.Payload.GetValue("categoryId", "").AsString;
                var district = proposal.Payload.Contains("district") ? proposal.Payload["district"].AsString : "Quận 1";
                var street = proposal.Payload.Contains("street") ? proposal.Payload["street"].AsString : "";
                var lng = proposal.Payload.Contains("lng") ? proposal.Payload["lng"].AsDouble : 106.6983;
                var lat = proposal.Payload.Contains("lat") ? proposal.Payload["lat"].AsDouble : 10.7725;
                var imgUrl = proposal.Payload.Contains("imageUrl") ? proposal.Payload["imageUrl"].AsString : "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800";

                var newPlace = new Place
                {
                    Name = name,
                    Slug = name.ToLowerInvariant().Replace(" ", "-") + "-" + DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    Description = desc,
                    CategoryId = catId,
                    Address = new Address { Street = street, District = district, City = "Hồ Chí Minh" },
                    Location = new GeoLocation { Coordinates = new[] { lng, lat } },
                    Images = new List<PlaceImage> { new() { Url = imgUrl, IsCover = true } },
                    Status = "active",
                    RatingAverage = null,
                    ReviewCount = 0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Places.InsertOneAsync(newPlace);
            }
        }
        else
        {
            proposal.Status = "rejected";
            proposal.ReviewedBy = adminId;
            proposal.ReviewedAt = DateTime.UtcNow;
            proposal.RejectionReason = rejectionReason ?? "Không phù hợp tiêu chuẩn kiểm duyệt";
        }

        var updateFilter = Builders<PlaceProposal>.Filter.Eq(p => p.Id, proposalId);
        await _context.PlaceProposals.ReplaceOneAsync(updateFilter, proposal);
        return true;
    }

    public async Task<Report> CreateReportAsync(string reporterId, string targetType, string placeId, string targetId, string reason)
    {
        var report = new Report
        {
            ReporterId = reporterId,
            TargetType = targetType,
            PlaceId = placeId,
            TargetId = targetId,
            Reason = reason,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        await _context.Reports.InsertOneAsync(report);
        return report;
    }

    public async Task<List<Report>> GetReportsAsync(string? status = null)
    {
        var filter = string.IsNullOrEmpty(status)
            ? FilterDefinition<Report>.Empty
            : Builders<Report>.Filter.Eq(r => r.Status, status);

        return await _context.Reports.Find(filter)
            .SortByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> ResolveReportAsync(string reportId, string adminId, bool deleteContent, IPlaceService placeService)
    {
        var report = await _context.Reports.Find(r => r.Id == reportId).FirstOrDefaultAsync();
        if (report == null) return false;

        if (deleteContent && report.TargetType == "review")
        {
            // Hard delete review vi phạm
            await placeService.DeleteReviewAsync(report.PlaceId, report.TargetId, report.ReporterId, isAdmin: true);
        }

        report.Status = deleteContent ? "resolved" : "dismissed";
        report.ResolvedBy = adminId;
        report.ResolvedAt = DateTime.UtcNow;

        await _context.Reports.ReplaceOneAsync(r => r.Id == reportId, report);
        return true;
    }

    public async Task<BsonDocument> GetAdminStatsAsync()
    {
        // 1. Tổng places & reviews & rating trung bình qua Aggregation
        var placeCount = await _context.Places.CountDocumentsAsync(p => p.Status == "active");
        var userCount = await _context.Users.CountDocumentsAsync(FilterDefinition<User>.Empty);
        var pendingProposals = await _context.PlaceProposals.CountDocumentsAsync(p => p.Status == "pending");
        var pendingReports = await _context.Reports.CountDocumentsAsync(r => r.Status == "pending");

        // Aggregation tính tổng số bài reviews và điểm trung bình toàn hệ thống
        var overallPipeline = new BsonDocument[]
        {
            new("$match", new BsonDocument("status", "active")),
            new("$unwind", "$reviews"),
            new("$group", new BsonDocument
            {
                { "_id", BsonNull.Value },
                { "totalReviews", new BsonDocument("$sum", 1) },
                { "avgRating", new BsonDocument("$avg", "$reviews.rating") }
            })
        };

        var overallAgg = await (await _context.Places.AggregateAsync<BsonDocument>(overallPipeline)).FirstOrDefaultAsync();
        var totalReviews = overallAgg != null && overallAgg.Contains("totalReviews") ? overallAgg["totalReviews"].ToInt32() : 0;
        var avgRating = overallAgg != null && overallAgg.Contains("avgRating") ? Math.Round(overallAgg["avgRating"].ToDouble(), 1) : 0;

        // Aggregation phân bố địa điểm theo Danh mục
        var catPipeline = new BsonDocument[]
        {
            new("$match", new BsonDocument("status", "active")),
            new("$group", new BsonDocument
            {
                { "_id", "$categoryId" },
                { "count", new BsonDocument("$sum", 1) },
                { "avgRating", new BsonDocument("$avg", "$ratingAverage") }
            })
        };

        var catAgg = await (await _context.Places.AggregateAsync<BsonDocument>(catPipeline)).ToListAsync();
        var categories = await _context.Categories.Find(FilterDefinition<Category>.Empty).ToListAsync();
        var catDict = categories.ToDictionary(c => c.Id, c => c.Name);

        var categoryStats = catAgg.Select(doc =>
        {
            var cId = doc["_id"].IsObjectId ? doc["_id"].AsObjectId.ToString() : doc["_id"].AsString;
            var name = catDict.ContainsKey(cId) ? catDict[cId] : "Khác";
            return new BsonDocument
            {
                { "categoryId", cId },
                { "name", name },
                { "count", doc["count"].ToInt32() },
                { "avgRating", doc["avgRating"].IsBsonNull ? 0 : Math.Round(doc["avgRating"].ToDouble(), 1) }
            };
        }).ToList();

        // Tổng số lượt truy cập (visitCount) từ các địa điểm
        var visitPipeline = new BsonDocument[]
        {
            new("$group", new BsonDocument
            {
                { "_id", BsonNull.Value },
                { "totalVisits", new BsonDocument("$sum", "$visitCount") }
            })
        };
        var visitAgg = await (await _context.Places.AggregateAsync<BsonDocument>(visitPipeline)).FirstOrDefaultAsync();
        var totalVisits = visitAgg != null && visitAgg.Contains("totalVisits") ? visitAgg["totalVisits"].ToInt64() : 0;

        // Tổng bài đăng cộng đồng
        var postCount = await _context.CommunityPosts.CountDocumentsAsync(FilterDefinition<CommunityPost>.Empty);

        return new BsonDocument
        {
            { "totalPlaces", placeCount },
            { "totalUsers", userCount },
            { "totalReviews", totalReviews },
            { "totalVisits", totalVisits },
            { "totalPosts", postCount },
            { "averageRating", avgRating },
            { "pendingProposals", pendingProposals },
            { "pendingReports", pendingReports },
            { "categoriesStats", new BsonArray(categoryStats) }
        };
    }
}
