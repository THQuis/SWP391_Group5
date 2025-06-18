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

        // Tạo tiến trình cai thuốc
        public async Task<bool> CreateQuitProgressAsync(int quitPlanId, DateTime progressDate, int cigarettesSmoked, decimal pricePerPack, int cigarettesPerPack)
        {
            // Tính toán tiền tiết kiệm
            decimal pricePerCigarette = pricePerPack / cigarettesPerPack;
            decimal moneySaved = (cigarettesSmoked < 20) ? (20 - cigarettesSmoked) * pricePerCigarette : 0;  // Giảm số điếu thuốc

            var quitProgress = new QuitProgress
            {
                QuitPlanID = quitPlanId,
                ProgressDate = progressDate,
                CigarettesSmoked = cigarettesSmoked,
                MoneySaved = moneySaved,
                Notes = "Tiến trình cai thuốc mới",
                LastSmokeDate = progressDate
            };

            // Thêm vào cơ sở dữ liệu
            await _unitOfWork.QuitProgresses.AddAsync(quitProgress);
            var result = await _unitOfWork.CompleteAsync();

            return result > 0;
        }

        // Cập nhật tiến trình cai thuốc
        public async Task<bool> UpdateQuitProgressAsync(int quitPlanId, DateTime progressDate, int cigarettesSmoked, decimal pricePerPack, int cigarettesPerPack, int? cigarettesSmokedToday)
        {
            // Lấy thông tin kế hoạch cai thuốc từ cơ sở dữ liệu
            var quitPlan = await _unitOfWork.QuitPlans.GetByIdAsync(quitPlanId);
            if (quitPlan == null)
            {
                // Trả về false nếu không tìm thấy QuitPlan
                return false;
            }

            // Tính giá mỗi điếu thuốc
            decimal pricePerCigarette = pricePerPack / cigarettesPerPack;

            // Số điếu thuốc đã khai báo trong QuitPlan
            int cigarettesPerDayAtStart = quitPlan.CigarettesPerDayAtStart;

            decimal moneySaved = 0;

            // Nếu người dùng hút ít điếu thuốc hơn đã khai báo, tính tiền tiết kiệm
            if (cigarettesSmokedToday < cigarettesPerDayAtStart)
            {
                moneySaved = (cigarettesPerDayAtStart - cigarettesSmokedToday.Value) * pricePerCigarette;
            }
            // Nếu người dùng hút nhiều hơn số điếu khai báo, không tính tiền tiết kiệm
            else if (cigarettesSmokedToday > cigarettesPerDayAtStart)
            {
                moneySaved = 0;  // Không tính tiền tiết kiệm khi hút nhiều hơn số khai báo
            }

            // Lấy tiến trình cai thuốc từ cơ sở dữ liệu
            var quitProgress = await _unitOfWork.QuitProgresses.FindFirstOrDefaultAsync(x => x.QuitPlanID == quitPlanId && x.ProgressDate == progressDate);

            if (quitProgress != null)
            {
                // Nếu tiến trình đã tồn tại, cộng dồn số điếu thuốc và tiền tiết kiệm
                quitProgress.CigarettesSmoked += cigarettesSmoked;  // Cộng dồn số điếu thuốc đã hút vào tổng số điếu
                quitProgress.MoneySaved += moneySaved;  // Cộng dồn tiền tiết kiệm
                quitProgress.Notes = "Tiến trình cai thuốc cập nhật";  // Ghi chú
                quitProgress.LastSmokeDate = progressDate;  // Ngày cuối cùng hút thuốc

                // Cập nhật số điếu thuốc đã hút trong ngày
                quitProgress.CigarettesSmokedToday = cigarettesSmokedToday;

                // Cập nhật vào cơ sở dữ liệu
                _unitOfWork.QuitProgresses.Update(quitProgress);
            }
            else
            {
                // Nếu không có tiến trình, tạo mới một tiến trình cai thuốc
                quitProgress = new QuitProgress
                {
                    QuitPlanID = quitPlanId,
                    ProgressDate = progressDate,
                    CigarettesSmoked = cigarettesSmoked,  // Lưu số điếu thuốc đã hút trong ngày và cộng dồn vào tổng
                    MoneySaved = moneySaved,  // Tiền tiết kiệm
                    Notes = "Tiến trình cai thuốc mới",  // Ghi chú
                    LastSmokeDate = progressDate,  // Ngày cuối cùng hút thuốc
                    CigarettesSmokedToday = cigarettesSmokedToday  // Lưu số điếu thuốc đã hút trong ngày
                };

                // Thêm mới vào cơ sở dữ liệu
                await _unitOfWork.QuitProgresses.AddAsync(quitProgress);
            }

            // Lưu thay đổi vào cơ sở dữ liệu
            var result = await _unitOfWork.CompleteAsync();

            return result > 0;
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
