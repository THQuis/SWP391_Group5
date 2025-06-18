using Smoking.DAL.Entities;

namespace Smoking.BLL.Interfaces
{
    public interface IUserAchievementService
    {
        Task<bool> GrantAchievementAsync(int userId, int achievementId, bool sendEmail = true);
        Task<IEnumerable<UserAchievement>> GetAchievementsByUserIdAsync(int userId);

        // ✅ Thêm mới
        Task<User> GetUserByIdAsync(int userId);
        Task<Achievement> GetAchievementByIdAsync(int achievementId);
    }
}
