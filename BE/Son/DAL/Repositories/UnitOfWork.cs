using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;

        public UnitOfWork(AppDbContext context)
        {
            _context = context;

            // Khởi tạo từng repository
            Roles = new RoleRepository(_context);
            Users = new UserRepository(_context);
            MembershipPackages = new MembershipPackageRepository(_context);
            UserMemberships = new UserMembershipRepository(_context);
            Payments = new PaymentRepository(_context);
            SmokingStatuses = new SmokingStatusRepository(_context);
            QuitPlans = new QuitPlanRepository(_context);
            QuitProgresses = new QuitProgressRepository(_context);
            Achievements = new AchievementRepository(_context);
            UserAchievements = new UserAchievementRepository(_context);
            Notifications = new NotificationRepository(_context);
            Blogs = new BlogRepository(_context);
            Feedbacks = new FeedbackRepository(_context);
            ConsultationBookings = new ConsultationBookingRepository(_context);
        }

        public IRoleRepository Roles { get; private set; }
        public IUserRepository Users { get; private set; }
        public IMembershipPackageRepository MembershipPackages { get; private set; }
        public IUserMembershipRepository UserMemberships { get; private set; }
        public IPaymentRepository Payments { get; private set; }
        public ISmokingStatusRepository SmokingStatuses { get; private set; }
        public IQuitPlanRepository QuitPlans { get; private set; }
        public IQuitProgressRepository QuitProgresses { get; private set; }
        public IAchievementRepository Achievements { get; private set; }
        public IUserAchievementRepository UserAchievements { get; private set; }
        public INotificationRepository Notifications { get; private set; }
        public IBlogRepository Blogs { get; private set; }
        public IFeedbackRepository Feedbacks { get; private set; }
        public IConsultationBookingRepository ConsultationBookings { get; private set; }

        public async Task<int> CompleteAsync() 
        {
            return await _context.SaveChangesAsync();
        }
        public AppDbContext DbContext => _context;
        public void Dispose()
        {
            _context.Dispose();
        }
        public async Task<User> GetUserWithRoleAsync(int userId)
        {

            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.UserID == userId);
        }



    }
}
