using Smoking.DAL.Data;
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
        IQuitProgressRepository QuitProgresses { get; }
        IAchievementRepository Achievements { get; }
        IUserAchievementRepository UserAchievements { get; }
        INotificationRepository Notifications { get; }
        IBlogRepository Blogs { get; }
        IQuestionRepository Questions { get; }
        IFeedbackRepository Feedbacks { get; }
        IQuitPlanSelectedAnswerRepository QuitPlanSelectedAnswers { get; }
        IAnswerOptionRepository AnswerOptions { get; }
        IConsultationBookingRepository ConsultationBookings { get; }

        Task<int> CompleteAsync();
        AppDbContext DbContext { get; }
    }
}