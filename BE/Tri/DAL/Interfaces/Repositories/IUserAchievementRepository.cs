using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Interface cho UserAchievement, bổ sung GetByUserIdAsync
    /// </summary>
    public interface IUserAchievementRepository : IGenericRepository<UserAchievement>
    {
        Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId);
    }
}
