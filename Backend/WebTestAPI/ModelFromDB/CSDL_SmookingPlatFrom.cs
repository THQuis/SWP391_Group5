using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

public partial class CSDL_SmookingPlatFrom : DbContext
{
    public CSDL_SmookingPlatFrom()
    {
    }

    public CSDL_SmookingPlatFrom(DbContextOptions<CSDL_SmookingPlatFrom> options)
        : base(options)
    {
    }

    public virtual DbSet<Achievement> Achievements { get; set; }

    public virtual DbSet<Blog> Blogs { get; set; }

    public virtual DbSet<ConsultationBooking> ConsultationBookings { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<MembershipPackage> MembershipPackages { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<QuitPlan> QuitPlans { get; set; }

    public virtual DbSet<QuitProgress> QuitProgresses { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SmokingStatus> SmokingStatuses { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserAchievement> UserAchievements { get; set; }

    public virtual DbSet<UserMembership> UserMemberships { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Thiết lập quan hệ giữa User và Role
        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .HasConstraintName("FK_User_Role"); // đặt tên khóa ngoại tùy DB

        // Gọi phần mở rộng (nếu bạn cần bổ sung phần mở rộng riêng)
        //OnModelCreatingPartial(modelBuilder);
    }
}