using Microsoft.AspNetCore.Mvc;

namespace TaskOrganizer.Server.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TaskController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok();
    }  
}