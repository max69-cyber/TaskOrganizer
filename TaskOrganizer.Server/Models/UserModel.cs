namespace TaskOrganizer.Server.Models;

public class UserModel
{
    public int ID { get; set; }
    public string Login { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public DateTime CreatedAt { get; set; }
    public string FullName { get; set; }
    
    public List<TaskModel> Tasks { get; set; }
    public List<CategoryModel> Categories { get; set; }
}