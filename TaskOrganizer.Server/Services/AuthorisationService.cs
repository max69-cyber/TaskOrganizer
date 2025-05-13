using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TaskOrganizer.Server.Data;
using TaskOrganizer.Server.Models;
using TaskOrganizer.Server.Services.Interfaces;

namespace TaskOrganizer.Server.Services;

public class AuthorisationService : IAuthorisationService
{
    private readonly AppDataContext _context;
    private readonly IConfiguration _configuration;

    public AuthorisationService(AppDataContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<string> GenerateToken(LoginModel loginModel)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Login == loginModel.Login);
        Console.WriteLine(user.Login);
        if(user == null || !VerifyPassword(loginModel.Password, user.Password))
            throw new UnauthorizedAccessException("Invalid login or password");

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
            new Claim(ClaimTypes.Name, user.Login),
            new Claim("FullName", user.FullName),
            new Claim("Email", user.Email)
        };
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _configuration["JwtSettings:Issuer"],
            audience: _configuration["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(_configuration["JwtSettings:TokenLifetimeMinutes"])),
            signingCredentials: creds
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private bool VerifyPassword(string password, string expectedPassword)
    {
        // !! need to protect password
        return password == expectedPassword;
    }
}