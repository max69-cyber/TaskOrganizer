using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TaskOrganizer.Server.Data;
using TaskOrganizer.Server.Hubs;

namespace TaskOrganizer.Server.Services;

public class NotificationBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public NotificationBackgroundService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDataContext>();
            var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<NotificationsHub>>();
            
            var now = DateTime.UtcNow;

            var notifications = await dbContext.Reminders
                .Include(n => n.TaskFK)
                .ThenInclude(t => t.UserFK)
                .Where(n => n.Status && 
                            n.TaskFK != null && 
                            n.TaskFK.UserFK != null &&
                            n.TaskFK.DueDate <= now.AddMinutes(n.TimeBefore))
                .ToListAsync();

            {
                foreach (var notification in notifications)
                {
                    int userId = notification.TaskFK.UserFK.ID;
                    
                    await hubContext.Clients.Group($"user-{userId}")
                        .SendAsync("ReceiveTaskNotification", new
                        {
                            Title = $"Напоминание по задаче #{notification.TaskFK.ID}",
                            Content = $"Осталось {notification.TimeBefore} минут.",
                            CreatedAt = DateTime.UtcNow
                        });
                    
                    notification.Status = false;
                    await dbContext.SaveChangesAsync();
                }
                
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);

            }
        }
    }
}