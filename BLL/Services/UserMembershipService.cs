using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class UserMembershipService : IUserMembershipService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserMembershipService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<UserMembership> CreateAsync(UserMembership entity)
        {
            await _unitOfWork.UserMemberships.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.UserMemberships.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.UserMemberships.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<UserMembership>> GetAllAsync()
        {
            return await _unitOfWork.UserMemberships.GetAllAsync();
        }

        public async Task<IEnumerable<UserMembership>> GetByUserIdAsync(int userId)
        {
            return await _unitOfWork.UserMemberships.GetByUserIdAsync(userId);
        }

        public async Task<UserMembership> GetByIdAsync(int id)
        {
            return await _unitOfWork.UserMemberships.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(UserMembership entity)
        {
            // Lấy đối tượng UserMembership hiện có từ cơ sở dữ liệu
            var existing = await _unitOfWork.UserMemberships.GetByIdAsync(entity.UserMembershipId);  // Đảm bảo sử dụng đúng tên thuộc tính "UserMembershipId"

            if (existing == null)
                return false;  // Nếu không tìm thấy UserMembership, trả về false

            // Cập nhật thông tin UserMembership từ đối tượng entity
            existing.UserId = entity.UserId;  // Đảm bảo đúng tên thuộc tính là UserId
            existing.PackageId = entity.PackageId;  // Đảm bảo đúng tên thuộc tính là PackageId
            existing.StartDate = entity.StartDate;  // Cập nhật ngày bắt đầu
            existing.EndDate = entity.EndDate;  // Cập nhật ngày kết thúc
            existing.PaymentStatus = entity.PaymentStatus;  // Cập nhật trạng thái thanh toán

            // Cập nhật vào cơ sở dữ liệu
            _unitOfWork.UserMemberships.Update(existing);

            // Lưu thay đổi vào cơ sở dữ liệu
            await _unitOfWork.CompleteAsync();

            // Trả về true nếu cập nhật thành công
            return true;
        }

    }
}
