using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Interface cho UserMembership, bổ sung GetByUserIdAsync
    /// </summary>
    public interface IUserMembershipRepository : IGenericRepository<UserMembership>
    {
        Task<IEnumerable<UserMembership>> GetByUserIdAsync(int userId);
    }
}
