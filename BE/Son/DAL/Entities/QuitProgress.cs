using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    public class QuitProgress
    {
        [Key]
        public int ProgressID { get; set; }

        [Required]
        public int QuitPlanID { get; set; }
        public QuitPlan QuitPlan { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public int CigarettesSmoked { get; set; }
        public int PacksUsed { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MoneySaved { get; set; }

        public string Notes { get; set; }
        public int DaysSmokeFree { get; set; }
        public string HealthImprovement { get; set; }
    }
}
