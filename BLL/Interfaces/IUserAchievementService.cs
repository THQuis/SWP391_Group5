using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IUserAchievementService
    {
        Task<IEnumerable<UserAchievement>> GetAllAsync();
        Task<UserAchievement> GetByIdAsync(int id);
        Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId);
        Task<UserAchievement> CreateAsync(UserAchievement entity);
        Task<bool> UpdateAsync(UserAchievement entity);
        Task<bool> DeleteAsync(int id);
    }
}
