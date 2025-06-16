using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class UserAchievementService : IUserAchievementService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly INotificationService _notificationService;
        private readonly IMailService _mailService;

        public UserAchievementService(IUnitOfWork unitOfWork, INotificationService notificationService, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _notificationService = notificationService;
            _mailService = mailService;
        }

        public async Task<bool> GrantAchievementAsync(int userId, int achievementId, bool sendEmail = true)
        {
            // Bước 1: Kiểm tra dữ liệu có tồn tại
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            var achievement = await _unitOfWork.Achievements.GetByIdAsync(achievementId);

            if (user == null || achievement == null)
                return false;

            // Bước 2: Kiểm tra có cấp trước đó chưa (sửa đúng vị trí kiểm tra trùng lặp)
            var existedList = await _unitOfWork.UserAchievements.FindAsync(x => x.UserID == userId && x.AchievementID == achievementId);
            if (existedList.Any())
                return false;

            // Bước 3: Thêm thành tựu mới
            var userAchievement = new UserAchievement
            {
                UserID = userId,
                AchievementID = achievementId,
                AwardedDate = DateTime.Now
            };

            await _unitOfWork.UserAchievements.AddAsync(userAchievement);

            // Bước 4: Tạo thông báo
            var notify = new Notification
            {
                UserID = userId,
                Message = $"Bạn đã đạt thành tựu: {achievement.AchievementName}. Tiếp tục cố gắng nhé!",
                NotificationType = "Achievement",
                NotificationName = "Thành tựu mới",
                SentAt = DateTime.Now,
                Condition = "Đã gửi",
                NotificationFor = "Cá nhân",
                CreatedBy = "System"
            };

            await _notificationService.CreateAsync(notify);

            // Bước 5: Gửi email (nếu cần)
            if (sendEmail && !string.IsNullOrEmpty(user.Email))
            {
                try
                {
                    await _mailService.SendEmailAsync(user.Email, "Bạn vừa đạt thành tựu mới!", notify.Message);
                }
                catch { }
            }

            // Bước 6: Lưu thay đổi vào database
            var saveResult = await _unitOfWork.CompleteAsync();
            return saveResult > 0;
        }

        public async Task<IEnumerable<UserAchievement>> GetByUserIdAsync(int userId)
        {
            return await _unitOfWork.UserAchievements.GetByUserIdAsync(userId);
        }
    }
}
