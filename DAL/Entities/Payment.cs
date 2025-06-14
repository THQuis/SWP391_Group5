using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
<<<<<<< HEAD
=======
    [Table("Payment")]
>>>>>>> 0883082cd4d76433817b1141a26c07978d461828
    public class Payment
    {
        [Key]
        public int PaymentID { get; set; }

        [Required]
        public int UserMembershipID { get; set; }
        public UserMembership UserMembership { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public DateTime PaymentDate { get; set; } = DateTime.Now;

        [Required, MaxLength(50)]
        public string PaymentMethod { get; set; }

        [Required, MaxLength(50)]
        public string Status { get; set; }

        [MaxLength(255)]
        public string TransactionReference { get; set; }
    }
}
