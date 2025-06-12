using System;

namespace Smoking.API.Models.Blog
{
    public class BlogViewModel
    {
        public int BlogId { get; set; }
        public string Title { get; set; }
        public string? Content { get; set; }
        public string? CategoryName { get; set; }
        public string? BlogType { get; set; }
        public string Status { get; set; }
        public int Likes { get; set; }
        public int Dislikes { get; set; }
        public int ReportCount { get; set; }
        public string AuthorName { get; set; }
        public string RoleName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastModifiedDate { get; set; }
    }

    // Model dùng khi admin tạo blog mới
    public class BlogCreateModel
    {
        public string Title { get; set; }
        public string? Content { get; set; }
        public int AuthorId { get; set; }
        public string? CategoryName { get; set; }
        public string? BlogType { get; set; }
    }
}
