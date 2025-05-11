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
    
    int userId = 1; // ADD JWT HAYAKU !!!!

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TasksListDTO>>> GetTasks()
    {
        var tasks = await _taskService.GetAllTasks(userId);
        return Ok(tasks);
    }
    
    [HttpPost]
    public async Task<ActionResult> CreateTask([FromBody] TasksListDTO dto)
    {
        try
        {
            await _taskService.AddTask(userId, dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTask(int id, [FromBody] TasksListDTO dto)
    {
        try
        {
            await _taskService.UpdateTask(userId, id, dto);
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
            await _taskService.DeleteTask(userId, id);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}