namespace TaskOrganizer.Server.Models;

public class TaskModel
{
    public int ID { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
    public int PriorityID { get; set; }
    public int? CategoryID { get; set; }
    public int UserID { get; set; }
    public bool Condition { get; set; }
    
    public List<ReminderModel> Reminders { get; set; }
    
    public PriorityModel PrioritiyFK { get; set; }
    public CategoryModel CategoryFK { get; set; }
    public UserModel UserFK { get; set; }
    
}