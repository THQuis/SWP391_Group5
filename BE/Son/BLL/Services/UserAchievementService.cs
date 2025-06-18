using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
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
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            var achievement = await _unitOfWork.Achievements.GetByIdAsync(achievementId);

            if (user == null || achievement == null)
                return false;

            var existedList = await _unitOfWork.UserAchievements.FindAsync(x => x.UserID == userId && x.AchievementID == achievementId);
            if (existedList.Any())
                return false;

            var userAchievement = new UserAchievement
            {
                UserID = userId,
                AchievementID = achievementId,
                AwardedDate = DateTime.Now
            };

            await _unitOfWork.UserAchievements.AddAsync(userAchievement);

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

            if (sendEmail && !string.IsNullOrEmpty(user.Email))
            {
                try
                {
                    await _mailService.SendEmailAsync(user.Email, "Bạn vừa đạt thành tựu mới!", notify.Message);
                }
                catch { }
            }

            var saveResult = await _unitOfWork.CompleteAsync();

            return saveResult > 0;
        }

        // Cài đặt phương thức GetAchievementsByUserIdAsync
        public async Task<IEnumerable<UserAchievement>> GetAchievementsByUserIdAsync(int userId)
        {
            // Lấy danh sách thành tựu của người dùng từ cơ sở dữ liệu
            return await _unitOfWork.UserAchievements.FindAsync(x => x.UserID == userId);
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _unitOfWork.Users.GetByIdAsync(userId);
        }

        public async Task<Achievement> GetAchievementByIdAsync(int achievementId)
        {
            return await _unitOfWork.Achievements.GetByIdAsync(achievementId);
        }

    }
}