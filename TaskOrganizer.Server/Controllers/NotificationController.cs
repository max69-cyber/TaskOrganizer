using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskOrganizer.Server.Data;
using TaskOrganizer.Server.Models;

namespace TaskOrganizer.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class NotificationController : ControllerBase
{
    private readonly AppDataContext _dataContext;

    public NotificationController(AppDataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    [HttpPost]
    public async Task<IActionResult> SaveNotification([FromBody] ReminderDTO model)
    {
        try
        {
            var notification = await _dataContext.Reminders
                .FirstOrDefaultAsync(n => n.ID == model.ID && n.TaskID == model.TaskID);

            if (notification != null)
            {
                notification.TimeBefore = model.TimeBefore;
                notification.Status = model.Status;
            }
            else
            {
                await _dataContext.Reminders.AddAsync(new ReminderModel()
                {
                    TaskID = model.TaskID,
                    CreatedAt = model.CreatedAt,
                    Status = model.Status,
                    TimeBefore = model.TimeBefore
                });
            }
            await _dataContext.SaveChangesAsync();
            return Ok("Настройка уведомления сохранена");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}