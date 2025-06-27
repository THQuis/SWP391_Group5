using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class UserQuitChallengeRepository : GenericRepository<UserQuitChallenge>, IUserQuitChallengeRepository
    {
        public UserQuitChallengeRepository(AppDbContext context) : base(context) { }

        public async Task<List<UserQuitChallenge>> GetChallengesForUserAsync(int userId, DateTime from, DateTime to)
        {
            return await _context.UserQuitChallenges
                .Include(x => x.Template)
                .Where(x => x.UserId == userId && x.ChallengeDate >= from && x.ChallengeDate <= to)
                .ToListAsync();
        }
    }
}
