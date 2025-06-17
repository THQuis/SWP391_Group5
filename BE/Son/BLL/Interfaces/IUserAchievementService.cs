using System.Collections.Generic;
using System.Threading.Tasks;
using Smoking.DAL.Entities; // For User and Achievement entities

namespace Smoking.BLL.Interfaces
{
    public interface IUserAchievementService
    {
        Task<bool> GrantAchievementAsync(int userId, int achievementId, bool sendEmail = true);
        Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId);
        Task<User> GetUserByIdAsync(int userId);  // Add this method
        Task<Achievement> GetAchievementByIdAsync(int achievementId); // Add this method
    }
}
