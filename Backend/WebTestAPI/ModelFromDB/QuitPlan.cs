using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebTestAPI.ModelFromDB;

[Table("QuitPlan")]
public partial class QuitPlan
{
    [Key]
    [Column("QuitPlanID")]
    public int QuitPlanId { get; set; }

    [Column("UserID")]
    public int UserId { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime StartDate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EndDate { get; set; }

    public string? PlanDetails { get; set; }

    public string? Reason { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? CreatedDate { get; set; }

    [InverseProperty("QuitPlan")]
    public virtual ICollection<QuitProgress> QuitProgresses { get; set; } = new List<QuitProgress>();

    [ForeignKey("UserId")]
    [InverseProperty("QuitPlans")]
    public virtual User User { get; set; } = null!;
}
