using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IQuitPlanSelectedAnswerRepository : IGenericRepository<QuitPlanSelectedAnswers>
    {
        Task<List<QuitPlanSelectedAnswers>> GetAnswersByQuitPlanIdAsync(int quitPlanId);
    }
}
