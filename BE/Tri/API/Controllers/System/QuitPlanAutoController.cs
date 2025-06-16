using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.System;
using Smoking.BLL.Interfaces;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "2")]
public class QuitPlanAutoController : ControllerBase
{
    private readonly IQuitPlanAutoService _quitPlanAutoService;

    public QuitPlanAutoController(IQuitPlanAutoService quitPlanAutoService)
    {
        _quitPlanAutoService = quitPlanAutoService;
    }

    [HttpPost("auto-create")]
    public async Task<IActionResult> AutoCreateQuitPlan([FromBody] AutoQuitPlanRequest request)
    {
        var success = await _quitPlanAutoService.CreateAutoQuitPlanAsync(
            request.UserId, request.CigarettesPerDay, request.PricePerPack, request.CigarettesPerPack
        );

        if (!success)
            return BadRequest("Không thể tạo kế hoạch tự động. vì bạn đã có kế hoạch rồi");

        return Ok("Tạo kế hoạch cai thuốc thành công.");
    }
}
