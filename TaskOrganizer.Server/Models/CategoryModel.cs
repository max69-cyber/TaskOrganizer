namespace TaskOrganizer.Server.Models;

public class CategoryModel
{
    public int ID { get; set; }
    public string Name { get; set; }
    public int UserID { get; set; }
    
    public List<TaskModel> Tasks { get; set; }
    
    public UserModel UserFK { get; set; }
}