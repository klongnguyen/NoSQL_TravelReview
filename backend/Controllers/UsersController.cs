using System.Security.Claims;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IInteractionService _interactionService;

    public UsersController(IInteractionService interactionService)
    {
        _interactionService = interactionService;
    }

    [HttpGet("me/favorites")]
    public async Task<IActionResult> GetFavorites()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var favorites = await _interactionService.GetFavoritesAsync(userId);
        return Ok(favorites);
    }

    [HttpPost("me/favorites/{placeId}")]
    public async Task<IActionResult> ToggleFavorite(string placeId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isAdded = await _interactionService.ToggleFavoriteAsync(userId, placeId);
        return Ok(new { isFavorite = isAdded, message = isAdded ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích" });
    }

    [HttpGet("me/favorites/{placeId}/check")]
    public async Task<IActionResult> CheckFavorite(string placeId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isFav = await _interactionService.IsFavoriteAsync(userId, placeId);
        return Ok(new { isFavorite = isFav });
    }

    [HttpGet("me/view-history")]
    public async Task<IActionResult> GetViewHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var history = await _interactionService.GetViewHistoryAsync(userId);
        return Ok(history);
    }

    [HttpPost("me/view-history/{placeId}")]
    public async Task<IActionResult> RecordView(string placeId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _interactionService.RecordViewAsync(userId, placeId);
        return Ok(new { message = "Đã lưu lịch sử xem" });
    }

    [HttpDelete("me/view-history")]
    public async Task<IActionResult> ClearViewHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _interactionService.ClearViewHistoryAsync(userId);
        return NoContent();
    }
}
