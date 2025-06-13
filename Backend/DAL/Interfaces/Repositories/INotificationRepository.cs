using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Interface cho Notification, bổ sung GetByUserIdAsync
    /// </summary>
    public interface INotificationRepository : IGenericRepository<Notification>
    {
        Task<IEnumerable<Notification>> GetByUserIdAsync(int userId);
    }
}
