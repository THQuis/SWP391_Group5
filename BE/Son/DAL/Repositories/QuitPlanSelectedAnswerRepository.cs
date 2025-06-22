using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class QuitPlanSelectedAnswerRepository : GenericRepository<QuitPlanSelectedAnswers>, IQuitPlanSelectedAnswerRepository
    {
        public QuitPlanSelectedAnswerRepository(AppDbContext context) : base(context) { }

        public async Task<List<QuitPlanSelectedAnswers>> GetAnswersByQuitPlanIdAsync(int quitPlanId)
        {
            return await _context.QuitPlanSelectedAnswers
                .Where(a => a.QuitPlanID == quitPlanId)
                .ToListAsync();
        }
    }
}
