using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace Backend.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IInteractionService _interactionService;

    public AdminController(IInteractionService interactionService)
    {
        _interactionService = interactionService;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var stats = await _interactionService.GetAdminStatsAsync();
        return Content(stats.ToJson(), "application/json");
    }
}
