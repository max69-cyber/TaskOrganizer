using TaskOrganizer.Server.Models;

namespace CategoryOrganizer.Server.Services.Interfaces;

public interface ICategoryService
{
    Task <List<CategoryModel>> GetAllCategories(int userId);
    Task AddCategory(int userId, CategoryDTO dto);
    Task UpdateCategory(int userId, CategoryDTO dto);
    Task DeleteCategory(int userId, int categoryId);
}