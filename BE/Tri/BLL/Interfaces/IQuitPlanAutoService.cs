namespace Smoking.BLL.Interfaces
{
    public interface IQuitPlanAutoService
    {
        Task<bool> CreateAutoQuitPlanAsync(int userId, int cigarettesPerDay, decimal pricePerPack, int cigarettesPerPack);
    }
}
