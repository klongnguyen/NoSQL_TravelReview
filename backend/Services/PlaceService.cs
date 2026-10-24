using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public interface IPlaceService
{
    Task<(List<Place> Places, long TotalCount)> GetPlacesAsync(PlaceFilterQuery query);
    Task<Place?> GetPlaceByIdAsync(string id);
    Task<List<Place>> GetNearbyPlacesAsync(NearbyQuery query);
    Task<List<Place>> GetTopPlacesAsync(int limit = 10);
    Task<Place> CreatePlaceAsync(CreatePlaceRequest request);
    Task<bool> CreateReviewAsync(string placeId, string userId, string userName, string? userAvatar, CreateReviewRequest request);
    Task<bool> UpdateReviewAsync(string placeId, string reviewId, string userId, UpdateReviewRequest request);
    Task<bool> DeleteReviewAsync(string placeId, string reviewId, string userId, bool isAdmin);
    Task<bool> AddCommentAsync(string placeId, string reviewId, string userId, string userName, string? userAvatar, CreateCommentRequest request);
    Task<bool> AddReplyAsync(string placeId, string reviewId, string commentId, string userId, string userName, string? userAvatar, CreateReplyRequest request);
    Task<bool> ToggleReviewLikeAsync(string placeId, string reviewId, string userId);
    Task RecalculateRatingAndCountAsync(string placeId);
}

public class PlaceService : IPlaceService
{
    private readonly MongoDbContext _context;

    public PlaceService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<(List<Place> Places, long TotalCount)> GetPlacesAsync(PlaceFilterQuery query)
    {
        var builder = Builders<Place>.Filter;
        var filter = builder.Eq(p => p.Status, "active");

        if (!string.IsNullOrWhiteSpace(query.CategoryId))
        {
            filter &= builder.Eq(p => p.CategoryId, query.CategoryId);
        }

        if (!string.IsNullOrWhiteSpace(query.District))
        {
            filter &= builder.Eq(p => p.Address.District, query.District);
        }

        if (query.MinRating.HasValue)
        {
            filter &= builder.Gte(p => p.RatingAverage, query.MinRating.Value);
        }

        // Tìm kiếm toàn văn (Text Index) nếu có từ khóa
        if (!string.IsNullOrWhiteSpace(query.Keyword))
        {
            filter &= builder.Text(query.Keyword);
        }

        var sortBuilder = Builders<Place>.Sort;
        var sort = query.SortBy switch
        {
            "reviews" => sortBuilder.Descending(p => p.ReviewCount),
            "newest" => sortBuilder.Descending(p => p.CreatedAt),
            _ => sortBuilder.Descending(p => p.RatingAverage).Descending(p => p.ReviewCount)
        };

        var totalCount = await _context.Places.CountDocumentsAsync(filter);
        var places = await _context.Places.Find(filter)
            .Sort(sort)
            .Skip((query.Page - 1) * query.PageSize)
            .Limit(query.PageSize)
            .ToListAsync();

        return (places, totalCount);
    }

    public async Task<Place?> GetPlaceByIdAsync(string id)
    {
        if (ObjectId.TryParse(id, out _))
        {
            var byId = await _context.Places.Find(p => p.Id == id && p.Status == "active").FirstOrDefaultAsync();
            if (byId != null) return byId;
        }

        var cleanId = id.StartsWith("place-") ? id.Substring(6) : id;
        return await _context.Places.Find(p => (p.Slug == id || p.Slug == cleanId) && p.Status == "active").FirstOrDefaultAsync();
    }

    public async Task<List<Place>> GetNearbyPlacesAsync(NearbyQuery query)
    {
        // 2dsphere Geospatial Query với $nearSphere trên field location
        var filter = Builders<Place>.Filter.NearSphere("location", query.Longitude, query.Latitude, query.MaxDistanceMeters)
                     & Builders<Place>.Filter.Eq(p => p.Status, "active");

        return await _context.Places.Find(filter)
            .Limit(query.Limit)
            .ToListAsync();
    }

    public async Task<List<Place>> GetTopPlacesAsync(int limit = 10)
    {
        // Aggregation pipeline lấy Top 10 địa điểm nổi bật
        var pipeline = new BsonDocument[]
        {
            new("$match", new BsonDocument
            {
                { "status", "active" },
                { "reviewCount", new BsonDocument("$gte", 1) }
            }),
            new("$sort", new BsonDocument
            {
                { "ratingAverage", -1 },
                { "reviewCount", -1 }
            }),
            new("$limit", limit)
        };

        var cursor = await _context.Places.AggregateAsync<Place>(pipeline);
        return await cursor.ToListAsync();
    }

