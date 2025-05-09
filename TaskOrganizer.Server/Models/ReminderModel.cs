namespace TaskOrganizer.Server.Models;

public class ReminderModel
{
    public int ID { get; set; }
    public int TaskID { get; set; }
    public DateTime ReminderTime { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public TaskModel TaskFK { get; set; }
    
}