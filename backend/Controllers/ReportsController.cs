using System.Security.Claims;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

public class CreateReportDto
{
    public string TargetType { get; set; } = "review"; // "review", "comment", "reply"
    public string PlaceId { get; set; } = string.Empty;
    public string TargetId { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
}

public class ResolveReportDto
{
    public bool DeleteContent { get; set; } = true;
}

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IInteractionService _interactionService;
    private readonly IPlaceService _placeService;

    public ReportsController(IInteractionService interactionService, IPlaceService placeService)
    {
        _interactionService = interactionService;
        _placeService = placeService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateReport([FromBody] CreateReportDto dto)
    {
        var reporterId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var report = await _interactionService.CreateReportAsync(reporterId, dto.TargetType, dto.PlaceId, dto.TargetId, dto.Reason);
        return StatusCode(StatusCodes.Status201Created, new
        {
            message = "Báo cáo đã được tiếp nhận. Đội ngũ quản trị sẽ kiểm tra.",
            reportId = report.Id
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetReports([FromQuery] string? status)
    {
        var reports = await _interactionService.GetReportsAsync(status);
        return Ok(reports);
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}/resolve")]
    public async Task<IActionResult> ResolveReport(string id, [FromBody] ResolveReportDto dto)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var success = await _interactionService.ResolveReportAsync(id, adminId, dto.DeleteContent, _placeService);

        if (!success)
        {
            return NotFound(new { message = "Không tìm thấy báo cáo hoặc không thể xử lý." });
        }

        return Ok(new
        {
            message = dto.DeleteContent ? "Đã xử lý vi phạm và xóa vĩnh viễn nội dung (Hard Delete)!" : "Đã bỏ qua báo cáo."
        });
    }
}