    public async Task<Place> CreatePlaceAsync(CreatePlaceRequest request)
    {
        var slug = GenerateSlug(request.Name);
        var place = new Place
        {
            Name = request.Name,
            Slug = slug,
            Description = request.Description,
            CategoryId = request.CategoryId,
            Address = request.Address,
            Location = request.Location,
            Images = request.Images,
            Status = "active",
            RatingAverage = null,
            ReviewCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Reviews = new List<Review>()
        };

        await _context.Places.InsertOneAsync(place);
        return place;
    }

    public async Task<bool> CreateReviewAsync(
        string placeId,
        string userId,
        string userName,
        string? userAvatar,
        CreateReviewRequest request)
    {
        var newReview = new Review
        {
            ReviewId = ObjectId.GenerateNewId().ToString(),
            UserId = userId,
            AuthorName = userName,
            AuthorAvatar = userAvatar,
            Rating = request.Rating,
            Content = request.Content,
            Images = request.Images,
            IsDemo = false,
            Likes = new List<string>(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Comments = new List<Comment>()
        };

        // Tìm địa điểm theo Id hoặc Slug
        Place? targetPlace = null;
        if (ObjectId.TryParse(placeId, out _))
        {
            targetPlace = await _context.Places.Find(p => p.Id == placeId).FirstOrDefaultAsync();
        }
        if (targetPlace == null)
        {
            var cleanId = placeId.StartsWith("place-") ? placeId.Substring(6) : placeId;
            targetPlace = await _context.Places.Find(p => p.Slug == placeId || p.Slug == cleanId).FirstOrDefaultAsync();
        }
        if (targetPlace == null)
        {
            throw new InvalidOperationException("Địa điểm không tồn tại.");
        }
        var actualPlaceId = targetPlace.Id;

        // Bất biến BR-08: Mỗi user chỉ có 1 active review trên mỗi địa điểm.
        // Thực thi kiểm tra nguyên tử: Chỉ push nếu mảng reviews không chứa review của userId này
        var filter = Builders<Place>.Filter.And(
            Builders<Place>.Filter.Eq(p => p.Id, actualPlaceId),
            Builders<Place>.Filter.Not(Builders<Place>.Filter.ElemMatch(p => p.Reviews, r => r.UserId == userId))
        );

        var update = Builders<Place>.Update.Push(p => p.Reviews, newReview);
        var result = await _context.Places.UpdateOneAsync(filter, update);

        if (result.ModifiedCount == 0)
        {
            throw new InvalidOperationException("Bạn đã có bài đánh giá trên địa điểm này rồi.");
        }

        // Cập nhật lại rating average và review count qua Aggregation
        await RecalculateRatingAndCountAsync(actualPlaceId);
        return true;
    }

    public async Task<bool> UpdateReviewAsync(
        string placeId,
        string reviewId,
        string userId,
        UpdateReviewRequest request)
    {
        var place = await _context.Places.Find(p => p.Id == placeId).FirstOrDefaultAsync();
        if (place == null) return false;

        var review = place.Reviews.FirstOrDefault(r => r.ReviewId == reviewId);
        if (review == null) return false;

        // BR-02 / FR-REV-02: Chỉ chính chủ được sửa
        if (review.UserId != userId)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền sửa đánh giá này.");
        }

        // BR-09: Giới hạn sửa trong 7 ngày (168 giờ) kể từ createdAt ban đầu
        if ((DateTime.UtcNow - review.CreatedAt).TotalHours > 168)
        {
            throw new InvalidOperationException("Bài đánh giá đã quá thời hạn 7 ngày kể từ khi tạo, không thể chỉnh sửa.");
        }

        var filter = Builders<Place>.Filter.And(
            Builders<Place>.Filter.Eq(p => p.Id, placeId),
            Builders<Place>.Filter.Eq("reviews.reviewId", reviewId)
        );

        var update = Builders<Place>.Update
            .Set("reviews.$.rating", request.Rating)
            .Set("reviews.$.content", request.Content)
            .Set("reviews.$.images", request.Images)
            .Set("reviews.$.updatedAt", DateTime.UtcNow); // Giữ nguyên createdAt ban đầu

        var result = await _context.Places.UpdateOneAsync(filter, update);
        if (result.ModifiedCount > 0)
        {
            await RecalculateRatingAndCountAsync(placeId);
            return true;
        }

        return false;
    }

    public async Task<bool> DeleteReviewAsync(string placeId, string reviewId, string userId, bool isAdmin)
    {
        var place = await _context.Places.Find(p => p.Id == placeId).FirstOrDefaultAsync();
        if (place == null) return false;

        var review = place.Reviews.FirstOrDefault(r => r.ReviewId == reviewId);
        if (review == null) return false;

        if (review.UserId != userId && !isAdmin)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền xóa đánh giá này.");
        }

        // Hard delete: Pull review ra khỏi mảng reviews (toàn bộ comment/reply con bên trong bị xóa theo)
        var filter = Builders<Place>.Filter.Eq(p => p.Id, placeId);
        var update = Builders<Place>.Update.PullFilter(p => p.Reviews, r => r.ReviewId == reviewId);

