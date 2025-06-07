using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("SmokingStatus")]
public partial class SmokingStatus
{
    [Key]
    [Column("SmokingStatusID")]
    public int SmokingStatusId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    public int? CigarettesPerDay { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? MonthlyCost { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PricePerPack { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? LastUpdated { get; set; }

    [ForeignKey("UserId")]
    [InverseProperty("SmokingStatuses")]
    public virtual User User { get; set; } = null!;
}
