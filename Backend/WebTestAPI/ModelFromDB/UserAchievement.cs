using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("UserAchievement")]
public partial class UserAchievement
{
    [Key]
    [Column("UserAchievementID")]
    public int UserAchievementId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("AchievementID")]
    public int AchievementId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? AwardedDate { get; set; }

    [ForeignKey("AchievementId")]
    [InverseProperty("UserAchievements")]
    public virtual Achievement Achievement { get; set; } = null!;

    [ForeignKey("UserId")]
    [InverseProperty("UserAchievements")]
    public virtual User User { get; set; } = null!;
}
