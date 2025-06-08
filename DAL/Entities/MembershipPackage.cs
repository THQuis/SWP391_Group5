using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    public class MembershipPackage
    {
        [Key]
        public int PackageID { get; set; }

        [Required, MaxLength(255)]
        public string PackageName { get; set; }

        [Required, MaxLength(50)]
        public string PackageType { get; set; }

        public string Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public int Duration { get; set; } // tháng

        // Navigation
        public ICollection<UserMembership> UserMemberships { get; set; }
    }
}
