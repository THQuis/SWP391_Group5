using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
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

    public AchievementAndProgressController(IQuitProgressService quitProgressService,
                                             IUserAchievementService userAchievementService,
                                             IUnitOfWork unitOfWork)
    {
        _quitProgressService = quitProgressService;
        _userAchievementService = userAchievementService;
        _unitOfWork = unitOfWork;
    }

    // API lấy thông tin thành tựu và tiến trình cai thuốc của người dùng
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetAchievementAndProgressStats(int userId)
    {
        // Lấy thông tin về kế hoạch cai thuốc của người dùng
        var quitPlans = await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active");

        if (quitPlans == null || !quitPlans.Any())
        {
            return NotFound("Không có kế hoạch cai thuốc cho người dùng.");
        }

        // Tổng số tiền tiết kiệm và số điếu bỏ
        decimal totalMoneySaved = 0;
        int totalCigarettesDropped = 0;

        // Lặp qua các kế hoạch cai thuốc và tính tổng số tiền tiết kiệm và số điếu bỏ
        foreach (var quitPlan in quitPlans)
        {
            if (quitPlan.QuitProgresses != null && quitPlan.QuitProgresses.Any())
            {
                totalMoneySaved += quitPlan.QuitProgresses.Sum(y => y.MoneySaved);  // Tính tổng tiền tiết kiệm
                totalCigarettesDropped += quitPlan.QuitProgresses.Sum(y => y.CigarettesSmoked);  // Tính tổng số điếu bỏ
            }
        }

        // Lấy thông tin thành tựu của người dùng
        var achievements = await _userAchievementService.GetAchievementsByUserIdAsync(userId);
        int totalAchievements = achievements.Count();

        var stats = new
        {
            TotalAchievements = totalAchievements,
            TotalCigarettesDropped = totalCigarettesDropped,
            TotalMoneySaved = totalMoneySaved
        };

        return Ok(stats);
    }

}
