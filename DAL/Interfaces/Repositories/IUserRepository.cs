using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByEmailAndPasswordAsync(string email, string password);

        // Thêm phương thức GetByRoleIdAsync để lấy tất cả người dùng theo RoleId
        Task<List<User>> GetByRoleIdAsync(int roleId);
    }
}
