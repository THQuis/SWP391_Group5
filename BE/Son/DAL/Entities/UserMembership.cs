using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    public class UserMembership
    {
        [Key]
        public int UserMembershipID { get; set; }

        [Required]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public int PackageID { get; set; }
        public MembershipPackage Package { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required, MaxLength(50)]
        public string PaymentStatus { get; set; }

        // Navigation
        public ICollection<Payment> Payments { get; set; }
    }
}
