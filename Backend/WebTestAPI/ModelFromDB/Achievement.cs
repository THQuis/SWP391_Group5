using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("Achievement")]
public partial class Achievement
{
    [Key]
    [Column("AchievementID")]
    public int AchievementId { get; set; }

    [StringLength(255)]
    public string AchievementName { get; set; } = null!;

    public string? Description { get; set; }

    public string? Criteria { get; set; }

    public string? BadgeImage { get; set; }

    [StringLength(50)]
    public string? PackageType { get; set; }

    [InverseProperty("Achievement")]
    public virtual ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
}
