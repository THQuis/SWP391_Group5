using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IUserMembershipService
    {
        Task<IEnumerable<UserMembership>> GetAllAsync();
        Task<UserMembership> GetByIdAsync(int id);
        Task<IEnumerable<UserMembership>> GetByUserIdAsync(int userId);
        Task<UserMembership> CreateAsync(UserMembership entity);
        Task<bool> UpdateAsync(UserMembership entity);
        Task<bool> DeleteAsync(int id);
    }
}
