using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

[BsonIgnoreExtraElements]
public class Report
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("reporterId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ReporterId { get; set; } = string.Empty;

    [BsonElement("targetType")]
    public string TargetType { get; set; } = "review"; // "review", "comment", "reply"

    [BsonElement("placeId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string PlaceId { get; set; } = string.Empty;

    [BsonElement("targetId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string TargetId { get; set; } = string.Empty;

    [BsonElement("reason")]
    public string Reason { get; set; } = string.Empty;

    [BsonElement("status")]
    public string Status { get; set; } = "pending"; // "pending", "resolved", "dismissed"

    [BsonElement("resolvedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ResolvedBy { get; set; }

    [BsonElement("resolvedAt")]
    public DateTime? ResolvedAt { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[BsonIgnoreExtraElements]
public class Favorite
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("placeId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string PlaceId { get; set; } = string.Empty;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[BsonIgnoreExtraElements]
public class ViewHistory
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("placeId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string PlaceId { get; set; } = string.Empty;

    [BsonElement("viewedAt")]
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}
