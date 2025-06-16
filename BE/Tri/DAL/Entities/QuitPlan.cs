using Smoking.DAL.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    [Table("QuitPlan")]
    public class QuitPlan
    {
        [Key]
        public int QuitPlanID { get; set; }

        [Required]
        public int UserID { get; set; }

        public User User { get; set; }  // Mối quan hệ với User

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        // Thêm các thuộc tính sau
        public int CigarettesPerDayAtStart { get; set; }  // Số điếu thuốc mỗi ngày
        public decimal PricePerPackAtStart { get; set; }  // Giá mỗi gói thuốc
        public int CigarettesPerPack { get; set; }  // Số điếu trong mỗi gói thuốc

        public string PlanDetails { get; set; }

        public string Reason { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        // Mối quan hệ với QuitProgress
        public ICollection<QuitProgress> QuitProgresses { get; set; }
    }

}