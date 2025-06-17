using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

public class QuitPlanAutoService : IQuitPlanAutoService
{
    private readonly IUnitOfWork _unitOfWork;

    public QuitPlanAutoService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> CreateAutoQuitPlanAsync(int userId, int cigarettesPerDay, decimal pricePerPack, int cigarettesPerPack)
    {
        var existingPlans = await _unitOfWork.QuitPlans.FindAsync(x => x.UserID == userId && x.Status == "Active");

        if (existingPlans.Any())
            return false;

        // Danh sách gợi ý kế hoạch ngẫu nhiên
        var planDetailsOptions = new[]
        {
            "Giảm dần 1-2 điếu mỗi tuần",
            "Giảm 1 điếu mỗi 3 ngày để tránh sốc",
            "Bỏ hút vào buổi sáng, giữ thói quen chiều",
            "Giảm từ từ và uống nhiều nước",
            "Sử dụng kẹo cao su thay thế khi thèm thuốc",
            "Hạn chế hút khi căng thẳng, thử thiền",
            "Tham gia nhóm hỗ trợ để duy trì động lực",
            "Tăng cường vận động để giảm cảm giác thèm thuốc"
        };

        var random = new Random();
        var selectedPlanDetail = planDetailsOptions[random.Next(planDetailsOptions.Length)];

        var newPlan = new QuitPlan
        {
            UserID = userId,
            CigarettesPerDayAtStart = cigarettesPerDay,
            PricePerPackAtStart = pricePerPack,
            CigarettesPerPack = cigarettesPerPack,
            StartDate = DateTime.Now.Date,
            Reason = "Tự động lập kế hoạch",
            PlanDetails = selectedPlanDetail,
            Status = "Active",
            CreatedDate = DateTime.Now
        };

        await _unitOfWork.QuitPlans.AddAsync(newPlan);
        var result = await _unitOfWork.CompleteAsync();

        if (result > 0)
        {
            var quitProgress = new QuitProgress
            {
                QuitPlanID = newPlan.QuitPlanID,
                ProgressDate = DateTime.Now.Date,
                CigarettesPerDayBaseline = cigarettesPerDay,
                MoneySaved = 0,
                Notes = "Bắt đầu kế hoạch",
                LastSmokeDate = DateTime.Now.Date
            };

            await _unitOfWork.QuitProgresses.AddAsync(quitProgress);
            await _unitOfWork.CompleteAsync();

            return true;
        }

        return false;
    }
}
