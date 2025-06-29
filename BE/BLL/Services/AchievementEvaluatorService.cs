using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

public class AchievementEvaluatorService : IAchievementEvaluatorService
{
    private readonly IUnitOfWork _unitOfWork;

    public AchievementEvaluatorService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> EvaluateAndGrantAchievementsAsync(int userId)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return false;

        var quitPlan = (await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active"))
                       .FirstOrDefault();
        if (quitPlan == null) return false;

        var progresses = await _unitOfWork.QuitProgresses.FindAsync(x => x.QuitPlanID == quitPlan.QuitPlanID);
        if (!progresses.Any()) return false;

        int smokeFreeDays = progresses.Count(x => x.CigarettesSmokedToday == 0);
        decimal moneySaved = progresses.Sum(x => x.MoneySaved);
        int cigarettesDropped = progresses.Sum(x => x.CigarettesDropped ?? 0);

        var allAchievements = await _unitOfWork.Achievements.GetAllAsync();
        var userAchievements = await _unitOfWork.UserAchievements.GetByUserIdAsync(userId);
        var grantedAchievementIds = userAchievements.Select(ua => ua.AchievementID).ToHashSet();

        foreach (var achievement in allAchievements)
        {
            if (grantedAchievementIds.Contains(achievement.AchievementID))
                continue;

            bool eligible =
                (achievement.SmokeFreeDaysRequired.HasValue && smokeFreeDays >= achievement.SmokeFreeDaysRequired.Value) ||
                (achievement.MoneySavedRequired.HasValue && moneySaved >= achievement.MoneySavedRequired.Value) ||
                (achievement.CigarettesDroppedRequired.HasValue && cigarettesDropped >= achievement.CigarettesDroppedRequired.Value);

            if (eligible)
            {
                await GrantAchievement(userId, achievement.AchievementID);
            }
        }

        return true;
    }

    private async Task GrantAchievement(int userId, int achievementId)
    {
        var userAchievement = new UserAchievement
        {
            UserID = userId,
            AchievementID = achievementId,
            AwardedDate = DateTime.Now
        };

        await _unitOfWork.UserAchievements.AddAsync(userAchievement);
        await _unitOfWork.CompleteAsync();
    }
}
