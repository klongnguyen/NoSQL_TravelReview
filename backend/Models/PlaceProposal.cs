using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

[BsonIgnoreExtraElements]
public class PlaceProposal
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("proposerId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProposerId { get; set; } = string.Empty;

    [BsonElement("type")]
    public string Type { get; set; } = "create"; // "create" or "edit"

    [BsonElement("placeId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? PlaceId { get; set; } // Null if type is 'create'

    [BsonElement("payload")]
    public BsonDocument Payload { get; set; } = new();

    [BsonElement("originalVersion")]
    public BsonDocument? OriginalVersion { get; set; }

    [BsonElement("status")]
    public string Status { get; set; } = "pending"; // "pending", "approved", "rejected"

    [BsonElement("reviewedBy")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? ReviewedBy { get; set; }

    [BsonElement("reviewedAt")]
    public DateTime? ReviewedAt { get; set; }

    [BsonElement("rejectionReason")]
    public string? RejectionReason { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
