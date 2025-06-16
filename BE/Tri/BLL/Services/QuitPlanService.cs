using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

public class QuitPlanService : IQuitPlanService
{
    private readonly IUnitOfWork _unitOfWork;

    public QuitPlanService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<QuitPlan>> GetAllAsync() => await _unitOfWork.QuitPlans.GetAllAsync();

    public async Task<QuitPlan> GetByIdAsync(int id) => await _unitOfWork.QuitPlans.GetByIdAsync(id);

    public async Task<IEnumerable<QuitPlan>> GetByUserIdAsync(int userId)
    {
        return await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId);
    }

    public async Task<QuitPlan> CreateAsync(QuitPlan entity)
    {
        await _unitOfWork.QuitPlans.AddAsync(entity);
        await _unitOfWork.CompleteAsync();
        return entity;
    }

    public async Task<bool> UpdateAsync(QuitPlan entity)
    {
        await _unitOfWork.CompleteAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var plan = await _unitOfWork.QuitPlans.GetByIdAsync(id);
        if (plan == null) return false;
        _unitOfWork.QuitPlans.Remove(plan);
        await _unitOfWork.CompleteAsync();
        return true;
    }
}
