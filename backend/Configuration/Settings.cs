namespace Backend.Configuration;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = "mongodb://admin:password123@localhost:27017";
    public string DatabaseName { get; set; } = "travel_review";
}

public class JwtSettings
{
    public string SecretKey { get; set; } = "AntigravityTravelReviewVerySecretKey_2026_Minimum32CharsLong!";
    public string Issuer { get; set; } = "TravelReviewAPI";
    public string Audience { get; set; } = "TravelReviewClients";
    public int ExpiryDays { get; set; } = 7;
}
