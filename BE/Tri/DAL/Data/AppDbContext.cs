using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Entities;

namespace Smoking.DAL.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<MembershipPackage> MembershipPackages { get; set; }
        public DbSet<UserMembership> UserMemberships { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<SmokingStatus> SmokingStatuses { get; set; }
        public DbSet<QuitPlan> QuitPlans { get; set; }
        public DbSet<QuitProgress> QuitProgresses { get; set; }
        public DbSet<Achievement> Achievements { get; set; }
        public DbSet<UserAchievement> UserAchievements { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<ConsultationBooking> ConsultationBookings { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Ví dụ: nếu cần cấu hình thêm relationships, indexes, v.v.
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.RoleID)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ConsultationBooking>()
                .HasOne(cb => cb.User)
                .WithMany(u => u.ConsultationBookingsAsUser)
                .HasForeignKey(cb => cb.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ConsultationBooking>()
                .HasOne(cb => cb.Coach)
                .WithMany(u => u.ConsultationBookingsAsCoach)
                .HasForeignKey(cb => cb.CoachID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Notification>()
                .HasOne(n => n.User)    // Mỗi thông báo sẽ có một User
                .WithMany(u => u.Notifications)  // Người dùng có thể có nhiều thông báo
                .HasForeignKey(n => n.UserID)  // Sử dụng UserID làm khóa ngoại
                .OnDelete(DeleteBehavior.Restrict);  // Ngừng xóa thông báo khi xóa người dùng (hoặc có thể thay đổi hành vi xóa)

            

        }
    }
}
