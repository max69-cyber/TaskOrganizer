namespace TaskOrganizer.Server.Models;

public class TasksListDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
    public string Priority { get; set; }
    public string Category { get; set; }
    public bool Condition { get; set; }
}