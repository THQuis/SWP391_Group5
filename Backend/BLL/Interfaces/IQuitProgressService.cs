using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IQuitProgressService
    {
        Task<IEnumerable<QuitProgress>> GetAllAsync();
        Task<QuitProgress> GetByIdAsync(int id);
        Task<IEnumerable<QuitProgress>> GetByQuitPlanIdAsync(int quitPlanId);
        Task<QuitProgress> CreateAsync(QuitProgress entity);
        Task<bool> UpdateAsync(QuitProgress entity);
        Task<bool> DeleteAsync(int id);
    }
}
