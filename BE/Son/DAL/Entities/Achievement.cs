using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    [Table("Achievement")]
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
