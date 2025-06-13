using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class UserAchievementService : IUserAchievementService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserAchievementService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<UserAchievement> CreateAsync(UserAchievement entity)
        {
            await _unitOfWork.UserAchievements.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.UserAchievements.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.UserAchievements.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<UserAchievement>> GetAllAsync()
        {
            return await _unitOfWork.UserAchievements.GetAllAsync();
        }

        public async Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId)
        {
            return await _unitOfWork.UserAchievements.GetByUserIdAsync(userId);
        }

        public async Task<UserAchievement> GetByIdAsync(int id)
        {
            return await _unitOfWork.UserAchievements.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(UserAchievement entity)
        {
            var existing = await _unitOfWork.UserAchievements.GetByIdAsync(entity.UserAchievementID);
            if (existing == null)
                return false;

            existing.UserID = entity.UserID;
            existing.AchievementID = entity.AchievementID;
            existing.AwardedDate = entity.AwardedDate;

            _unitOfWork.UserAchievements.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
