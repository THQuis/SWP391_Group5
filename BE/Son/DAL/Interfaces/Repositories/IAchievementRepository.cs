using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IAchievementRepository : IGenericRepository<Achievement>
    {
        Task<IEnumerable<Achievement>> SearchAsync(string keyword);
    }
}
