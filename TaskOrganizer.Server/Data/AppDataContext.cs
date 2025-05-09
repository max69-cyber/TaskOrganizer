using Microsoft.EntityFrameworkCore;
using TaskOrganizer.Server.Models;

namespace TaskOrganizer.Server.Data;

public class AppDataContext : DbContext
{
    public DbSet<TaskModel> Tasks { get; set; }
    public DbSet<CategoryModel> Categories { get; set; }
    public DbSet<PriorityModel> Priorities { get; set; }
    public DbSet<ReminderModel> Reminders { get; set; }
    public DbSet<UserModel> Users { get; set; }
    
    public AppDataContext(DbContextOptions<AppDataContext> options)
        : base(options)
    { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<CategoryModel>()
            .HasOne(c => c.UserFK)
            .WithMany(u => u.Categories)
            .HasForeignKey(c => c.UserID);
        
        modelBuilder.Entity<ReminderModel>()
            .HasOne(r => r.TaskFK)
            .WithMany(t => t.Reminders)
            .HasForeignKey(r => r.TaskID);
        
        modelBuilder.Entity<TaskModel>()
            .HasOne(t => t.PrioritiyFK)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.PriorityID);  
        
        modelBuilder.Entity<TaskModel>()
            .HasOne(t => t.CategoryFK)
            .WithMany(c => c.Tasks)
            .HasForeignKey(t => t.CategoryID); 
        
        modelBuilder.Entity<TaskModel>()
            .HasOne(t => t.UserFK)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserID);
    }
}