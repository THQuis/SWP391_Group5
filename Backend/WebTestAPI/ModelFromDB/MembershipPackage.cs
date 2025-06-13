using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("MembershipPackage")]
public partial class MembershipPackage
{
    [Key]
    [Column("PackageID")]
    public int PackageId { get; set; }

    [StringLength(255)]
    public string PackageName { get; set; } = null!;

    [StringLength(50)]
    public string PackageType { get; set; } = null!;

    public string? Description { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }

    public int Duration { get; set; }

    [InverseProperty("Package")]
    public virtual ICollection<UserMembership> UserMemberships { get; set; } = new List<UserMembership>();
}
