using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("UserMembership")]
public partial class UserMembership
{
    [Key]
    [Column("UserMembershipID")]
    public int UserMembershipId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column("PackageID")]
    public int PackageId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime EndDate { get; set; }

    [StringLength(50)]
    public string PaymentStatus { get; set; } = null!;

    [ForeignKey("PackageId")]
    [InverseProperty("UserMemberships")]
    public virtual MembershipPackage Package { get; set; } = null!;

    [InverseProperty("UserMembership")]
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    [ForeignKey("UserId")]
    [InverseProperty("UserMemberships")]
    public virtual User User { get; set; } = null!;
}
