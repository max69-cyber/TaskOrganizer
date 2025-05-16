namespace TaskOrganizer.Server.Models;

public class PriorityModel
{
    public int ID { get; set; }
    public string Name { get; set; }
    
    public List<TaskModel> Tasks { get; set; }
}