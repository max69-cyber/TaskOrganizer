using Microsoft.AspNetCore.Mvc;
using TaskOrganizer.Server.Data;

namespace TaskOrganizer.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TaskController : ControllerBase
{
    private readonly AppDataContext _context;

    public TaskController(AppDataContext context)
    {
        _context = context;
    }

    [HttpGet("db-connection")]
    public async Task<IActionResult> CheckDatabase()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            if (canConnect)
            {
                string name = _context.Users.First().Login;
                return Ok("Успешное подключение к базе данных!" + name);
            }
            return StatusCode(500, "Не удалось подключиться к базе данных.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Ошибка подключения: {ex.Message}");
        }
    } 
}