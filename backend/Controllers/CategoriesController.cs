using Backend.Models;
using Backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly MongoDbContext _context;

    public CategoriesController(MongoDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _context.Categories
            .Find(c => c.IsActive)
            .SortBy(c => c.Name)
            .ToListAsync();
        return Ok(categories);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] Category category)
    {
        if (string.IsNullOrWhiteSpace(category.Name))
        {
            return BadRequest(new { message = "Tên danh mục không được để trống" });
        }

        if (string.IsNullOrWhiteSpace(category.Slug))
        {
            category.Slug = category.Name.ToLowerInvariant().Replace(" ", "-");
        }

        category.CreatedAt = DateTime.UtcNow;
        category.IsActive = true;

        await _context.Categories.InsertOneAsync(category);
        return CreatedAtAction(nameof(GetCategories), new { id = category.Id }, category);
    }
}
