using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Smoking.API.Models.Admin;

namespace Smoking.API.Controllers.Member
{
    [Route("api/UserBlog")]
    [ApiController]
    [Authorize(Roles = "2")]
    public class UserBlogController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly IUserService _userService;

        public UserBlogController(IBlogService blogService, IUserService userService)
        {
            _blogService = blogService;
            _userService = userService;
        }


        [HttpGet("all")]
        public async Task<IActionResult> GetAllBlogs()
        {
            var blogs = await _blogService.GetAllWithUserAndRoleAsync();
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
                LastModifiedDate = b.LastModifiedDate,
                ImageUrl = b.ImageUrl
            }));
        }




        [HttpPost("create")]
        [Authorize(Roles = "2")]
        public async Task<IActionResult> CreateBlog([FromBody] BlogCreateByUserModel model)
        {
            var authorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (authorIdClaim == null)
                return Unauthorized("Chưa đăng nhập");

            var authorId = int.Parse(authorIdClaim);

            var blog = new Blog
            {
                Title = model.Title,
                Content = model.Content,
                AuthorId = authorId,
                CategoryName = model.CategoryName,
                BlogType = model.BlogType,
                ImageUrl = model.ImageUrl,
                Status = "Published",
                CreatedDate = DateTime.Now,
                LastModifiedDate = DateTime.Now,
                Likes = 0,
                Dislikes = 0,
                ReportCount = 0
            };

            var created = await _blogService.CreateByUserAsync(blog);
            return Ok(created);
        }

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
                LastModifiedDate = b.LastModifiedDate,
                ImageUrl = b.ImageUrl
            }));
        }

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
                LastModifiedDate = blog.LastModifiedDate,
                ImageUrl = blog.ImageUrl
            });
        }

        [HttpPut("edit/{blogId}")]
        public async Task<IActionResult> EditBlog(int blogId, [FromBody] BlogCreateByUserModel model)
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
            blog.ImageUrl = model.ImageUrl;
            blog.LastModifiedDate = DateTime.Now;

            var updated = await _blogService.UpdateAsync(blog);
            return Ok(updated);
        }

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

        [HttpGet("stats")]
        public async Task<IActionResult> GetUserBlogStats()
        {
            var authorIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (authorIdClaim == null)
                return Unauthorized("Chưa đăng nhập");

            var userId = int.Parse(authorIdClaim);

            var total = await _blogService.CountAllByUserAsync(userId);
            var published = await _blogService.CountByUserAndStatusAsync(userId, "Published");
            var rejected = await _blogService.CountByUserAndStatusAsync(userId, "Rejected");

            return Ok(new
            {
                TotalBlogs = total,
                PublishedBlogs = published,
                RejectedBlogs = rejected
            });
        }

        [HttpPost("report/{blogId}")]
        public async Task<IActionResult> ReportBlog(int blogId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized("Chưa đăng nhập");

            var result = await _blogService.ReportBlogAsync(blogId);
            if (!result)
                return BadRequest(new { Message = "Báo cáo blog không thành công." });

            return Ok(new { Message = "Blog đã được báo cáo." });
        }
        // [POST] Bấm Like
        [HttpPost("like/{blogId}")]
        public async Task<IActionResult> LikeBlog(int blogId)
        {
            var result = await _blogService.LikeBlogAsync(blogId);
            if (!result)
                return NotFound(new { Message = "Không tìm thấy blog để Like." });

            return Ok(new { Message = "Đã thích bài viết." });
        }

        // [POST] Bấm Dislike
        [HttpPost("dislike/{blogId}")]
        public async Task<IActionResult> DislikeBlog(int blogId)
        {
            var result = await _blogService.DislikeBlogAsync(blogId);
            if (!result)
                return NotFound(new { Message = "Không tìm thấy blog để Dislike." });

            return Ok(new { Message = "Đã không thích bài viết." });
        }

    }
}
