using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class UserMembershipRepository : GenericRepository<UserMembership>, IUserMembershipRepository
    {
        public UserMembershipRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<UserMembership>> GetByUserIdAsync(int userId)
        {
            return await _context.UserMemberships
                                 .Include(um => um.Package)
                                 .Where(um => um.UserID == userId)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        // Phương thức Update (cập nhật thông tin thành viên)
        public async Task Update(UserMembership entity)
        {
            _context.UserMemberships.Update(entity);
            await _context.SaveChangesAsync();
        }

        // Phương thức Remove (xóa thành viên)
        public async Task Remove(UserMembership entity)
        {
            _context.UserMemberships.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}
