using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System.Linq;
using System.Threading.Tasks;
using Smoking.API.Models.Admin;
using System.Security.Claims;

namespace Smoking.API.Controllers.User
{
    [Route("api/UserBlog")]
    [ApiController]
    [Authorize]  // Chỉ người dùng đã đăng nhập mới có thể sử dụng
    public class UserBlogController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly IUserService _userService;

        public UserBlogController(IBlogService blogService, IUserService userService)
        {
            _blogService = blogService;
            _userService = userService;
        }

        // 1️⃣ Tạo blog mới (trạng thái sẽ là Published ngay lập tức)
        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromBody] BlogCreateModel model)
        {
            var authorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (authorIdClaim == null)
                return Unauthorized("Chưa đăng nhập");

            var authorId = int.Parse(authorIdClaim); // Chuyển claim thành kiểu int

            var user = await _userService.GetByIdAsync(authorId);
            if (user == null)
                return BadRequest("User không tồn tại");

            var blog = new Blog
            {
                Title = model.Title,
                Content = model.Content,
                AuthorId = authorId, // Sử dụng authorId từ JWT Token
                CategoryName = model.CategoryName,
                BlogType = model.BlogType,
                Status = "Published", // Trạng thái là Published ngay lập tức
                CreatedDate = System.DateTime.Now,
                LastModifiedDate = System.DateTime.Now,
                Likes = 0,
                Dislikes = 0,
                ReportCount = 0
            };

            var created = await _blogService.CreateByUserAsync(blog);
            return Ok(created);
        }

        // 2️⃣ Xem danh sách blog cá nhân
        [HttpGet("my-blogs")]
        public async Task<IActionResult> GetMyBlogs()
        {
            var authorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (authorIdClaim == null)
                return Unauthorized("Chưa đăng nhập");

            var userId = int.Parse(authorIdClaim);

            var blogs = await _blogService.GetAllByUserIdAsync(userId);

            return Ok(blogs.Select(b => new BlogViewModel
            {
                BlogId = b.BlogId,
                Title = b.Title,
                Content = b.Content,
                CategoryName = b.CategoryName,
                BlogType = b.BlogType,
                Status = b.Status,
                Likes = b.Likes,
                Dislikes = b.Dislikes,
                ReportCount = b.ReportCount,
                AuthorName = b.User?.FullName ?? "Unknown",
                RoleName = b.User?.Role?.RoleName ?? "Unknown",
                CreatedDate = b.CreatedDate,
                LastModifiedDate = b.LastModifiedDate
            }));
        }

        // 3️⃣ Xem chi tiết blog cá nhân
        [HttpGet("my-blog-detail/{blogId}")]
        public async Task<IActionResult> GetBlogDetail(int blogId)
        {
            var blog = await _blogService.GetByIdAsync(blogId);
            if (blog == null) return NotFound();

            return Ok(new BlogViewModel
            {
                BlogId = blog.BlogId,
                Title = blog.Title,
                Content = blog.Content,
                CategoryName = blog.CategoryName,
                BlogType = blog.BlogType,
                Status = blog.Status,
                Likes = blog.Likes,
                Dislikes = blog.Dislikes,
                ReportCount = blog.ReportCount,
                AuthorName = blog.User?.FullName ?? "Unknown",
                RoleName = blog.User?.Role?.RoleName ?? "Unknown",
                CreatedDate = blog.CreatedDate,
                LastModifiedDate = blog.LastModifiedDate
            });
        }

        // 4️⃣ Sửa blog (có thể sửa bất cứ khi nào, không cần chờ duyệt)
        [HttpPut("edit/{blogId}")]
        public async Task<IActionResult> EditBlog(int blogId, [FromBody] BlogCreateModel model)
        {
            var blog = await _blogService.GetByIdAsync(blogId);
            if (blog == null) return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (blog.AuthorId != int.Parse(userIdClaim))
                return BadRequest("Bạn không thể sửa bài viết của người khác.");

            blog.Title = model.Title;
            blog.Content = model.Content;
            blog.CategoryName = model.CategoryName;
            blog.BlogType = model.BlogType;
            blog.LastModifiedDate = System.DateTime.Now;

            var updated = await _blogService.UpdateAsync(blog);
            return Ok(updated);
        }

        // 5️⃣ Xoá blog (chỉ khi bài viết của chính người dùng)
        [HttpDelete("delete/{blogId}")]
        public async Task<IActionResult> DeleteBlog(int blogId)
        {
            var blog = await _blogService.GetByIdAsync(blogId);
            if (blog == null) return NotFound();

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (blog.AuthorId != int.Parse(userIdClaim))
                return BadRequest("Bạn không thể xoá bài viết của người khác.");

            var deleted = await _blogService.DeleteAsync(blogId);
            return Ok(new { Message = "Đã xoá blog thành công" });
        }

        // 6️⃣ Thống kê cá nhân (Số lượng blog tổng, số đã duyệt, số bị từ chối)
        [HttpGet("stats")]
        public async Task<IActionResult> GetUserBlogStats()
        {
            var authorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (authorIdClaim == null)
                return Unauthorized("Chưa đăng nhập");

            var userId = int.Parse(authorIdClaim);

            var total = await _blogService.CountAllByUserAsync(userId);
            var pending = await _blogService.CountByUserAndStatusAsync(userId, "Pending");
            var approved = await _blogService.CountByUserAndStatusAsync(userId, "Approved");
            var rejected = await _blogService.CountByUserAndStatusAsync(userId, "Rejected");

            return Ok(new
            {
                TotalBlogs = total,
                PendingBlogs = pending,
                ApprovedBlogs = approved,
                RejectedBlogs = rejected
            });
        }
    }
}
