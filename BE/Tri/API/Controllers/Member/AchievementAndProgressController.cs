using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AchievementAndProgressController : ControllerBase
{
    private readonly IQuitProgressService _quitProgressService;
    private readonly IUserAchievementService _userAchievementService;
    private readonly IUnitOfWork _unitOfWork;

    public AchievementAndProgressController(
        IQuitProgressService quitProgressService,
        IUserAchievementService userAchievementService,
        IUnitOfWork unitOfWork)
    {
        _quitProgressService = quitProgressService;
        _userAchievementService = userAchievementService;
        _unitOfWork = unitOfWork;
    }

    // ✅ API lấy thông tin tổng hợp tiến trình và thành tựu của người dùng
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetAchievementAndProgressStats(int userId)
    {
        var quitPlans = await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active");

        if (quitPlans == null || !quitPlans.Any())
            return NotFound("Không có kế hoạch cai thuốc cho người dùng.");

        decimal totalMoneySaved = 0;
        int totalCigarettesDropped = 0;

        foreach (var plan in quitPlans)
        {
            var progresses = await _unitOfWork.QuitProgresses.FindAsync(x => x.QuitPlanID == plan.QuitPlanID);

            if (progresses != null && progresses.Any())
            {
                totalMoneySaved += progresses.Sum(p => p.MoneySaved);
                totalCigarettesDropped += progresses.Sum(p => p.CigarettesDropped ?? 0);
            }
        }

        var achievements = await _userAchievementService.GetAchievementsByUserIdAsync(userId);

        return Ok(new
        {
            TotalAchievements = achievements.Count(),
            TotalCigarettesDropped = totalCigarettesDropped,
            TotalMoneySaved = totalMoneySaved
        });
    }

    // ✅ API cập nhật tiến trình cai thuốc (số thuốc hút hôm nay)
    [HttpPost("user/{userId}/update-progress")]
    public async Task<IActionResult> UpdateQuitProgress(int userId, [FromBody] UpdateQuitProgressRequest request)
    {
        var quitPlans = await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active");

        if (quitPlans == null || !quitPlans.Any())
            return NotFound("Không tìm thấy kế hoạch cai thuốc.");

        var quitPlan = quitPlans.First();
        var progressDate = DateTime.Today;

        var updateResult = await _quitProgressService.UpdateQuitProgressAsync(
            quitPlan.QuitPlanID,
            progressDate,
            request.CigarettesSmokedToday,
            quitPlan.PricePerPackAtStart,
            quitPlan.CigarettesPerPack
        );

        if (!updateResult)
            return BadRequest("Cập nhật tiến trình thất bại.");

        var updatedProgressList = await _quitProgressService.GetByPlanIdAsync(quitPlan.QuitPlanID);

        return Ok(new
        {
            Message = "Tiến trình cai thuốc đã được cập nhật thành công.",
            QuitProgress = updatedProgressList
        });
    }
}
