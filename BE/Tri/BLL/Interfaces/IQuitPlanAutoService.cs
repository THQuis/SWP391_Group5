using Smoking.DAL.Entities;

namespace Smoking.BLL.Interfaces
{
    public interface IQuitPlanAutoService
    {
        Task<QuitPlan?> CreateAutoQuitPlanAsync(int userId, int cigarettesPerDay, decimal pricePerPack, int cigarettesPerPack);
    }
}
