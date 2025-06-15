using Smoking.DAL.Entities;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Interface cho Achievement (không có phương thức đặc biệt)
    /// </summary>
    public interface IAchievementRepository : IGenericRepository<Achievement>
    {
        Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId);
    }
}
