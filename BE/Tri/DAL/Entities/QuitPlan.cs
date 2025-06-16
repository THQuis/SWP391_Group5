using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Smoking.DAL.Entities
{
    public class QuitPlan
    {
        [Key]
        public int QuitPlanID { get; set; }

        [Required]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string PlanDetails { get; set; }
        public string Reason { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Navigation
        public ICollection<QuitProgress> QuitProgresses { get; set; }
    }
}
