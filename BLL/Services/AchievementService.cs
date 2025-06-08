using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class AchievementService : IAchievementService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AchievementService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Achievement> CreateAsync(Achievement entity)
        {
            await _unitOfWork.Achievements.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.Achievements.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.Achievements.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<Achievement>> GetAllAsync()
        {
            return await _unitOfWork.Achievements.GetAllAsync();
        }

        public async Task<Achievement> GetByIdAsync(int id)
        {
            return await _unitOfWork.Achievements.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(Achievement entity)
        {
            var existing = await _unitOfWork.Achievements.GetByIdAsync(entity.AchievementID);
            if (existing == null)
                return false;

            existing.AchievementName = entity.AchievementName;
            existing.Description = entity.Description;
            existing.Criteria = entity.Criteria;
            existing.BadgeImage = entity.BadgeImage;
            existing.PackageType = entity.PackageType;

            _unitOfWork.Achievements.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
