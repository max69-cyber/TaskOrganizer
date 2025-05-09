using TaskOrganizer.Server.Models;

namespace TaskOrganizer.Server.Services.Interfaces;

public interface ITaskService
{
    Task<List<TasksListDTO>> GetAllTasks(int userId);
    Task AddTask(int userId, TasksListDTO dto);
    Task UpdateTask(int userId, int taskId, TasksListDTO dto);
    Task DeleteTask(int userId, int taskId);
}