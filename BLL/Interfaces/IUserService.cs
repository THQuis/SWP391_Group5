using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(int id);
        Task<User> GetByEmailAsync(string email);
        Task<User> CreateAsync(User entity);
        Task<bool> UpdateAsync(User entity);
        Task<bool> DeleteAsync(int id);
        Task<User> AuthenticateAsync(string email, string password);

        // MỚI THÊM:
        Task DeleteUserByEmailAsync(string email);
        Task UpdateProfileAsync(string email, string fullName, string phoneNumber, string profilePicture);
    }
}
