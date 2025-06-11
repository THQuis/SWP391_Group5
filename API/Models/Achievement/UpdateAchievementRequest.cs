using System.ComponentModel.DataAnnotations;

namespace Smoking.API.Models.Achievement
{
    public class UpdateAchievementRequest
    {
        [Required(ErrorMessage = "ID thành tích không được để trống.")]
        public int AchievementID { get; set; } // Cần ID để xác định thành tích cần cập nhật

        [Required(ErrorMessage = "Tên thành tích không được để trống.")]
        [MaxLength(255, ErrorMessage = "Tên thành tích không được vượt quá 255 ký tự.")]
        public string AchievementName { get; set; }

        public string Description { get; set; }
        public string Criteria { get; set; }
        public string BadgeImage { get; set; } // URL hoặc đường dẫn đến hình ảnh huy hiệu

        [MaxLength(50, ErrorMessage = "Loại gói không được vượt quá 50 ký tự.")]
        public string PackageType { get; set; }
    }
}