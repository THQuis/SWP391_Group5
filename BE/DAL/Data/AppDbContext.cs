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
        public DbSet<QuitPlanSelectedAnswers> QuitPlanSelectedAnswers { get; set; }
        public DbSet<AnswerOption> AnswerOptions { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<QuitChallengeTemplate> QuitChallengeTemplates { get; set; }
        public DbSet<UserQuitChallenge> UserQuitChallenges { get; set; }

        // ✅ Đã giữ lại bảng mới
        public DbSet<Milestone> Milestones { get; set; }
        public DbSet<MilestoneGroup> MilestoneGroups { get; set; }
        public DbSet<PackageMilestone> PackageMilestones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relationships
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
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            // Decimal precision
            modelBuilder.Entity<SmokingStatus>()
                .Property(s => s.MonthlyCost)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SmokingStatus>()
                .Property(s => s.PricePerPack)
                .HasPrecision(18, 2);

            modelBuilder.Entity<QuitPlan>()
                .Property(q => q.PricePerPackAtStart)
                .HasPrecision(18, 2);

            modelBuilder.Entity<QuitProgress>()
                .Property(qp => qp.MoneySaved)
                .HasPrecision(18, 2);

            modelBuilder.Entity<QuitProgress>()
                .Property(qp => qp.TotalMoneySaved)
                .HasPrecision(18, 2);

            modelBuilder.Entity<MembershipPackage>()
                .Property(mp => mp.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            // UserMembership - MembershipPackage
            modelBuilder.Entity<UserMembership>()
               .HasOne(um => um.Package)
               .WithMany(mp => mp.UserMemberships)
               .HasForeignKey(um => um.PackageID)
               .OnDelete(DeleteBehavior.Restrict);

            // Payment - UserMembership
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.UserMembership)
                .WithMany(um => um.Payments)
                .HasForeignKey(p => p.UserMembershipID)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
