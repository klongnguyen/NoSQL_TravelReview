using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Backend.Services;

public class CreatePostDto
{
    public string Content { get; set; } = string.Empty;
    public List<PostImage> Images { get; set; } = new();
    public PostPlaceTag? PlaceTag { get; set; }
    public PostMood? Mood { get; set; }
}

public class PostDecisionDto
{
    public bool Approve { get; set; }
    public string? RejectionReason { get; set; }
}

public interface ICommunityPostService
{
    Task<List<CommunityPost>> GetPostsAsync(string? status = null, int limit = 20, int skip = 0);
    Task<CommunityPost> CreatePostAsync(string userId, string authorName, string? authorAvatar, CreatePostDto dto);
    Task<bool> ProcessPostDecisionAsync(string postId, string adminId, bool approve, string? rejectionReason);
    Task<bool> TogglePostLikeAsync(string postId, string userId);
    Task<bool> AddPostCommentAsync(string postId, string userId, string userName, string? userAvatar, CreateCommentRequest request);
    Task<bool> DeletePostAsync(string postId, string userId, bool isAdmin);
}

public class CommunityPostService : ICommunityPostService
{
    private readonly MongoDbContext _context;

    public CommunityPostService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<CommunityPost>> GetPostsAsync(string? status = null, int limit = 20, int skip = 0)
    {
        var builder = Builders<CommunityPost>.Filter;
        var filter = string.IsNullOrEmpty(status) 
            ? builder.Eq(p => p.Status, "published") 
            : builder.Eq(p => p.Status, status);

        return await _context.CommunityPosts
            .Find(filter)
            .SortByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Limit(limit)
            .ToListAsync();
    }

    public async Task<CommunityPost> CreatePostAsync(string userId, string authorName, string? authorAvatar, CreatePostDto dto)
    {
        var post = new CommunityPost
        {
            UserId = userId,
            AuthorName = authorName,
            AuthorAvatar = authorAvatar,
            Content = dto.Content,
            Images = dto.Images ?? new List<PostImage>(),
            PlaceTag = dto.PlaceTag,
            Mood = dto.Mood,
            Status = "pending", // Yêu cầu Pre-moderation: Phải qua Admin duyệt
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Gán metadata cho từng ảnh phân tán nếu thiếu
        foreach (var img in post.Images)
        {
            if (string.IsNullOrEmpty(img.UploadedBy)) img.UploadedBy = userId;
            if (string.IsNullOrEmpty(img.StorageKey)) img.StorageKey = $"post_{Guid.NewGuid():N}";
            if (string.IsNullOrEmpty(img.StorageProvider)) img.StorageProvider = "Cloudinary_Distributed_CDN";
        }

        await _context.CommunityPosts.InsertOneAsync(post);
        return post;
    }

    public async Task<bool> ProcessPostDecisionAsync(string postId, string adminId, bool approve, string? rejectionReason)
    {
        var filter = Builders<CommunityPost>.Filter.Eq(p => p.Id, postId);
        var update = Builders<CommunityPost>.Update
            .Set(p => p.Status, approve ? "published" : "rejected")
            .Set(p => p.ReviewedBy, adminId)
            .Set(p => p.RejectionReason, approve ? null : rejectionReason)
            .Set(p => p.UpdatedAt, DateTime.UtcNow);

        var result = await _context.CommunityPosts.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> TogglePostLikeAsync(string postId, string userId)
    {
        var post = await _context.CommunityPosts.Find(p => p.Id == postId).FirstOrDefaultAsync();
        if (post == null) return false;

        var filter = Builders<CommunityPost>.Filter.Eq(p => p.Id, postId);
        UpdateDefinition<CommunityPost> update;

        if (post.Likes.Contains(userId))
        {
            update = Builders<CommunityPost>.Update
                .Pull(p => p.Likes, userId)
                .Inc(p => p.LikeCount, -1);
        }
        else
        {
            update = Builders<CommunityPost>.Update
                .AddToSet(p => p.Likes, userId)
                .Inc(p => p.LikeCount, 1);
        }

        var result = await _context.CommunityPosts.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> AddPostCommentAsync(string postId, string userId, string userName, string? userAvatar, CreateCommentRequest request)
    {
        CommentImage? commentImage = null;
        if (request.Image != null && !string.IsNullOrWhiteSpace(request.Image.Url))
        {
            commentImage = new CommentImage
            {
                Url = request.Image.Url,
                StorageKey = request.Image.StorageKey ?? $"cmt_{Guid.NewGuid():N}",
                StorageProvider = !string.IsNullOrWhiteSpace(request.Image.StorageProvider) ? request.Image.StorageProvider : "Cloudinary_Distributed_CDN",
                UploadedBy = userId,
                UploaderName = userName,
                UploadedAt = DateTime.UtcNow,
                FileSizeBytes = request.Image.FileSizeBytes,
                Format = request.Image.Format ?? "jpg",
                MimeType = request.Image.MimeType ?? "image/jpeg"
            };
        }

        var newComment = new PostComment
        {
            CommentId = ObjectId.GenerateNewId().ToString(),
            UserId = userId,
            UserName = userName,
            UserAvatar = userAvatar,
            Content = request.Content,
            Image = commentImage,
            Likes = new List<string>(),
            CreatedAt = DateTime.UtcNow
        };

        var filter = Builders<CommunityPost>.Filter.Eq(p => p.Id, postId);
        var update = Builders<CommunityPost>.Update.Push(p => p.Comments, newComment);

        var result = await _context.CommunityPosts.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

    public async Task<bool> DeletePostAsync(string postId, string userId, bool isAdmin)
    {
        var post = await _context.CommunityPosts.Find(p => p.Id == postId).FirstOrDefaultAsync();
        if (post == null) return false;

        if (post.UserId != userId && !isAdmin)
        {
            throw new UnauthorizedAccessException("Bạn không có quyền xóa bài đăng này.");
        }

        var result = await _context.CommunityPosts.DeleteOneAsync(p => p.Id == postId);
        return result.DeletedCount > 0;
    }
}
