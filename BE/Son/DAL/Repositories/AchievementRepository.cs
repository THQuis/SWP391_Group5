using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class AchievementRepository : GenericRepository<Achievement>, IAchievementRepository
    {
        private readonly AppDbContext _context;

        public AchievementRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Achievement>> SearchAsync(string keyword)
        {
            return await _context.Achievements
                .Where(a => a.AchievementName.Contains(keyword)
                         || a.Description.Contains(keyword)
                         || a.Criteria.Contains(keyword))
                .ToListAsync();
        }
    }
}
