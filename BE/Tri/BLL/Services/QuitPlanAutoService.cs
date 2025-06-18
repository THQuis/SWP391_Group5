using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

public class QuitPlanAutoService : IQuitPlanAutoService
{
    private readonly IUnitOfWork _unitOfWork;

    // Constructor nhận vào IUnitOfWork
    public QuitPlanAutoService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // Phương thức tạo kế hoạch cai thuốc tự động và thêm tiến trình
    public async Task<bool> CreateAutoQuitPlanAsync(int userId, int cigarettesPerDay, decimal pricePerPack, int cigarettesPerPack)
    {
        // Kiểm tra xem người dùng có kế hoạch cai thuốc nào đang active không
        var existingPlans = await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active");

        if (existingPlans.Any())
        {
            // Nếu có kế hoạch cai thuốc đang active, trả về false để không tạo thêm kế hoạch
            return false;
        }

        // Tạo kế hoạch cai thuốc mới
        var newPlan = new QuitPlan
        {
            UserID = userId,
            CigarettesPerDayAtStart = cigarettesPerDay,
            PricePerPackAtStart = pricePerPack,
            CigarettesPerPack = cigarettesPerPack,
            StartDate = DateTime.Now.Date,
            Reason = "Tự động lập kế hoạch",
            PlanDetails = "Giảm dần 1-2 điếu mỗi tuần",
            Status = "Active",
            CreatedDate = DateTime.Now
        };

        // Thêm kế hoạch mới vào cơ sở dữ liệu
        await _unitOfWork.QuitPlans.AddAsync(newPlan);
        var result = await _unitOfWork.CompleteAsync();

        // Nếu kế hoạch được tạo thành công, thêm tiến trình cai thuốc vào bảng QuitProgress
        if (result > 0)
        {
            var quitProgress = new QuitProgress
            {
                QuitPlanID = newPlan.QuitPlanID, // Liên kết với QuitPlanID của kế hoạch vừa tạo
                ProgressDate = DateTime.Now.Date,
                CigarettesSmoked = cigarettesPerDay,  // Ghi nhận số điếu thuốc đã hút (bắt đầu với số lượng khai báo)
                MoneySaved = 0,  // Số tiền tiết kiệm tính sau
                Notes = "Bắt đầu kế hoạch",
                LastSmokeDate = DateTime.Now.Date
            };

            // Thêm tiến trình cai thuốc đầu tiên vào QuitProgress
            await _unitOfWork.QuitProgresses.AddAsync(quitProgress);
            await _unitOfWork.CompleteAsync();  // Lưu tiến trình

            return true;
        }

        return false;
    }

}
