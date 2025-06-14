using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PaymentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Payment> CreateAsync(Payment entity)
        {
            await _unitOfWork.Payments.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.Payments.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.Payments.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _unitOfWork.Payments.GetAllAsync();
        }

        public async Task<IEnumerable<Payment>> GetByUserMembershipIdAsync(int userMembershipId)
        {
            return await _unitOfWork.Payments.GetByUserMembershipIdAsync(userMembershipId);
        }

        public async Task<Payment> GetByIdAsync(int id)
        {
            return await _unitOfWork.Payments.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(Payment entity)
        {
            var existing = await _unitOfWork.Payments.GetByIdAsync(entity.PaymentID);
            if (existing == null)
                return false;

            existing.UserMembershipID = entity.UserMembershipID;
            existing.Amount = entity.Amount;
            existing.PaymentDate = entity.PaymentDate;
            existing.PaymentMethod = entity.PaymentMethod;
            existing.Status = entity.Status;
            existing.TransactionReference = entity.TransactionReference;

            _unitOfWork.Payments.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
