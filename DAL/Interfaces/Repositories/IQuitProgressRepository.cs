using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Interface cho QuitProgress, bổ sung GetByQuitPlanIdAsync
    /// </summary>
    public interface IQuitProgressRepository : IGenericRepository<QuitProgress>
    {
        Task<IEnumerable<QuitProgress>> GetByQuitPlanIdAsync(int quitPlanId);
    }
}
