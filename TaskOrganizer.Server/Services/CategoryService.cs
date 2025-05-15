using CategoryOrganizer.Server.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using TaskOrganizer.Server.Data;
using TaskOrganizer.Server.Models;
using TaskOrganizer.Server.Services.Interfaces;

namespace TaskOrganizer.Server.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDataContext _context;

    public CategoryService(AppDataContext context)
    {
        _context = context;
    }
    
    public async Task<List<CategoryModel>> GetAllCategories(int userId)
    {
        var response = await _context.Categories
            .Where(t => t.UserID == userId)
            .ToListAsync();
        
        return response;
    }

    public async Task AddCategory(int userId, CategoryDTO dto)
    {
        var category = new CategoryModel
        {
            Name = dto.Name,
            UserID = userId
        };
        
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCategory(int userId, CategoryDTO dto)
    {
        var updatedCategory = await _context.Categories
            .FirstOrDefaultAsync(t => t.ID == dto.ID && t.UserID == userId);
        if (updatedCategory == null)
        {
            throw new Exception("No access or doesn't exist.");
        }
        
        updatedCategory.Name = dto.Name;
        updatedCategory.UserID = userId;
        
        
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCategory(int userId, int categoryId)
    {
        var categoryToDelete = await _context.Categories
            .FirstOrDefaultAsync(t => t.ID == categoryId && t.UserID == userId);
        if (categoryToDelete == null)
        {
            throw new Exception("No access or doesn't exist.");
        }
        
        _context.Categories.Remove(categoryToDelete);
        
        await _context.SaveChangesAsync();
    }
}