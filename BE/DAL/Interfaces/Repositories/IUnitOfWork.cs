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
        IFeedbackRepository Feedbacks { get; }
        IConsultationBookingRepository ConsultationBookings { get; }
        IQuestionRepository Questions { get; }
        IQuitPlanSelectedAnswerRepository QuitPlanSelectedAnswers { get; }
        IAnswerOptionRepository AnswerOptions { get; }
<<<<<<< HEAD
        IQuitChallengeTemplateRepository QuitChallengeTemplates { get; }
        IUserQuitChallengeRepository UserQuitChallenges { get; }
=======
        IMilestoneRepository Milestones { get; }
        IMilestoneGroupRepository MilestoneGroups { get; }



>>>>>>> 79202d34570aa3dd12fec53e26797522de2d4c2c
        Task<int> CompleteAsync();
        AppDbContext DbContext { get; }
    }
}
