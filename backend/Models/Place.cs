using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

[BsonIgnoreExtraElements]
public class Address
{
    [BsonElement("street")]
    public string Street { get; set; } = string.Empty;

    [BsonElement("ward")]
    public string Ward { get; set; } = string.Empty;

    [BsonElement("district")]
    public string District { get; set; } = string.Empty;

    [BsonElement("city")]
    public string City { get; set; } = "Hồ Chí Minh";

    [BsonElement("provinceCode")]
    public string? ProvinceCode { get; set; } = "79";
}

[BsonIgnoreExtraElements]
public class GeoLocation
{
    [BsonElement("type")]
    public string Type { get; set; } = "Point";

    /// <summary>
    /// Tọa độ theo chuẩn GeoJSON: [longitude, latitude]
    /// </summary>
    [BsonElement("coordinates")]
    public double[] Coordinates { get; set; } = new double[2]; // [lng, lat]
}

[BsonIgnoreExtraElements]
public class PlaceImage
{
    [BsonElement("url")]
    public string Url { get; set; } = string.Empty;

    [BsonElement("publicId")]
    public string? PublicId { get; set; }

    [BsonElement("isCover")]
    public bool IsCover { get; set; } = false;
}

[BsonIgnoreExtraElements]
public class ReviewImage
{
    [BsonElement("url")]
    public string Url { get; set; } = string.Empty;

    [BsonElement("publicId")]
    public string? PublicId { get; set; }
}

/// <summary>
/// Metadata ảnh phân tán trong bình luận
/// </summary>
[BsonIgnoreExtraElements]
public class CommentImage
{
    [BsonElement("url")]
    public string Url { get; set; } = string.Empty;

    [BsonElement("storageKey")]
    public string? StorageKey { get; set; }

    [BsonElement("storageProvider")]
    public string StorageProvider { get; set; } = "Cloudinary_Distributed_CDN";

    [BsonElement("uploadedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UploadedBy { get; set; } = string.Empty;

    [BsonElement("uploaderName")]
    public string UploaderName { get; set; } = string.Empty;

    [BsonElement("uploadedAt")]
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("fileSizeBytes")]
    public long? FileSizeBytes { get; set; }

    [BsonElement("format")]
    public string? Format { get; set; }

    [BsonElement("mimeType")]
    public string? MimeType { get; set; }
}

/// <summary>
/// Trả lời bình luận tầng 2 (Tuyệt đối không có tầng 3)
/// </summary>
[BsonIgnoreExtraElements]
public class Reply
{
    [BsonElement("replyId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ReplyId { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("userName")]
    public string UserName { get; set; } = string.Empty;

    [BsonElement("userAvatar")]
    public string? UserAvatar { get; set; }

    [BsonElement("content")]
    public string Content { get; set; } = string.Empty;

    [BsonElement("image")]
    public CommentImage? Image { get; set; }

    [BsonElement("likes")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> Likes { get; set; } = new();

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Bình luận tầng 1 dưới bài đánh giá (Review)
/// </summary>
[BsonIgnoreExtraElements]
public class Comment
{
    [BsonElement("commentId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CommentId { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("userName")]
    public string UserName { get; set; } = string.Empty;

    [BsonElement("userAvatar")]
    public string? UserAvatar { get; set; }

    [BsonElement("content")]
    public string Content { get; set; } = string.Empty;

    [BsonElement("image")]
    public CommentImage? Image { get; set; }

    [BsonElement("likes")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> Likes { get; set; } = new();

    [BsonElement("dislikes")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> Dislikes { get; set; } = new();

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("replies")]
    public List<Reply> Replies { get; set; } = new();
}

/// <summary>
/// Bài đánh giá 1-5 sao được nhúng trực tiếp trong Place
/// </summary>
[BsonIgnoreExtraElements]
public class Review
{
    [BsonElement("reviewId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ReviewId { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("authorName")]
    public string AuthorName { get; set; } = string.Empty;

    [BsonElement("authorAvatar")]
    public string? AuthorAvatar { get; set; }

    [BsonElement("rating")]
    public int Rating { get; set; } = 5; // 1 to 5 integer

    [BsonElement("content")]
    public string Content { get; set; } = string.Empty;

    [BsonElement("images")]
    public List<ReviewImage> Images { get; set; } = new(); // Max 5 images

    [BsonElement("isDemo")]
    public bool IsDemo { get; set; } = false;

    [BsonElement("likes")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> Likes { get; set; } = new();

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("comments")]
    public List<Comment> Comments { get; set; } = new();
}

/// <summary>
/// Entity chính: Place (Địa điểm du lịch / ăn uống)
/// Chứa mảng nhúng reviews[] (Source of Truth)
/// </summary>
[BsonIgnoreExtraElements]
public class Place
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("slug")]
    public string Slug { get; set; } = string.Empty;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("categoryId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string CategoryId { get; set; } = string.Empty;

    [BsonElement("address")]
    public Address Address { get; set; } = new();

    [BsonElement("location")]
    public GeoLocation Location { get; set; } = new();

    [BsonElement("images")]
    public List<PlaceImage> Images { get; set; } = new();

    [BsonElement("status")]
    public string Status { get; set; } = "active"; // "active" or "inactive"

    [BsonElement("ratingAverage")]
    public double? RatingAverage { get; set; } // null when 0 reviews

    [BsonElement("reviewCount")]
    public int ReviewCount { get; set; } = 0;

    [BsonElement("visitCount")]
    public int VisitCount { get; set; } = 0;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("reviews")]
    public List<Review> Reviews { get; set; } = new();
}
