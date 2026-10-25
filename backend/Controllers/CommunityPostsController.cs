using System.Security.Claims;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/community-posts")]
public class CommunityPostsController : ControllerBase
{
    private readonly ICommunityPostService _postService;

    public CommunityPostsController(ICommunityPostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] string? status, [FromQuery] int limit = 20, [FromQuery] int skip = 0)
    {
        // Nếu yêu cầu xem status pending/rejected thì bắt buộc quyền Admin
        if (!string.IsNullOrEmpty(status) && status != "published")
        {
            if (!User.IsInRole("Admin"))
            {
                return Forbid();
            }
        }

        var posts = await _postService.GetPostsAsync(status, limit, skip);
        return Ok(posts);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? "Thành viên";

        var post = await _postService.CreatePostAsync(userId, userName, null, dto);
        return StatusCode(StatusCodes.Status201Created, new
        {
            message = "Bài viết đã được gửi và đang chờ Admin phê duyệt trước khi hiển thị trên Bảng tin.",
            postId = post.Id
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}/decision")]
    public async Task<IActionResult> ProcessPostDecision(string id, [FromBody] PostDecisionDto dto)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _postService.ProcessPostDecisionAsync(id, adminId, dto.Approve, dto.RejectionReason);
        if (!success)
        {
            return BadRequest(new { message = "Không thể xử lý bài đăng này." });
        }

        return Ok(new
        {
            message = dto.Approve ? "Đã phê duyệt bài đăng lên Bảng tin!" : "Đã từ chối bài đăng."
        });
    }

    [Authorize]
    [HttpPost("{id}/like")]
    public async Task<IActionResult> ToggleLike(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _postService.TogglePostLikeAsync(id, userId);
        if (!success)
        {
            return BadRequest(new { message = "Không thể thả cảm xúc bài viết." });
        }
        return Ok(new { message = "Đã cập nhật cảm xúc bài viết." });
    }

    [Authorize]
    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(string id, [FromBody] CreateCommentRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var userName = User.FindFirstValue(ClaimTypes.Name) ?? "Thành viên";

        var success = await _postService.AddPostCommentAsync(id, userId, userName, null, request);
        if (!success)
        {
            return BadRequest(new { message = "Không thể gửi bình luận." });
        }
        return StatusCode(StatusCodes.Status201Created, new { message = "Bình luận thành công." });
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isAdmin = User.IsInRole("Admin");

        try
        {
            var success = await _postService.DeletePostAsync(id, userId, isAdmin);
            if (!success)
            {
                return NotFound(new { message = "Không tìm thấy bài đăng để xóa." });
            }
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }
}
