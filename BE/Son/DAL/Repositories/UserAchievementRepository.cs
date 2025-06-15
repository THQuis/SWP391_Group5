using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;

namespace Smoking.DAL.Repositories
{
    public class UserAchievementRepository : GenericRepository<UserAchievement>, IUserAchievementRepository
    {
        public UserAchievementRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId)
        {
            return await _context.UserAchievements
                .Where(ua => ua.UserID == userId)
                .Include(ua => ua.Achievement)  // Nếu cần, có thể bao gồm thông tin của Achievement
                .ToListAsync();
        }
    }
}
