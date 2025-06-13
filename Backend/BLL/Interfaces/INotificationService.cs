using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<Notification>> GetAllAsync();
        Task<Notification> GetByIdAsync(int id);
        Task<IEnumerable<Notification>> GetByUserIdAsync(int userId);
        Task<Notification> CreateAsync(Notification entity);
        Task<bool> UpdateAsync(Notification entity);
        Task<bool> DeleteAsync(int id);
    }
}
