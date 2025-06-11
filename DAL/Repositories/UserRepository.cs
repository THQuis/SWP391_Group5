using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace Smoking.DAL.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        // Lấy người dùng theo email
        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        // Lấy người dùng theo email và mật khẩu
        public async Task<User> GetByEmailAndPasswordAsync(string email, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
        }

        // Lấy tất cả người dùng theo RoleID
        public async Task<List<User>> GetByRoleIdAsync(int roleId)
        {
            return await _context.Users.Where(u => u.RoleID == roleId).ToListAsync();  // Lọc người dùng theo RoleID
        }
    }
}
