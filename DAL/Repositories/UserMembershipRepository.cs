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
                .Include(um => um.MembershipPackage)  // Đảm bảo dùng đúng tên navigation property
                .Where(um => um.UserId == userId)  // Kiểm tra đúng tên thuộc tính UserId
                .AsNoTracking()  // Tránh theo dõi các đối tượng
                .ToListAsync();
        }


    }
}
