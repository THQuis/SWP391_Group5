using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("QuitProgress")]
public partial class QuitProgress
{
    [Key]
    [Column("ProgressID")]
    public int ProgressId { get; set; }

    [Column("QuitPlanID")]
    public int QuitPlanId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime Date { get; set; }

    public int? CigarettesSmoked { get; set; }

    public int? PacksUsed { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? MoneySaved { get; set; }

    public string? Notes { get; set; }

    public int? DaysSmokeFree { get; set; }

    public string? HealthImprovement { get; set; }

    [ForeignKey("QuitPlanId")]
    [InverseProperty("QuitProgresses")]
    public virtual QuitPlan QuitPlan { get; set; } = null!;
}
