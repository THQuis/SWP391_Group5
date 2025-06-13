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

        public async Task<IEnumerable<Achievement>> GetAllAsync()
        {
            return await _unitOfWork.Achievements.GetAllAsync();
        }

        public async Task<Achievement> GetByIdAsync(int id)
        {
            return await _unitOfWork.Achievements.GetByIdAsync(id);
        }

        public async Task<Achievement> CreateAsync(Achievement entity)
        {
            await _unitOfWork.Achievements.AddAsync(entity);
            await _unitOfWork.CompleteAsync(); // Lưu thay đổi vào DB
            return entity;
        }

        public async Task<bool> UpdateAsync(Achievement entity)
        {
            var existingAchievement = await _unitOfWork.Achievements.GetByIdAsync(entity.AchievementID);
            if (existingAchievement == null)
            {
                return false; // Không tìm thấy thành tích để cập nhật
            }

            // Cập nhật các thuộc tính
            existingAchievement.AchievementName = entity.AchievementName;
            existingAchievement.Description = entity.Description;
            existingAchievement.Criteria = entity.Criteria;
            existingAchievement.BadgeImage = entity.BadgeImage;
            existingAchievement.PackageType = entity.PackageType;

            _unitOfWork.Achievements.Update(existingAchievement);
            await _unitOfWork.CompleteAsync(); // Lưu thay đổi vào DB
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var achievement = await _unitOfWork.Achievements.GetByIdAsync(id);
            if (achievement == null)
            {
                return false; // Không tìm thấy thành tích để xóa
            }

            _unitOfWork.Achievements.Remove(achievement);
            await _unitOfWork.CompleteAsync(); // Lưu thay đổi vào DB
            return true;
        }
    }
}