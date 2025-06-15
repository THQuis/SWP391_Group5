using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using System;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IRoleRepository Roles { get; }
        IUserRepository Users { get; }
        IMembershipPackageRepository MembershipPackages { get; }
        IUserMembershipRepository UserMemberships { get; }
        IPaymentRepository Payments { get; }
        ISmokingStatusRepository SmokingStatuses { get; }
        IQuitPlanRepository QuitPlans { get; }
        IQuitProgressRepository QuitProgresses { get; }  // Đảm bảo tên là QuitProgresses
        IAchievementRepository Achievements { get; }
        IUserAchievementRepository UserAchievements { get; }
        INotificationRepository Notifications { get; }
        IBlogRepository Blogs { get; }
        IFeedbackRepository Feedbacks { get; }
        IConsultationBookingRepository ConsultationBookings { get; }

        Task<int> CompleteAsync();
        AppDbContext DbContext { get; }

        Task<User> GetUserWithRoleAsync(int userId);
    }
}
