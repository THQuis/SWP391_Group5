using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;

namespace Smoking.DAL.Repositories
{
    public class AchievementRepository : GenericRepository<Achievement>, IAchievementRepository
    {
        public AchievementRepository(AppDbContext context) : base(context)
        {
        }

        // Chưa có truy vấn đặc thù

        public async Task<Achievement> GetByIdAsync(int achievementId)
        {
            return await _context.Achievements
                                 .FirstOrDefaultAsync(a => a.AchievementID == achievementId);
        }

    }
}
