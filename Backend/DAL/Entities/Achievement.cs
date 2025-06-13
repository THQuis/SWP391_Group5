using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Smoking.DAL.Entities
{
    public class Achievement
    {
        [Key]
        public int AchievementID { get; set; }

        [Required, MaxLength(255)]
        public string AchievementName { get; set; }

        public string Description { get; set; }
        public string Criteria { get; set; }
        public string BadgeImage { get; set; }

        [MaxLength(50)]
        public string PackageType { get; set; }

        // Navigation
        public ICollection<UserAchievement> UserAchievements { get; set; }
    }
}
