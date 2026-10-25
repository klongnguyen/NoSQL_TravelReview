using System.Security.Claims;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlacesController : ControllerBase
{
    private readonly IPlaceService _placeService;

    public PlacesController(IPlaceService placeService)
    {
        _placeService = placeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPlaces([FromQuery] PlaceFilterQuery query)
    {
        var (places, totalCount) = await _placeService.GetPlacesAsync(query);
        return Ok(new
        {
            data = places,
            total = totalCount,
            page = query.Page,
            pageSize = query.PageSize,
            totalPages = (int)Math.Ceiling((double)totalCount / query.PageSize)
        });
    }

    [HttpGet("top")]
    public async Task<IActionResult> GetTopPlaces([FromQuery] int limit = 10)
    {
        var topPlaces = await _placeService.GetTopPlacesAsync(limit);
        return Ok(topPlaces);
    }

    [HttpGet("nearby")]
    public async Task<IActionResult> GetNearbyPlaces([FromQuery] NearbyQuery query)
    {
        if (query.Longitude < -180 || query.Longitude > 180 || query.Latitude < -90 || query.Latitude > 90)
        {
            return BadRequest(new { message = "Tọa độ kinh độ [-180..180] hoặc vĩ độ [-90..90] không hợp lệ" });
        }

        var nearby = await _placeService.GetNearbyPlacesAsync(query);
        return Ok(nearby);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPlaceById(string id)
    {
        var place = await _placeService.GetPlaceByIdAsync(id);
        if (place == null)
        {
            return NotFound(new { message = "Không tìm thấy địa điểm hoặc địa điểm chưa được kích hoạt" });
        }
        return Ok(place);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreatePlace([FromBody] CreatePlaceRequest request)
    {
        var created = await _placeService.CreatePlaceAsync(request);
        return CreatedAtAction(nameof(GetPlaceById), new { id = created.Id }, created);
    }

    [Authorize]
    [HttpPost("{id}/reviews")]
    public async Task<IActionResult> CreateReview(string id, [FromBody] CreateReviewRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? "Thành viên";

        try
        {
            var success = await _placeService.CreateReviewAsync(id, userId, userName, null, request);
            if (!success)
            {
                return BadRequest(new { message = "Không thể thêm đánh giá." });
            }
            return StatusCode(StatusCodes.Status201Created, new { message = "Đánh giá thành công!" });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpPut("{id}/reviews/{reviewId}")]
    public async Task<IActionResult> UpdateReview(string id, string reviewId, [FromBody] UpdateReviewRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        try
        {
            var success = await _placeService.UpdateReviewAsync(id, reviewId, userId, request);
            if (!success)
            {
                return NotFound(new { message = "Không tìm thấy đánh giá để cập nhật." });
            }
            return Ok(new { message = "Cập nhật bài đánh giá thành công." });
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("{id}/reviews/{reviewId}")]
    public async Task<IActionResult> DeleteReview(string id, string reviewId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isAdmin = User.IsInRole("Admin");

        try
        {
            var success = await _placeService.DeleteReviewAsync(id, reviewId, userId, isAdmin);
            if (!success)
            {
                return NotFound(new { message = "Không tìm thấy bài đánh giá cần xóa." });
            }
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    [Authorize]
    [HttpPost("{id}/reviews/{reviewId}/comments")]
    public async Task<IActionResult> AddComment(string id, string reviewId, [FromBody] CreateCommentRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? "Thành viên";

        var success = await _placeService.AddCommentAsync(id, reviewId, userId, userName, null, request);
        if (!success)
        {
            return BadRequest(new { message = "Không thể đăng bình luận." });
        }
        return StatusCode(StatusCodes.Status201Created, new { message = "Bình luận thành công." });
    }

    [Authorize]
    [HttpPost("{id}/reviews/{reviewId}/comments/{commentId}/replies")]
    public async Task<IActionResult> AddReply(string id, string reviewId, string commentId, [FromBody] CreateReplyRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? "Thành viên";

        var success = await _placeService.AddReplyAsync(id, reviewId, commentId, userId, userName, null, request);
        if (!success)
        {
            return BadRequest(new { message = "Không thể gửi phản hồi." });
        }
        return StatusCode(StatusCodes.Status201Created, new { message = "Gửi phản hồi thành công." });
    }

    [Authorize]
    [HttpPost("{id}/reviews/{reviewId}/like")]
    public async Task<IActionResult> ToggleLike(string id, string reviewId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _placeService.ToggleReviewLikeAsync(id, reviewId, userId);
        if (!success)
        {
            return BadRequest(new { message = "Không thể thao tác like." });
        }
        return Ok(new { message = "Đã cập nhật trạng thái thích." });
    }
}