        var result = await _context.Places.UpdateOneAsync(filter, update);
        if (result.ModifiedCount > 0)
        {
            await RecalculateRatingAndCountAsync(placeId);
            return true;
        }

        return false;
    }

    public async Task<bool> AddCommentAsync(
        string placeId,
        string reviewId,
        string userId,
        string userName,
        string? userAvatar,
        CreateCommentRequest request)
    {
        var newComment = new Comment
        {
            CommentId = ObjectId.GenerateNewId().ToString(),
            UserId = userId,
            UserName = userName,
            UserAvatar = userAvatar,
            Content = request.Content,
            Likes = new List<string>(),
            CreatedAt = DateTime.UtcNow,
            Replies = new List<Reply>()
        };

        var filter = Builders<Place>.Filter.And(
            Builders<Place>.Filter.Eq(p => p.Id, placeId),
            Builders<Place>.Filter.Eq("reviews.reviewId", reviewId)
        );

        var update = Builders<Place>.Update.Push("reviews.$.comments", newComment);
        var result = await _context.Places.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> AddReplyAsync(
        string placeId,
        string reviewId,
        string commentId,
        string userId,
        string userName,
        string? userAvatar,
        CreateReplyRequest request)
    {
        var newReply = new Reply
        {
            ReplyId = ObjectId.GenerateNewId().ToString(),
            UserId = userId,
            UserName = userName,
            UserAvatar = userAvatar,
            Content = request.Content,
            Likes = new List<string>(),
            CreatedAt = DateTime.UtcNow
        };

        // Sử dụng ArrayFilter để nhúng Reply đúng vị trí tầng 2 (không tạo tầng 3)
        var filter = Builders<Place>.Filter.Eq(p => p.Id, placeId);
        var update = Builders<Place>.Update.Push("reviews.$[rev].comments.$[cmt].replies", newReply);

        var arrayFilters = new List<ArrayFilterDefinition>
        {
            new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("rev.reviewId", reviewId)),
            new BsonDocumentArrayFilterDefinition<BsonDocument>(new BsonDocument("cmt.commentId", commentId))
        };

        var updateOptions = new UpdateOptions { ArrayFilters = arrayFilters };
        var result = await _context.Places.UpdateOneAsync(filter, update, updateOptions);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> ToggleReviewLikeAsync(string placeId, string reviewId, string userId)
    {
        var place = await _context.Places.Find(p => p.Id == placeId).FirstOrDefaultAsync();
        var review = place?.Reviews.FirstOrDefault(r => r.ReviewId == reviewId);
        if (review == null) return false;

        var filter = Builders<Place>.Filter.And(
            Builders<Place>.Filter.Eq(p => p.Id, placeId),
            Builders<Place>.Filter.Eq("reviews.reviewId", reviewId)
        );

        UpdateDefinition<Place> update;
        if (review.Likes.Contains(userId))
        {
            // Unlike: rút userId ra
            update = Builders<Place>.Update.Pull("reviews.$.likes", userId);
        }
        else
        {
            // Like: thêm userId vào (idempotent $addToSet)
            update = Builders<Place>.Update.AddToSet("reviews.$.likes", userId);
        }

        var result = await _context.Places.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task RecalculateRatingAndCountAsync(string placeId)
    {
        // Pipeline Aggregation AGG-01 chuẩn SRS
        var pipeline = new BsonDocument[]
        {
            new("$match", new BsonDocument("_id", ObjectId.Parse(placeId))),
            new("$unwind", "$reviews"),
            new("$group", new BsonDocument
            {
                { "_id", "$_id" },
                { "avgRating", new BsonDocument("$avg", "$reviews.rating") },
                { "reviewCount", new BsonDocument("$sum", 1) }
            })
        };

        var cursor = await _context.Places.AggregateAsync<BsonDocument>(pipeline);
        var aggResult = await cursor.FirstOrDefaultAsync();

        double? newAvg = null;
        int newCount = 0;

        if (aggResult != null)
        {
            newAvg = Math.Round(aggResult["avgRating"].ToDouble(), 1);
            newCount = aggResult["reviewCount"].ToInt32();
        }

        var updateFilter = Builders<Place>.Filter.Eq(p => p.Id, placeId);
        var update = Builders<Place>.Update
            .Set(p => p.RatingAverage, newAvg)
            .Set(p => p.ReviewCount, newCount)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        await _context.Places.UpdateOneAsync(updateFilter, update);
    }

    private static string GenerateSlug(string text)
    {
        var unaccented = text.ToLowerInvariant().Trim();
        unaccented = System.Text.RegularExpressions.Regex.Replace(unaccented, @"[^\w\s-]", "");
        unaccented = System.Text.RegularExpressions.Regex.Replace(unaccented, @"\s+", "-");
        return $"{unaccented}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
    }
}
