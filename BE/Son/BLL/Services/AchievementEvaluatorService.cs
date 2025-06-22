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

        var quitPlans = await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active");
        var quitPlan = quitPlans.FirstOrDefault();
        if (quitPlan == null) return false;

        var quitProgresses = await _unitOfWork.QuitProgresses.FindAsync(x => x.QuitPlanID == quitPlan.QuitPlanID);

        int smokeFreeDays = quitProgresses.Count(x => x.CigarettesSmokedToday == 0);
        decimal moneySaved = quitProgresses.Sum(x => x.MoneySaved);

        if (smokeFreeDays >= 7)
        {
            await GrantAchievement(userId, 1);
        }

        if (moneySaved >= 100000)
        {
            await GrantAchievement(userId, 2); // Giả sử AchievementID = 2 là thành tựu 100K
        }

        return true;
    }

    private async Task GrantAchievement(int userId, int achievementId)
    {
        var achievement = new UserAchievement
        {
            UserID = userId,
            AchievementID = achievementId,
            AwardedDate = DateTime.Now
        };

        await _unitOfWork.UserAchievements.AddAsync(achievement);
        await _unitOfWork.CompleteAsync();
    }
}
