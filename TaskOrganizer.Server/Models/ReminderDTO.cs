namespace TaskOrganizer.Server.Models;

public class ReminderDTO
{
    public int ID { get; set; }
    public int TaskID { get; set; }
    public int TimeBefore { get; set; }
    public bool Status { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
}