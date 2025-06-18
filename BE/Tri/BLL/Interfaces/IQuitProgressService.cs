using Smoking.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IQuitProgressService
    {
        Task<IEnumerable<QuitProgress>> GetByPlanIdAsync(int quitPlanId);  // Lấy tiến trình của một kế hoạch
        Task<QuitProgress> GetByDateAsync(int quitPlanId, DateTime progressDate);  // Lấy tiến trình của một ngày
        Task<bool> CreateQuitProgressAsync(int quitPlanId, DateTime progressDate, int cigarettesSmoked, decimal pricePerPack, int cigarettesPerPack);  // Tạo tiến trình cai thuốc
        Task<bool> UpdateQuitProgressAsync(int quitPlanId, DateTime progressDate, int cigarettesSmoked, decimal pricePerPack, int cigarettesPerPack, int? cigarettesSmokedToday);
        Task<bool> DeleteProgressAsync(int progressId);  // Xóa tiến trình cai thuốc
    }
}
