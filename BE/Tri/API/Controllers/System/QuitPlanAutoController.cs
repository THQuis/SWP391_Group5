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
        var plan = await _quitPlanAutoService.CreateAutoQuitPlanAsync(
            request.UserId, request.CigarettesPerDay, request.PricePerPack, request.CigarettesPerPack
        );

        if (plan == null)
            return BadRequest("Bạn đã có kế hoạch đang hoạt động.");

        return Ok(new
        {
            message = "Tạo kế hoạch cai thuốc thành công.",
            startDate = plan.StartDate.ToString("dd/MM/yyyy"),
            planDetails = plan.PlanDetails.Split(Environment.NewLine)
        });
    }

}
