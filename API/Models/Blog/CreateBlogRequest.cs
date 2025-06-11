using System.ComponentModel.DataAnnotations;

namespace Smoking.API.Models.Blog
{
    public class CreateBlogRequest
    {
        [Required(ErrorMessage = "Tiêu đề không được để trống.")]
        [MaxLength(255, ErrorMessage = "Tiêu đề không được vượt quá 255 ký tự.")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Nội dung không được để trống.")]
        public string Content { get; set; }

        [Required(ErrorMessage = "ID tác giả không được để trống.")]
        // AuthorId sẽ là ID của người dùng (Admin) tạo blog
        public int AuthorId { get; set; }

        [MaxLength(100, ErrorMessage = "Tên danh mục không được vượt quá 100 ký tự.")]
        public string CategoryName { get; set; } = "General"; // Giá trị mặc định
    }
}