using TaskOrganizer.Server.Models;

namespace TaskOrganizer.Server.Services.Interfaces;

public interface IAuthorisationService
{
    Task<string>  GenerateToken(LoginModel loginModel);
}