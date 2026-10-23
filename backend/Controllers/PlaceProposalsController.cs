using System.Security.Claims;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace Backend.Controllers;

public class CreateProposalDto
{
    public string Type { get; set; } = "create"; // "create" or "edit"
    public string? PlaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string Street { get; set; } = string.Empty;
    public string District { get; set; } = "Quận 1";
    public double Lng { get; set; } = 106.6983;
    public double Lat { get; set; } = 10.7725;
    public string? ImageUrl { get; set; }
}

public class ProposalDecisionDto
{
    public bool Approve { get; set; }
    public string? RejectionReason { get; set; }
}

[ApiController]
[Route("api/place-proposals")]
public class PlaceProposalsController : ControllerBase
{
    private readonly IInteractionService _interactionService;

    public PlaceProposalsController(IInteractionService interactionService)
    {
        _interactionService = interactionService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateProposal([FromBody] CreateProposalDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var payload = new BsonDocument
        {
            { "name", dto.Name },
            { "description", dto.Description },
            { "categoryId", dto.CategoryId },
            { "street", dto.Street },
            { "district", dto.District },
            { "lng", dto.Lng },
            { "lat", dto.Lat },
            { "imageUrl", dto.ImageUrl ?? "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800" }
        };

        var proposal = await _interactionService.CreateProposalAsync(userId, dto.Type, dto.PlaceId, payload);
        return StatusCode(StatusCodes.Status201Created, new
        {
            message = "Đề xuất đã được gửi và đang chờ Admin phê duyệt.",
            proposalId = proposal.Id
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetProposals([FromQuery] string? status)
    {
        var proposals = await _interactionService.GetProposalsAsync(status);
        return Ok(proposals);
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}/decision")]
    public async Task<IActionResult> ProcessProposal(string id, [FromBody] ProposalDecisionDto dto)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _interactionService.ProcessProposalAsync(id, adminId, dto.Approve, dto.RejectionReason);

        if (!success)
        {
            return BadRequest(new { message = "Không thể xử lý đề xuất này (hoặc đã được xử lý trước đó)." });
        }

        return Ok(new
        {
            message = dto.Approve ? "Đã phê duyệt đề xuất thành công!" : "Đã từ chối đề xuất."
        });
    }
}
