using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    [Table("QuitProgress")]
    public class QuitProgress
    {
        [Key]
        public int ProgressID { get; set; }

        [Required]
        public int QuitPlanID { get; set; }  // Khóa ngoại liên kết với QuitPlan
        public QuitPlan QuitPlan { get; set; }  // Mối quan hệ với QuitPlan

        public DateTime ProgressDate { get; set; }
        public int CigarettesSmoked { get; set; }
        public decimal MoneySaved { get; set; }
        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? LastSmokeDate { get; set; }

        // Cột mới lưu số điếu thuốc hút trong ngày
        public int? CigarettesSmokedToday { get; set; }  // Có thể để NULL nếu không có số liệu
    }
}
