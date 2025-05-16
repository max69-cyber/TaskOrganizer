using Microsoft.AspNetCore.Mvc;
using TaskOrganizer.Server.Data;
using TaskOrganizer.Server.Models;
using TaskOrganizer.Server.Services.Interfaces;

namespace TaskOrganizer.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthorisationController : ControllerBase
{
    private readonly IAuthorisationService _authorisationService;

    public AuthorisationController(IAuthorisationService authorisationService)
    {
        _authorisationService = authorisationService;
    }
    
    [HttpPost]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        try
        {
            var result = await _authorisationService.GenerateToken(model);
            return Ok(new { token = result });
        }
        catch (Exception ex)
        {
            return Unauthorized(ex.Message);
        }
    }
}