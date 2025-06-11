namespace Smoking.API.Models.Blog
{
    // Đảm bảo model BlogRequest phù hợp với bảng Blog
    public class BlogRequest
    {
        public int AuthorId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string? CategoryName { get; set; }
    }
}
