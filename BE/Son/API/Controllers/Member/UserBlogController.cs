using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System.Linq;
using System.Threading.Tasks;
using Smoking.API.Models.Admin; // (có thể bạn dùng lại BlogViewModel)

namespace Smoking.API.Controllers.User
{
    [Route("api/UserBlog")]
    [ApiController]
    [Authorize]
    public class UserBlogController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly IUserService _userService;

        public UserBlogController(IBlogService blogService, IUserService userService)
        {
            _blogService = blogService;
            _userService = userService;
        }

        // 1️⃣ Tạo blog mới (chờ duyệt)
        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromBody] BlogCreateModel model)
        {
            var user = await _userService.GetByIdAsync(model.AuthorId);
            if (user == null)
                return BadRequest("User không tồn tại");

            var blog = new Blog
            {
                Title = model.Title,
                Content = model.Content,
                AuthorId = model.AuthorId,
                CategoryName = model.CategoryName,
                BlogType = model.BlogType,
                Status = "Pending",
                CreatedDate = System.DateTime.Now,
                Likes = 0,
                Dislikes = 0,
                ReportCount = 0
            };

            var created = await _blogService.CreateByUserAsync(blog);
            return Ok(created);
        }

        // 2️⃣ Xem danh sách blog cá nhân
        [HttpGet("my-blogs/{userId}")]
        public async Task<IActionResult> GetMyBlogs(int userId)
        {
            var blogs = await _blogService.GetAllByUserIdAsync(userId);
            return Ok(blogs.Select(b => new BlogViewModel
            {
                BlogId = b.BlogId,
                Title = b.Title,
                Status = b.Status,
                CreatedDate = b.CreatedDate
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
                Status = blog.Status,
                CreatedDate = blog.CreatedDate
            });
        }

        // 4️⃣ Sửa blog (chỉ sửa được khi chưa duyệt)
        [HttpPut("edit/{blogId}")]
        public async Task<IActionResult> EditBlog(int blogId, [FromBody] BlogCreateModel model)
        {
            var blog = await _blogService.GetByIdAsync(blogId);
            if (blog == null) return NotFound();

            if (blog.Status != "Pending")
                return BadRequest("Chỉ được sửa khi bài đang chờ duyệt.");

            blog.Title = model.Title;
            blog.Content = model.Content;
            blog.CategoryName = model.CategoryName;
            blog.BlogType = model.BlogType;
            blog.LastModifiedDate = System.DateTime.Now;

            var updated = await _blogService.UpdateAsync(blog);
            return Ok(updated);
        }

        // 5️⃣ Xoá blog (chỉ khi chưa duyệt)
        [HttpDelete("delete/{blogId}")]
        public async Task<IActionResult> DeleteBlog(int blogId)
        {
            var blog = await _blogService.GetByIdAsync(blogId);
            if (blog == null) return NotFound();

            if (blog.Status != "Pending")
                return BadRequest("Chỉ được xoá khi bài đang chờ duyệt.");

            var deleted = await _blogService.DeleteAsync(blogId);
            return Ok(new { Message = "Đã xoá blog thành công" });
        }

        // 6️⃣ Thống kê cá nhân
        [HttpGet("stats/{userId}")]
        public async Task<IActionResult> GetUserBlogStats(int userId)
        {
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
