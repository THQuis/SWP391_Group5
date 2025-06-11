using System.ComponentModel.DataAnnotations;

namespace Smoking.API.Models.Blog
{
    public class UpdateBlogRequest
    {
        [Required(ErrorMessage = "ID blog không được để trống.")]
        public int BlogId { get; set; } // Cần ID để xác định blog cần cập nhật

        [Required(ErrorMessage = "Tiêu đề không được để trống.")]
        [MaxLength(255, ErrorMessage = "Tiêu đề không được vượt quá 255 ký tự.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Nội dung không được để trống.")]
        public string Content { get; set; }

        [MaxLength(100, ErrorMessage = "Tên danh mục không được vượt quá 100 ký tự.")]
        public string CategoryName { get; set; }

        [MaxLength(50, ErrorMessage = "Trạng thái không được vượt quá 50 ký tự.")]
        public string Status { get; set; } // Ví dụ: "Draft", "Published", "Archived"
    }
}