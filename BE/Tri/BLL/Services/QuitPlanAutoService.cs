using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class QuitPlanAutoService : IQuitPlanAutoService
{
    private readonly IUnitOfWork _unitOfWork;

    public QuitPlanAutoService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<QuitPlan?> CreateAutoQuitPlanAsync(
        int userId,
        int cigarettesPerDay,
        decimal pricePerPack,
        int cigarettesPerPack,
        DateTime? startDate = null,
        DateTime? endDate = null)
    {
        bool hasActivePlan = await _unitOfWork.QuitPlans
            .AnyAsync(x => x.UserID == userId && x.Status == "Active");

        if (hasActivePlan)
            return null;

        var start = startDate ?? DateTime.Now.Date;

        // Nếu không có endDate, để null trong entity, không tính ngày kết thúc cố định
        DateTime? calculatedEndDate = endDate?.Date;

        // Số ngày lập kế hoạch
        int totalPlanDays;

        if (calculatedEndDate.HasValue)
        {
            totalPlanDays = (calculatedEndDate.Value - start).Days + 1;
            if (totalPlanDays <= 0)
                totalPlanDays = 7; // fallback nếu ngày nhập sai
        }
        else
        {
            totalPlanDays = 7; // mặc định 7 ngày nếu không nhập endDate
        }

        // Mảng tips động, sẽ lặp lại nếu kế hoạch dài hơn 7 ngày
        string[] tips =
        {
            "Tập trung nhận biết cơn thèm thuốc, ghi lại thời điểm thèm nhất.",
            "Thay 1 lần hút bằng việc uống nước hoặc đi dạo.",
            "Bắt đầu tránh hút vào buổi sáng.",
            "Thử thay thế thuốc bằng kẹo cao su hoặc trái cây khô.",
            "Ghi lại cảm xúc mỗi lần muốn hút để hiểu bản thân.",
            "Tăng vận động nhẹ như đi bộ buổi sáng.",
            "Tự thưởng cho mình nếu hoàn thành kế hoạch hôm nay."
        };

        var dailyPlan = new List<string>();

        for (int day = 1; day <= totalPlanDays; day++)
        {
            // Giảm số điếu từng ngày
            int targetCigarettes = cigarettesPerDay - (day - 1);
            if (targetCigarettes < 0) targetCigarettes = 0;

            string tip = tips[(day - 1) % tips.Length];

            dailyPlan.Add($"Ngày {day}: Hút {targetCigarettes} điếu – {tip}");
        }

        var planDetails = string.Join(Environment.NewLine, dailyPlan);

        var newPlan = new QuitPlan
        {
            UserID = userId,
            CigarettesPerDayAtStart = cigarettesPerDay,
            PricePerPackAtStart = pricePerPack,
            CigarettesPerPack = cigarettesPerPack,
            StartDate = start,
            EndDate = calculatedEndDate, // nullable
            Reason = "Tự động lập kế hoạch",
            PlanDetails = planDetails,
            Status = "Active",
            CreatedDate = DateTime.Now
        };

        await _unitOfWork.QuitPlans.AddAsync(newPlan);
        var result = await _unitOfWork.CompleteAsync();

        if (result <= 0)
            return null;

        var quitProgress = new QuitProgress
        {
            QuitPlanID = newPlan.QuitPlanID,
            ProgressDate = start,
            CigarettesPerDayBaseline = cigarettesPerDay,
            MoneySaved = 0,
            Notes = "Bắt đầu kế hoạch",
            LastSmokeDate = start
        };

        await _unitOfWork.QuitProgresses.AddAsync(quitProgress);
        await _unitOfWork.CompleteAsync();

        return newPlan;
    }
}
