using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

[BsonIgnoreExtraElements]
public class PostImage
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

    [BsonElement("uploadedAt")]
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("fileSizeBytes")]
    public long? FileSizeBytes { get; set; }

    [BsonElement("format")]
    public string? Format { get; set; }
}

[BsonIgnoreExtraElements]
public class PostPlaceTag
{
    [BsonElement("placeId")]
    public string? PlaceId { get; set; }

    [BsonElement("placeName")]
    public string PlaceName { get; set; } = string.Empty;

    [BsonElement("district")]
    public string? District { get; set; }

    [BsonElement("city")]
    public string? City { get; set; }
}

[BsonIgnoreExtraElements]
public class PostMood
{
    [BsonElement("key")]
    public string Key { get; set; } = "happy";

    [BsonElement("label")]
    public string Label { get; set; } = "Tuyệt vời";

    [BsonElement("icon")]
    public string Icon { get; set; } = "😊";
}

[BsonIgnoreExtraElements]
public class PostComment
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

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[BsonIgnoreExtraElements]
public class CommunityPost
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("authorName")]
    public string AuthorName { get; set; } = string.Empty;

    [BsonElement("authorAvatar")]
    public string? AuthorAvatar { get; set; }

    [BsonElement("content")]
    public string Content { get; set; } = string.Empty;

    [BsonElement("images")]
    public List<PostImage> Images { get; set; } = new();

    [BsonElement("placeTag")]
    public PostPlaceTag? PlaceTag { get; set; }

    [BsonElement("mood")]
    public PostMood? Mood { get; set; }

    [BsonElement("likes")]
    [BsonRepresentation(BsonType.ObjectId)]
    public List<string> Likes { get; set; } = new();

    [BsonElement("likeCount")]
    public int LikeCount { get; set; } = 0;

    [BsonElement("comments")]
    public List<PostComment> Comments { get; set; } = new();

    [BsonElement("status")]
    public string Status { get; set; } = "pending"; // "pending", "published", "rejected", "hidden"

    [BsonElement("rejectionReason")]
    public string? RejectionReason { get; set; }

    [BsonElement("reviewedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ReviewedBy { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
