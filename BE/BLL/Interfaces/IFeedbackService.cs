using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IFeedbackService
    {
        Task<IEnumerable<Feedback>> GetAllAsync();
        Task<Feedback> GetByIdAsync(int id);
        Task<IEnumerable<Feedback>> GetByUserIdAsync(int userId);
        Task<Feedback> CreateAsync(Feedback entity);
        Task<bool> UpdateAsync(Feedback entity);
        Task<bool> DeleteAsync(int id);
    }
}
