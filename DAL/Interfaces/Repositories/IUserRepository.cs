using Smoking.DAL.Entities;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User> GetByEmailAsync(string email);
        Task<User> GetByEmailAndPasswordAsync(string email, string password);
        Task<IEnumerable<User>> GetAllWithRolesAsync();
        // Thêm phương thức GetByRoleAsync để lấy người dùng theo role
        Task<IEnumerable<User>> GetByRoleAsync(string role); // Lấy người dùng theo role
    }
}
