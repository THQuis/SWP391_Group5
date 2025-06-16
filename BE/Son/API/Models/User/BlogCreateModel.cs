namespace Smoking.API.Models.User
{
    public class BlogCreateModel
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public int AuthorId { get; set; }
        public string CategoryName { get; set; }
        public string BlogType { get; set; }
    }

}
