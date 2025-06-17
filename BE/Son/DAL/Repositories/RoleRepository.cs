using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class RoleRepository : GenericRepository<Role>, IRoleRepository
    {
        public RoleRepository(AppDbContext context) : base(context)
        {
        }

        // Phương thức lấy Role theo tên
        public async Task<Role> GetByNameAsync(string roleName)
        {
            return await _context.Roles
                                 .AsNoTracking()
                                 .FirstOrDefaultAsync(r => r.RoleName == roleName);
        }

        // Cài đặt phương thức Update cho Role
        public async Task Update(Role entity)
        {
            _context.Roles.Update(entity); // Cập nhật Role
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }

        // Cài đặt phương thức Remove cho Role
        public async Task Remove(Role entity)
        {
            _context.Roles.Remove(entity); // Xóa Role
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }
    }
}
