using System.ComponentModel.DataAnnotations;
using Backend.Models;

namespace Backend.DTOs;

public class CreatePlaceRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string CategoryId { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public Address Address { get; set; } = new();

    [Required]
    public GeoLocation Location { get; set; } = new();

    public List<PlaceImage> Images { get; set; } = new();
}

public class PlaceFilterQuery
{
    public string? Keyword { get; set; }
    public string? CategoryId { get; set; }
    public string? District { get; set; }
    public double? MinRating { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
    public string? SortBy { get; set; } = "rating"; // rating, reviews, newest
}

public class NearbyQuery
{
    [Required]
    public double Longitude { get; set; }

    [Required]
    public double Latitude { get; set; }

    public double MaxDistanceMeters { get; set; } = 5000; // 5km default
    public int Limit { get; set; } = 20;
}

public class CreateReviewRequest
{
    [Required]
    [Range(1, 5, ErrorMessage = "Điểm đánh giá phải là số nguyên từ 1 đến 5 sao")]
    public int Rating { get; set; }

    [Required]
    [MinLength(10, ErrorMessage = "Nội dung đánh giá phải có ít nhất 10 ký tự")]
    public string Content { get; set; } = string.Empty;

    [MaxLength(5, ErrorMessage = "Tối đa 5 hình ảnh cho mỗi bài đánh giá")]
    public List<ReviewImage> Images { get; set; } = new();
}

public class UpdateReviewRequest
{
    [Required]
    [Range(1, 5, ErrorMessage = "Điểm đánh giá phải là số nguyên từ 1 đến 5 sao")]
    public int Rating { get; set; }

    [Required]
    [MinLength(10, ErrorMessage = "Nội dung đánh giá phải có ít nhất 10 ký tự")]
    public string Content { get; set; } = string.Empty;

    [MaxLength(5, ErrorMessage = "Tối đa 5 hình ảnh cho mỗi bài đánh giá")]
    public List<ReviewImage> Images { get; set; } = new();
}

public class CreateCommentRequest
{
    [Required]
    [MinLength(2, ErrorMessage = "Nội dung bình luận quá ngắn")]
    public string Content { get; set; } = string.Empty;

    public CommentImage? Image { get; set; }
}

public class CreateReplyRequest
{
    [Required]
    [MinLength(2, ErrorMessage = "Nội dung trả lời quá ngắn")]
    public string Content { get; set; } = string.Empty;
}
