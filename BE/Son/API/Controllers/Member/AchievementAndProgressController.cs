using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "2")]
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

    [HttpGet("user/ProgressInformation")]
    public async Task<IActionResult> GetAchievementAndProgressStats(int userId)
    {
        var quitPlans = await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active");

        if (quitPlans == null || !quitPlans.Any())
            return NotFound("Không có kế hoạch cai thuốc cho người dùng.");

        decimal totalMoneySaved = 0;
        int totalCigarettesDropped = 0;
        int totalProgressDays = 0;

        foreach (var plan in quitPlans)
        {
            var progresses = await _unitOfWork.QuitProgresses.FindAsync(x => x.QuitPlanID == plan.QuitPlanID);

            if (progresses != null && progresses.Any())
            {
                totalMoneySaved += progresses.Sum(p => p.MoneySaved);
                totalCigarettesDropped += progresses.Sum(p => p.CigarettesDropped ?? 0);
                totalProgressDays += progresses.Count(); // Mỗi bản ghi là 1 ngày
            }
        }

        var achievements = await _userAchievementService.GetAchievementsByUserIdAsync(userId);

        return Ok(new
        {
            TotalAchievements = achievements.Count(),
            TotalCigarettesDropped = totalCigarettesDropped,
            TotalMoneySaved = totalMoneySaved,
            TotalProgressDays = totalProgressDays
        });
    }


    [HttpPost("user/UpdateProgress")]
    public async Task<IActionResult> UpdateQuitProgress(int userId, [FromBody] UpdateQuitProgressRequest request)
    {
        // Kiểm tra gói thành viên còn hiệu lực
        var validMembership = await _unitOfWork.UserMemberships
            .FindFirstOrDefaultAsync(m =>
                m.UserID == userId &&
                m.EndDate >= DateTime.Today &&
                (m.PaymentStatus == "Completed" || m.PaymentStatus == "AdminAssigned")
            );

        if (validMembership == null)
        {
            return StatusCode(403, "Chỉ người dùng có gói Premium mới được cập nhật tiến trình hằng ngày.");
        }

        // Kiểm tra loại gói là Premium
        var package = await _unitOfWork.MembershipPackages.GetByIdAsync(validMembership.PackageID);
        if (package == null || !string.Equals(package.PackageType, "Premium", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(403, "Chỉ người dùng có gói Premium mới được cập nhật tiến trình hằng ngày.");
        }

        // Tìm kế hoạch cai thuốc đang hoạt động
        var quitPlans = await _unitOfWork.QuitPlans
            .FindAsync(x => x.UserID == userId && x.Status == "Active");

        if (quitPlans == null || !quitPlans.Any())
        {
            return NotFound("Không tìm thấy kế hoạch cai thuốc.");
        }

        var quitPlan = quitPlans.First();
        var progressDate = DateTime.Today;

        // Cập nhật tiến trình
        var updateResult = await _quitProgressService.UpdateQuitProgressAsync(
            quitPlan.QuitPlanID,
            progressDate,
            request.CigarettesSmokedToday,
            quitPlan.PricePerPackAtStart,
            quitPlan.CigarettesPerPack
        );

        if (!updateResult)
        {
            return BadRequest("Cập nhật tiến trình thất bại.");
        }

        // Trả về tiến trình mới nhất sau cập nhật
        var updatedProgressList = await _quitProgressService.GetByPlanIdAsync(quitPlan.QuitPlanID);

        return Ok(new
        {
            Message = "Tiến trình cai thuốc đã được cập nhật thành công.",
            QuitProgress = updatedProgressList
        });
    }


    [HttpGet("user/showAllProgress")]
    public async Task<IActionResult> GetAllQuitProgress(int userId)
    {
        var quitPlans = await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId);

        if (quitPlans == null || !quitPlans.Any())
            return NotFound("Người dùng chưa có kế hoạch nào.");

        var allProgress = new List<object>();

        foreach (var plan in quitPlans)
        {
            var progresses = (await _unitOfWork.QuitProgresses
                .FindAsync(p => p.QuitPlanID == plan.QuitPlanID))
                .OrderBy(p => p.ProgressDate)
                .ToList();

            if (!progresses.Any()) continue;

            decimal cumulativeMoney = 0;
            int cumulativeCigarettes = 0;

            var progressListWithTotals = progresses.Select(p =>
            {
                cumulativeMoney += p.MoneySaved;
                cumulativeCigarettes += p.CigarettesDropped ?? 0;

                return new
                {
                    p.ProgressDate,
                    p.CigarettesPerDayBaseline,
                    p.CigarettesSmokedToday,
                    p.CigarettesDropped,
                    p.MoneySaved,
                    p.Notes,
                    p.LastSmokeDate,
                    TotalCigarettesDropped = cumulativeCigarettes,
                    TotalMoneySaved = cumulativeMoney
                };
            });

            allProgress.Add(new
            {
                PlanId = plan.QuitPlanID,
                PlanStartDate = plan.StartDate,
                PlanStatus = plan.Status,
                ProgressList = progressListWithTotals
            });
        }

        return Ok(allProgress);
    }


}
