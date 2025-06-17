using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Interfaces.Repositories;

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

    // API để người dùng nhập số điếu thuốc đã hút trong ngày và tính tiền tiết kiệm
    [HttpPost("user/{userId}/update-progress")]
    public async Task<IActionResult> UpdateQuitProgress(int userId, [FromBody] UpdateQuitProgressRequest request)
    {
        // Gọi phương thức UpdateQuitProgressAsync để xử lý
        var result = await _quitProgressService.UpdateQuitProgressAsync(
            userId,
            request.ProgressDate,
            request.CigarettesSmoked,
            request.PricePerPack,
            request.CigarettesPerPack,
            request.CigarettesSmokedToday);

        if (result)
        {
            return Ok("Tiến trình cai thuốc đã được cập nhật thành công.");
        }
        else
        {
            return BadRequest("Có lỗi khi cập nhật tiến trình cai thuốc.");
        }
    }
}
