using Backend.Models;
using Backend.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public interface IDatabaseSeeder
{
    Task SeedAsync();
}

public class DatabaseSeeder : IDatabaseSeeder
{
    private readonly MongoDbContext _context;
    private readonly ILogger<DatabaseSeeder> _logger;

    public DatabaseSeeder(MongoDbContext context, ILogger<DatabaseSeeder> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            _logger.LogInformation("[SEEDER] Bắt đầu kiểm tra và khởi tạo dữ liệu cho database: {DatabaseName}...", _context.Database.DatabaseNamespace.DatabaseName);

            // 1. Khởi tạo Indexes
            await CreateIndexesAsync();

            // 2. Seed Categories nếu chưa có
            var catCount = await _context.Categories.CountDocumentsAsync(FilterDefinition<Category>.Empty);
            var catMap = new Dictionary<string, string>();

            if (catCount == 0)
            {
                _logger.LogInformation("[SEEDER] Khởi tạo danh mục mặc định...");
                var categories = new List<Category>
                {
                    new()
                    {
                        Id = "650000000000000000000001",
                        Name = "Ẩm thực & Nhà hàng",
                        Slug = "am-thuc-nha-hang",
                        Icon = "utensils",
                        Description = "Các quán ăn, nhà hàng, món ngon đặc sản phong phú tại TP.HCM",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "650000000000000000000002",
                        Name = "Cà phê & Trà",
                        Slug = "ca-phe-tra",
                        Icon = "coffee",
                        Description = "Quán cà phê view đẹp, không gian làm việc và đồ uống đặc sắc",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "650000000000000000000003",
                        Name = "Du lịch & Di tích",
                        Slug = "du-lich-di-tich",
                        Icon = "landmark",
                        Description = "Danh lam thắng cảnh, di tích lịch sử và văn hóa nổi tiếng",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "650000000000000000000004",
                        Name = "Vui chơi & Giải trí",
                        Slug = "vui-choi-giai-tri",
                        Icon = "ticket",
                        Description = "Công viên giải trí, khu phố đi bộ, trung tâm mua sắm",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = "650000000000000000000005",
                        Name = "Khách sạn & Nghỉ dưỡng",
                        Slug = "khach-san-nghi-duong",
                        Icon = "hotel",
                        Description = "Khách sạn, homestay, resort tiện nghi chất lượng",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    }
                };

                await _context.Categories.InsertManyAsync(categories);
            }

            // 3. Seed Users nếu chưa có
            var userCount = await _context.Users.CountDocumentsAsync(FilterDefinition<User>.Empty);
            var adminId = "651111111111111111111111";
            var memberId = "652222222222222222222222";

            if (userCount == 0)
            {
                _logger.LogInformation("[SEEDER] Khởi tạo tài khoản Admin và Member thử nghiệm...");
                var hash = BCrypt.Net.BCrypt.HashPassword("Admin@123");
                var users = new List<User>
                {
                    new()
                    {
                        Id = adminId,
                        Email = "admin@travelreview.vn",
                        PasswordHash = hash,
                        FullName = "Quản trị viên Hệ thống",
                        Role = "Admin",
                        AvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new()
                    {
                        Id = memberId,
                        Email = "traveler@travelreview.vn",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Member@123"),
                        FullName = "Nguyễn Văn Du Khách",
                        Role = "Member",
                        AvatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };

                await _context.Users.InsertManyAsync(users);
            }

            // 4. Seed Places nếu chưa có
            var placeCount = await _context.Places.CountDocumentsAsync(FilterDefinition<Place>.Empty);
            if (placeCount == 0)
            {
                _logger.LogInformation("[SEEDER] Khởi tạo dữ liệu địa điểm mẫu tại TP.HCM (Embedded Reviews/Comments)...");
                var samplePlace = new Place
                {
                    Id = "653333333333333333333331",
                    Name = "Chợ Bến Thành",
                    Slug = "cho-ben-thanh",
                    Description = "Biểu tượng lịch sử văn hóa lâu đời bậc nhất của TP. Hồ Chí Minh với hàng trăm gian hàng ẩm thực, quà lưu niệm và thủ công mỹ nghệ.",
                    CategoryId = "650000000000000000000003",
                    Address = new Address
                    {
                        Street = "Đường Lê Lợi, Phường Bến Thành",
                        Ward = "Phường Bến Thành",
                        District = "Quận 1",
                        City = "Hồ Chí Minh",
                        ProvinceCode = "79"
                    },
                    Location = new GeoLocation
                    {
                        Type = "Point",
                        Coordinates = new double[] { 106.6983, 10.7725 } // [kinh độ, vĩ độ]
                    },
                    Images = new List<PlaceImage>
                    {
                        new() { Url = "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800", IsCover = true }
                    },
                    Status = "active",
                    RatingAverage = 5.0,
                    ReviewCount = 1,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Reviews = new List<Review>
                    {
                        new()
                        {
                            ReviewId = "654444444444444444444441",
                            UserId = memberId,
                            AuthorName = "Nguyễn Văn Du Khách",
                            AuthorAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
                            Rating = 5,
                            Content = "Chợ rất nhộn nhịp, nhiều món ăn truyền thống miền Nam cực ngon như bún mắm, chè ba màu hạt lựu. Đáng ghé thăm!",
                            Images = new List<ReviewImage>
                            {
                                new() { Url = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600" }
                            },
                            IsDemo = true,
                            Likes = new List<string> { adminId },
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow,
                            Comments = new List<Comment>
                            {
                                new()
                                {
                                    CommentId = "655555555555555555555551",
                                    UserId = adminId,
                                    UserName = "Quản trị viên Hệ thống",
                                    Content = "Cảm ơn bạn đã đóng góp đánh giá chi tiết cho địa điểm!",
                                    Likes = new List<string> { memberId },
                                    CreatedAt = DateTime.UtcNow,
                                    Replies = new List<Reply>
                                    {
                                        new()
                                        {
                                            ReplyId = "656666666666666666666661",
                                            UserId = memberId,
                                            UserName = "Nguyễn Văn Du Khách",
                                            Content = "Dạ, rất vui vì đóng góp có ích cho cộng đồng du lịch!",
                                            CreatedAt = DateTime.UtcNow
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                await _context.Places.InsertOneAsync(samplePlace);
            }

            _logger.LogInformation("[SEEDER] Hoàn tất kiểm tra và khởi tạo dữ liệu thành công!");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[SEEDER] Có lỗi xảy ra trong quá trình khởi tạo dữ liệu.");
        }
    }

    private async Task CreateIndexesAsync()
    {
        try
        {
            // 1. 2dsphere Geospatial Index cho Places
            var geoIndex = new CreateIndexModel<Place>(
                Builders<Place>.IndexKeys.Geo2DSphere("location"),
                new CreateIndexOptions { Name = "geospatial_place_location" }
            );

            // 2. Text Search Index
            var textIndex = new CreateIndexModel<Place>(
                Builders<Place>.IndexKeys.Text(p => p.Name).Text(p => p.Description),
                new CreateIndexOptions { Name = "text_search_name_desc", DefaultLanguage = "none" }
            );

            // 3. Compound Index
            var compoundIndex = new CreateIndexModel<Place>(
                Builders<Place>.IndexKeys.Ascending(p => p.CategoryId).Descending(p => p.RatingAverage).Descending(p => p.ReviewCount),
                new CreateIndexOptions { Name = "compound_cat_rating_count" }
            );

            var districtIndex = new CreateIndexModel<Place>(
                Builders<Place>.IndexKeys.Ascending("address.district").Descending(p => p.RatingAverage),
                new CreateIndexOptions { Name = "compound_district_rating" }
            );

            await _context.Places.Indexes.CreateManyAsync(new[] { geoIndex, textIndex, compoundIndex, districtIndex });

            // 4. Unique User Email
            var userEmailIndex = new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Email),
                new CreateIndexOptions { Unique = true, Name = "uniq_user_email" }
            );
            await _context.Users.Indexes.CreateOneAsync(userEmailIndex);

            // 5. Unique Favorite Pair
            var favIndex = new CreateIndexModel<Favorite>(
                Builders<Favorite>.IndexKeys.Ascending(f => f.UserId).Ascending(f => f.PlaceId),
                new CreateIndexOptions { Unique = true, Name = "uniq_user_favorite_place" }
            );
            await _context.Favorites.Indexes.CreateOneAsync(favIndex);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("[SEEDER] Lưu ý khi tạo Index (có thể index đã tồn tại): {Message}", ex.Message);
        }
    }
}
