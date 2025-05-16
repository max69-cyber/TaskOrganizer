using System.Security.Claims;
using CategoryOrganizer.Server.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskOrganizer.Server.Data;
using TaskOrganizer.Server.Models;
using TaskOrganizer.Server.Services.Interfaces;

namespace TaskOrganizer.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoryController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }
    
    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
        if (userIdClaim != null && int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Пользователь не авторизован");
    }


    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
    {
        try
        {
            var userId = GetUserId();
            var categories = await _categoryService.GetAllCategories(userId);
            return Ok(categories);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }
    
    [HttpPost]
    public async Task<ActionResult> CreateCategory([FromBody] CategoryDTO dto)
    {
        try
        {
            var userId = GetUserId();
            await _categoryService.AddCategory(userId, dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<ActionResult> UpdateCategory([FromBody] CategoryDTO dto)
    {
        try
        {
            var userId = GetUserId();
            await _categoryService.UpdateCategory(userId, dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [HttpDelete]
    public async Task<ActionResult> DeleteTask(int id)
    {
        try
        {
            var userId = GetUserId();
            await _categoryService.DeleteCategory(userId, id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}