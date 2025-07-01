using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IUserMilestoneProgressRepository
    {
        Task<List<UserMilestoneProgress>> GetByUserIdAsync(int userId);
        Task<UserMilestoneProgress> GetByIdAsync(int id);
        Task AddAsync(UserMilestoneProgress userMilestoneProgress);
    }
}
