using Microsoft.Extensions.Logging;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

public class AchievementEvaluatorService : IAchievementEvaluatorService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AchievementEvaluatorService> _logger;
    private readonly IMailService _mailService;

    public AchievementEvaluatorService(
        IUnitOfWork unitOfWork,
        ILogger<AchievementEvaluatorService> logger,
        IMailService mailService)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _mailService = mailService;
    }

    public async Task<bool> EvaluateAndGrantAchievementsAsync(int userId)
    {
        _logger.LogInformation("Đang đánh giá thành tựu cho UserID = {UserID}", userId);

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null)
        {
            _logger.LogWarning("Không tìm thấy người dùng với ID = {UserID}", userId);
            return false;
        }

        var quitPlan = (await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active"))
                        .FirstOrDefault();
        if (quitPlan == null)
        {
            _logger.LogWarning("Không tìm thấy QuitPlan đang hoạt động cho UserID = {UserID}", userId);
            return false;
        }

        var progresses = (await _unitOfWork.QuitProgresses.FindAsync(x => x.QuitPlanID == quitPlan.QuitPlanID))
                         .OrderByDescending(x => x.ProgressDate)
                         .ToList();

        if (!progresses.Any())
        {
            _logger.LogWarning("Không có dữ liệu QuitProgress cho UserID = {UserID}", userId);
            return false;
        }

        var latestProgress = progresses.First();
        int smokeFreeDays = progresses.Count(x => x.CigarettesSmokedToday == 0);
        decimal moneySaved = latestProgress.TotalMoneySaved ?? 0;
        int cigarettesDropped = latestProgress.TotalCigarettesDropped ?? 0;

        _logger.LogInformation("Tổng kết: SmokeFreeDays = {Days}, MoneySaved = {MoneySaved}, CigarettesDropped = {CigsDropped}",
            smokeFreeDays, moneySaved, cigarettesDropped);

        var allAchievements = await _unitOfWork.Achievements.GetAllAsync();
        var userAchievements = await _unitOfWork.UserAchievements.GetByUserIdAsync(userId);
        var grantedAchievementIds = userAchievements.Select(ua => ua.AchievementID).ToHashSet();

        foreach (var achievement in allAchievements)
        {
            if (grantedAchievementIds.Contains(achievement.AchievementID))
            {
                _logger.LogDebug("➡️ Đã có thành tựu {AchievementID}, bỏ qua", achievement.AchievementID);
                continue;
            }

            bool eligible =
                (achievement.SmokeFreeDaysRequired.HasValue && smokeFreeDays >= achievement.SmokeFreeDaysRequired.Value) ||
                (achievement.MoneySavedRequired.HasValue && moneySaved >= achievement.MoneySavedRequired.Value) ||
                (achievement.CigarettesDroppedRequired.HasValue && cigarettesDropped >= achievement.CigarettesDroppedRequired.Value);

            _logger.LogDebug("🔍 Kiểm tra AchievementID = {AchievementID} → Đủ điều kiện: {Eligible}",
                achievement.AchievementID, eligible);

            if (eligible)
            {
                await GrantAchievement(user, achievement);
            }
        }

        return true;
    }

    private async Task GrantAchievement(User user, Achievement achievement)
    {
        _logger.LogInformation("🏅 Cấp thành tựu {AchievementID} cho UserID = {UserID}", achievement.AchievementID, user.UserID);

        var userAchievement = new UserAchievement
        {
            UserID = user.UserID,
            AchievementID = achievement.AchievementID,
            AwardedDate = DateTime.Now
        };

        await _unitOfWork.UserAchievements.AddAsync(userAchievement);
        await _unitOfWork.CompleteAsync();

        if (!string.IsNullOrWhiteSpace(user.Email))
        {
            string subject = $"🎉 Bạn vừa đạt thành tựu: {achievement.AchievementName}!";
            string htmlBody = $@"
                <div style='font-family: Arial; max-width: 600px; margin: auto; border: 1px solid #ccc; padding: 20px;'>
                    <h2 style='color: green;'>🎉 Xin chúc mừng {user.FullName ?? "bạn"}!</h2>
                    <p>Bạn vừa đạt được một thành tựu mới trong hành trình cai thuốc:</p>
                    <h3 style='color: #2e6c80'>{achievement.AchievementName}</h3>
                    <p>{achievement.Description}</p>
                    <hr/>
                    <p style='font-size: 13px; color: gray;'>Smoking App &copy; 2025</p>
                </div>";

            try
            {
                await _mailService.SendHtmlEmailAsync(user.Email, subject, htmlBody);
                _logger.LogInformation("📧 Đã gửi email thành tựu đến {Email}", user.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gửi email thành tựu cho {Email}", user.Email);
            }
        }
        else
        {
            _logger.LogWarning("Không thể gửi email thành tựu cho UserID = {UserID} vì email trống.", user.UserID);
        }
    }
}