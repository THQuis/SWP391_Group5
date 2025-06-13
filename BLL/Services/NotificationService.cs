using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NotificationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Notification> CreateAsync(Notification entity)
        {
            await _unitOfWork.Notifications.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.Notifications.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.Notifications.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<Notification>> GetAllAsync()
        {
            return await _unitOfWork.Notifications.GetAllAsync();
        }

        public async Task<IEnumerable<Notification>> GetByUserIdAsync(int userId)
        {
            return await _unitOfWork.Notifications.GetByUserIdAsync(userId);
        }

        public async Task<Notification> GetByIdAsync(int id)
        {
            return await _unitOfWork.Notifications.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(Notification entity)
        {
            var existing = await _unitOfWork.Notifications.GetByIdAsync(entity.NotificationID);
            if (existing == null)
                return false;

            existing.UserID = entity.UserID;
            existing.Message = entity.Message;
            existing.NotificationDate = entity.NotificationDate;
            existing.NotificationType = entity.NotificationType;

            _unitOfWork.Notifications.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
