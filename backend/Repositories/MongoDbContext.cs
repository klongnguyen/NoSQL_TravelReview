using Backend.Configuration;
using Backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Backend.Repositories;

public class MongoDbContext
{
    private readonly IMongoDatabase _database;

    public MongoDbContext(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        _database = client.GetDatabase(settings.Value.DatabaseName);
    }

    public IMongoDatabase Database => _database;

    public IMongoCollection<User> Users => _database.GetCollection<User>("users");
    public IMongoCollection<Category> Categories => _database.GetCollection<Category>("categories");
    public IMongoCollection<Place> Places => _database.GetCollection<Place>("places");
    public IMongoCollection<PlaceProposal> PlaceProposals => _database.GetCollection<PlaceProposal>("place_proposals");
    public IMongoCollection<Report> Reports => _database.GetCollection<Report>("reports");
    public IMongoCollection<Favorite> Favorites => _database.GetCollection<Favorite>("favorites");
    public IMongoCollection<ViewHistory> ViewHistories => _database.GetCollection<ViewHistory>("view_history");
}
