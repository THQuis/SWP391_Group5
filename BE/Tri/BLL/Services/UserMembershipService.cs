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
            var existing = await _unitOfWork.UserMemberships.GetByIdAsync(entity.UserMembershipID);
            if (existing == null)
                return false;

            existing.UserID = entity.UserID;
            existing.PackageID = entity.PackageID;
            existing.StartDate = entity.StartDate;
            existing.EndDate = entity.EndDate;
            existing.PaymentStatus = entity.PaymentStatus;

            _unitOfWork.UserMemberships.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
