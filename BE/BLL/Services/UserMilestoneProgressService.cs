using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using Smoking.BLL.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class UserMilestoneProgressService : IUserMilestoneProgressService
    {
        private readonly IUserMilestoneProgressRepository _repository;

        public UserMilestoneProgressService(IUserMilestoneProgressRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<UserMilestoneProgress>> GetAllByUserIdAsync(int userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<UserMilestoneProgress> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task AddAsync(UserMilestoneProgress userMilestoneProgress)
        {
            await _repository.AddAsync(userMilestoneProgress);
        }
    }
}
