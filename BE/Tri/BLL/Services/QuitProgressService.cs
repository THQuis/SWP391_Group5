using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class QuitProgressService : IQuitProgressService
    {
        private readonly IUnitOfWork _unitOfWork;

        // Constructor nhận vào IUnitOfWork
        public QuitProgressService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // Lấy tiến trình cai thuốc của một kế hoạch (QuitPlan)
        public async Task<IEnumerable<QuitProgress>> GetByPlanIdAsync(int quitPlanId)
        {
            var quitProgresses = await _unitOfWork.QuitProgresses.FindAsync(x => x.QuitPlanID == quitPlanId);
            return quitProgresses;
        }

        // Lấy tiến trình cai thuốc theo ngày
        public async Task<QuitProgress> GetByDateAsync(int quitPlanId, DateTime progressDate)
        {
            var quitProgress = await _unitOfWork.QuitProgresses.FindFirstOrDefaultAsync(x => x.QuitPlanID == quitPlanId && x.ProgressDate == progressDate);
            return quitProgress;
        }


        // Cập nhật tiến trình cai thuốc
        public async Task<bool> UpdateQuitProgressAsync(int quitPlanId, DateTime progressDate, int cigarettesSmokedToday, decimal pricePerPack, int cigarettesPerPack)
        {
            var quitPlan = await _unitOfWork.QuitPlans.GetByIdAsync(quitPlanId);
            if (quitPlan == null) return false;

            decimal pricePerCigarette = pricePerPack / cigarettesPerPack;
            int cigarettesPerDayAtStart = quitPlan.CigarettesPerDayAtStart;

            // Tính số điếu đã bỏ hôm nay (có thể âm nếu hút nhiều hơn ban đầu)
            int cigarettesDropped = cigarettesPerDayAtStart - cigarettesSmokedToday;
            decimal moneySaved = (cigarettesDropped > 0) ? cigarettesDropped * pricePerCigarette : 0;

            var quitProgress = await _unitOfWork.QuitProgresses
                .FindFirstOrDefaultAsync(x => x.QuitPlanID == quitPlanId && x.ProgressDate == progressDate);

            if (quitProgress != null)
            {
                quitProgress.CigarettesSmokedToday = cigarettesSmokedToday;
                quitProgress.CigarettesDropped = cigarettesDropped;
                quitProgress.MoneySaved = moneySaved;
                quitProgress.LastSmokeDate = progressDate;
                quitProgress.Notes = "Đã cập nhật tiến trình";

                _unitOfWork.QuitProgresses.Update(quitProgress);
            }
            else
            {
                // Nếu chưa có bản ghi hôm nay, tạo mới
                quitProgress = new QuitProgress
                {
                    QuitPlanID = quitPlanId,
                    ProgressDate = progressDate,
                    CigarettesSmokedToday = cigarettesSmokedToday,
                    CigarettesDropped = cigarettesDropped,
                    MoneySaved = moneySaved,
                    LastSmokeDate = progressDate,
                    Notes = "Tiến trình mới"
                };

                await _unitOfWork.QuitProgresses.AddAsync(quitProgress);
            }

            // Lưu thay đổi đầu tiên (tạo hoặc cập nhật bản ghi hôm nay)
            var result = await _unitOfWork.CompleteAsync();

            if (result > 0)
            {
                // ✅ Cộng dồn tổng thuốc bỏ và tiền tiết kiệm trước ngày hôm nay
                var previousProgresses = await _unitOfWork.QuitProgresses
                    .FindAsync(x => x.QuitPlanID == quitPlanId && x.ProgressDate < progressDate);

                int totalCigsDroppedBefore = previousProgresses.Sum(p => p.CigarettesDropped ?? 0);
                decimal totalMoneySavedBefore = previousProgresses.Sum(p => p.MoneySaved);

                // Ghi tổng cộng dồn vào bản ghi hôm nay
                quitProgress.TotalCigarettesDropped = totalCigsDroppedBefore + cigarettesDropped;
                quitProgress.TotalMoneySaved = totalMoneySavedBefore + moneySaved;

                _unitOfWork.QuitProgresses.Update(quitProgress);
                await _unitOfWork.CompleteAsync();
            }

            return true;
        }





        // Xóa tiến trình cai thuốc
        public async Task<bool> DeleteProgressAsync(int progressId)
        {
            var quitProgress = await _unitOfWork.QuitProgresses.GetByIdAsync(progressId);
            if (quitProgress == null) return false;

            // Xóa tiến trình
            _unitOfWork.QuitProgresses.Remove(quitProgress);
            var result = await _unitOfWork.CompleteAsync();

            return result > 0;
        }
    }
}
