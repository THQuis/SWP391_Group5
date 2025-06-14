using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class QuitProgressService : IQuitProgressService
    {
        private readonly IUnitOfWork _unitOfWork;

        public QuitProgressService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<QuitProgress> CreateAsync(QuitProgress entity)
        {
            await _unitOfWork.QuitProgresses.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.QuitProgresses.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.QuitProgresses.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<QuitProgress>> GetAllAsync()
        {
            return await _unitOfWork.QuitProgresses.GetAllAsync();
        }

        public async Task<IEnumerable<QuitProgress>> GetByQuitPlanIdAsync(int quitPlanId)
        {
            return await _unitOfWork.QuitProgresses.GetByQuitPlanIdAsync(quitPlanId);
        }

        public async Task<QuitProgress> GetByIdAsync(int id)
        {
            return await _unitOfWork.QuitProgresses.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(QuitProgress entity)
        {
            var existing = await _unitOfWork.QuitProgresses.GetByIdAsync(entity.ProgressID);
            if (existing == null)
                return false;

            existing.Date = entity.Date;
            existing.CigarettesSmoked = entity.CigarettesSmoked;
            existing.PacksUsed = entity.PacksUsed;
            existing.MoneySaved = entity.MoneySaved;
            existing.Notes = entity.Notes;
            existing.DaysSmokeFree = entity.DaysSmokeFree;
            existing.HealthImprovement = entity.HealthImprovement;

            _unitOfWork.QuitProgresses.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
