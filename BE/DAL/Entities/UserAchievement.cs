using System;
using System.ComponentModel.DataAnnotations;

namespace Smoking.DAL.Entities
{
    public class UserAchievement
    {
        [Key]
        public int UserAchievementID { get; set; }

        [Required]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public int AchievementID { get; set; }
        public Achievement Achievement { get; set; }

        public DateTime AwardedDate { get; set; } = DateTime.Now;
    }
}
