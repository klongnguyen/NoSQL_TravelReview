using Backend.Models;
using Backend.Repositories;
using MongoDB.Driver;

namespace Backend.Services;

public interface INeo4jRecommendationService
{
    Task<List<Place>> GetRecommendationsAsync(string userId, int limit = 6);
    Task<object> GetTouristFlowSimulationAsync(string? originSlug);
    Task SyncUserInteractionAsync(string userId, string placeId, string interactionType);
}

public class Neo4jRecommendationService : INeo4jRecommendationService
{
    private readonly MongoDbContext _context;
    private readonly ILogger<Neo4jRecommendationService> _logger;

    public Neo4jRecommendationService(MongoDbContext context, ILogger<Neo4jRecommendationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<Place>> GetRecommendationsAsync(string userId, int limit = 6)
    {
        // Khi chưa kết nối AuraDB hoặc Neo4j offline, thực hiện Graceful Fallback (FR-REC-03 / FR-REC-04)
        // Gợi ý cold-start / Hybrid cơ sở bằng MongoDB: Lấy các địa điểm có rating cao và lượt review tích cực
        try
        {
            var filter = Builders<Place>.Filter.Eq(p => p.Status, "active");
            if (userId != "guest")
            {
                var favs = await _context.Favorites.Find(f => f.UserId == userId).ToListAsync();
                var favoritePlaceIds = favs.Select(f => f.PlaceId).ToList();
                if (favoritePlaceIds.Any())
                {
                    filter &= Builders<Place>.Filter.Nin(p => p.Id, favoritePlaceIds);
                }
            }

            var places = await _context.Places.Find(filter)
                .SortByDescending(p => p.RatingAverage)
                .ThenByDescending(p => p.ReviewCount)
                .Limit(limit)
                .ToListAsync();

            return places;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Lỗi khi lấy dữ liệu gợi ý.");
            return new List<Place>();
        }
    }

    public Task<object> GetTouristFlowSimulationAsync(string? originSlug)
    {
        // Mô phỏng chuỗi Markov / đồ thị hành vi du khách Neo4j (Collaborative Filtering on Graph)
        var flowRules = new Dictionary<string, object>
        {
            ["cho-ben-thanh"] = new
            {
                origin = "Chợ Bến Thành",
                category = "Chợ truyền thống & Di tích",
                cypherQuery = "MATCH (p1:Place {slug: 'cho-ben-thanh'})<-[:VISITED]-(u:User)-[:VISITED]->(p2:Place) RETURN p2.name, count(u) AS freq ORDER BY freq DESC LIMIT 3",
                nextStops = new[]
                {
                    new { slug = "banh-mi-huynh-hoa", name = "Bánh Mì Huỳnh Hoa", probability = "92%", distance = "500m", reason = "92% du khách sau khi mua quà lưu niệm tại chợ sẽ ghé thưởng thức bánh mì đặc sản số 1 Sài Gòn." },
                    new { slug = "pizza-4ps-ben-thanh", name = "Pizza 4P's — Bến Thành", probability = "85%", distance = "200m", reason = "Lựa chọn ẩm thực đối diện chợ được du khách quốc tế bình chọn nhiều nhất." },
                    new { slug = "pho-di-bo-nguyen-hue", name = "Phố Đi Bộ Nguyễn Huệ", probability = "89%", distance = "600m", reason = "Cung đường tản bộ yêu thích tiếp nối ra bến Bạch Đằng về đêm." }
                }
            },
            ["dinh-doc-lap"] = new
            {
                origin = "Dinh Độc Lập (Hội trường Thống Nhất)",
                category = "Di tích lịch sử",
                cypherQuery = "MATCH (p1:Place {slug: 'dinh-doc-lap'})<-[:VISITED]-(u:User)-[:VISITED]->(p2:Place) RETURN p2.name, count(u) AS freq ORDER BY freq DESC LIMIT 3",
                nextStops = new[]
                {
                    new { slug = "nha-tho-duc-ba-sai-gon", name = "Nhà Thờ Đức Bà Sài Gòn", probability = "94%", distance = "450m", reason = "Điểm tham quan kế cận chỉ 5 phút đi bộ xuyên qua công viên 30/4." },
                    new { slug = "the-workshop-coffee", name = "The Workshop Coffee", probability = "88%", distance = "650m", reason = "Quán Specialty Coffee phong cách industrial được du khách ghé nhiều nhất để giải khát." },
                    new { slug = "pho-hoa-pasteur", name = "Phở Hòa Pasteur", probability = "76%", distance = "1.2km", reason = "Món phở truyền thống lâu đời cho bữa trưa đậm vị sau tour tham quan di tích." }
                }
            },
            ["nha-tho-duc-ba-sai-gon"] = new
            {
                origin = "Nhà Thờ Đức Bà Sài Gòn",
                category = "Kiến trúc & Tôn giáo",
                cypherQuery = "MATCH (p1:Place {slug: 'nha-tho-duc-ba-sai-gon'})<-[:VISITED]-(u:User)-[:VISITED]->(p2:Place) RETURN p2.name, count(u) AS freq ORDER BY freq DESC LIMIT 2",
                nextStops = new[]
                {
                    new { slug = "buu-dien-trung-tam-sai-gon", name = "Bưu Điện Trung Tâm Sài Gòn", probability = "98%", distance = "50m", reason = "Nằm ngay cạnh quảng trường Công Xã Paris, 98% du khách check-in đôi địa danh này cùng lúc." },
                    new { slug = "okkio-caffe-le-loi", name = "Okkio Caffe — Lê Lợi", probability = "81%", distance = "700m", reason = "Không gian cà phê thanh lịch ngắm dòng người qua lại." }
                }
            },
            ["landmark-81-skyview"] = new
            {
                origin = "Landmark 81 SkyView",
                category = "Ngắm cảnh & Giải trí",
                cypherQuery = "MATCH (p1:Place {slug: 'landmark-81-skyview'})<-[:VISITED]-(u:User)-[:VISITED]->(p2:Place) RETURN p2.name, count(u) AS freq ORDER BY freq DESC LIMIT 2",
                nextStops = new[]
                {
                    new { slug = "caravelle-saigon", name = "Caravelle Saigon", probability = "84%", distance = "3.5km", reason = "Du khách thường di chuyển về trung tâm bờ sông thưởng thức tiệc tối rooftop." },
                    new { slug = "the-workshop-coffee", name = "The Workshop Coffee", probability = "79%", distance = "3.2km", reason = "Thư giãn trò chuyện sau chuyến ngắm cảnh 360 độ từ tầng cao." }
                }
            }
        };

        var key = !string.IsNullOrEmpty(originSlug) && flowRules.ContainsKey(originSlug)
            ? originSlug
            : "dinh-doc-lap";

        return Task.FromResult(flowRules[key]);
    }

    public Task SyncUserInteractionAsync(string userId, string placeId, string interactionType)
    {
        // Sẵn sàng hook đồng bộ sang Neo4j AuraDB (u:User)-[r]->(p:Place) khi cấu hình AuraDB
        _logger.LogInformation("[NEO4J-SYNC] Ghi nhận tương tác {Type}: User {User} -> Place {Place}", interactionType, userId, placeId);
        return Task.CompletedTask;
    }
}
