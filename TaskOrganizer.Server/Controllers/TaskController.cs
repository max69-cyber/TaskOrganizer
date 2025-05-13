using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskOrganizer.Server.Data;
using TaskOrganizer.Server.Models;
using TaskOrganizer.Server.Services.Interfaces;

namespace TaskOrganizer.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TaskController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TaskController(ITaskService taskService)
    {
        _taskService = taskService;
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
    public async Task<ActionResult<IEnumerable<TasksListDTO>>> GetTasks()
    {
        try
        {
            var userId = GetUserId();
            var tasks = await _taskService.GetAllTasks(userId);
            return Ok(tasks);
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }
    
    [HttpPost]
    public async Task<ActionResult> CreateTask([FromBody] TasksListDTO dto)
    {
        try
        {
            var userId = GetUserId();
            await _taskService.AddTask(userId, dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<ActionResult> UpdateTask([FromBody] TasksListDTO dto)
    {
        try
        {
            var userId = GetUserId();
            await _taskService.UpdateTask(userId, dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTask(int id)
    {
        try
        {
            var userId = GetUserId();
            await _taskService.DeleteTask(userId, id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}