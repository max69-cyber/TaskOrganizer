using Microsoft.EntityFrameworkCore;
using TaskOrganizer.Server.Data;
using TaskOrganizer.Server.Models;
using TaskOrganizer.Server.Services.Interfaces;

namespace TaskOrganizer.Server.Services;

public class TaskService : ITaskService
{
    private readonly AppDataContext _context;

    public TaskService(AppDataContext context)
    {
        _context = context;
    }
    
    public async Task<List<TasksListDTO>> GetAllTasks(int userId)
    {
        var response = await _context.Tasks
            .Where(t => t.UserID == userId)
            .Select(t => new TasksListDTO
            {
                ID = t.ID,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                Priority = t.PrioritiyFK.Name,
                Category = t.CategoryFK.Name,
                Condition = t.Condition
            })
            .ToListAsync();
        
        return response;
    }

    public async Task AddTask(int userId, TasksListDTO dto)
    {
        int? categoryId = null;
        if (dto.Category != null)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Name == dto.Category);
            if (category != null)
            {
                categoryId = category.ID;
            }
            else throw new Exception($"Category {dto.Category} not found");
        }
        
        var priority = await _context.Priorities
            .FirstOrDefaultAsync(p => p.Name == dto.Priority);
        if (priority == null)
        {
            throw new Exception("Failed to find priority");
        }

        var task = new TaskModel
        {
            Title = dto.Title,
            Description = dto.Description,
            DueDate = dto.DueDate,
            PriorityID = priority.ID,
            CategoryID = categoryId,
            UserID = userId,
            Condition = dto.Condition
        };
        
        await _context.Tasks.AddAsync(task);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateTask(int userId, TasksListDTO dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name == dto.Category);
            
        
        var priority = await _context.Priorities
            .FirstOrDefaultAsync(p => p.Name == dto.Priority);
        if (priority == null)
        {
            throw new Exception("Failed to find priority");
        }
        
        var updatedTask = await _context.Tasks
            .FirstOrDefaultAsync(t => t.ID == dto.ID && t.UserID == userId);
        if (updatedTask == null)
        {
            throw new Exception("No access or doesn't exist.");
        }
        
        updatedTask.Title = dto.Title;
        updatedTask.Description = dto.Description;
        updatedTask.DueDate = dto.DueDate;
        updatedTask.PriorityID = priority.ID;
        updatedTask.CategoryID = category.ID;
        updatedTask.Condition = dto.Condition;
        
        await _context.SaveChangesAsync();
    }

    public async Task DeleteTask(int userId, int taskId)
    {
        var taskToDelete = await _context.Tasks
            .FirstOrDefaultAsync(t => t.ID == taskId && t.UserID == userId);
        if (taskToDelete == null)
        {
            throw new Exception("No access or doesn't exist.");
        }
        
        _context.Tasks.Remove(taskToDelete);
        
        await _context.SaveChangesAsync();
    }
}