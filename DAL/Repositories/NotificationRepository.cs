using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class NotificationRepository : GenericRepository<Notification>, INotificationRepository
    {
        public NotificationRepository(AppDbContext context) : base(context) { }

        // Trả về IQueryable để có thể áp dụng Where, Include, v.v.
        public async Task<IQueryable<Notification>> GetAllWithUserAndRoleAsync()
        {
            return _context.Notifications
                .Include(n => n.User)          
                .ThenInclude(u => u.Role);     
        }

        public async Task<Notification> GetByIdWithUserAndRoleAsync(int id)
        {
            return await _context.Notifications
                .Include(n => n.User)
                .ThenInclude(u => u.Role)
                .FirstOrDefaultAsync(n => n.NotificationID == id);
        }
    }
}
