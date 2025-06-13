using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class QuitPlanService : IQuitPlanService
    {
        private readonly IUnitOfWork _unitOfWork;

        public QuitPlanService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<QuitPlan> CreateAsync(QuitPlan entity)
        {
            await _unitOfWork.QuitPlans.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.QuitPlans.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.QuitPlans.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<QuitPlan>> GetAllAsync()
        {
            return await _unitOfWork.QuitPlans.GetAllAsync();
        }

        public async Task<IEnumerable<QuitPlan>> GetByUserIdAsync(int userId)
        {
            return await _unitOfWork.QuitPlans.GetByUserIdAsync(userId);
        }

        public async Task<QuitPlan> GetByIdAsync(int id)
        {
            return await _unitOfWork.QuitPlans.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(QuitPlan entity)
        {
            var existing = await _unitOfWork.QuitPlans.GetByIdAsync(entity.QuitPlanID);
            if (existing == null)
                return false;

            existing.StartDate = entity.StartDate;
            existing.EndDate = entity.EndDate;
            existing.PlanDetails = entity.PlanDetails;
            existing.Reason = entity.Reason;
            // CreatedDate giữ nguyên

            _unitOfWork.QuitPlans.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
