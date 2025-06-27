using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;

[ApiController]
[Route("api/admin/challenge-templates")]
[Authorize(Roles = "1")]
public class QuitChallengeTemplateController : ControllerBase
{
    private readonly IQuitChallengeTemplateService _service;

    public QuitChallengeTemplateController(IQuitChallengeTemplateService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var templates = await _service.GetAllTemplatesAsync();
        return Ok(templates);
    }
}
