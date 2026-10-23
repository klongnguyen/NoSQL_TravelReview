using System.Security.Claims;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationsController : ControllerBase
{
    private readonly INeo4jRecommendationService _recommendationService;

    public RecommendationsController(INeo4jRecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetRecommendations([FromQuery] int limit = 6)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "guest";
        var places = await _recommendationService.GetRecommendationsAsync(userId, limit);
        return Ok(places);
    }

    [HttpGet("tourist-flow")]
    public async Task<IActionResult> GetTouristFlow([FromQuery] string? originSlug)
    {
        var flow = await _recommendationService.GetTouristFlowSimulationAsync(originSlug);
        return Ok(flow);
    }
}
