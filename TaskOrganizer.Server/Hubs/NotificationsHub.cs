using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TaskOrganizer.Server.Data;

namespace TaskOrganizer.Server.Hubs;

public class NotificationsHub : Hub
{
    private readonly AppDataContext _context;

    public NotificationsHub(AppDataContext context)
    {
        _context = context;
    }
    
    // this method executing when user connects to server
    public override async Task OnConnectedAsync()
    {
        
        string userId = Context.UserIdentifier; // receives user's id, what can to group all devices with single account

        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");  // adding current connection to authorised user's group
        }
        
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        string userId = Context.UserIdentifier;
        if (string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user-{userId}"); // delete this connection from user's group
        }
        
        await base.OnDisconnectedAsync(exception);
    }
    
    public async Task SendNotification(string userId, string message)
    {
        await Clients.Group($"user-{userId}").SendAsync("ReceiveTaskNotification", new
        {
            Title = "Срок задачи истекает!",
            Content = message,
            CreatedAt = DateTime.Now,
            
        });
    }
}