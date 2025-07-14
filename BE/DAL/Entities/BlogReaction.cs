using System;

namespace Smoking.DAL.Entities
{
    public class BlogReaction
    {
        public int Id { get; set; }
        public int BlogId { get; set; }
        public int UserId { get; set; }

        /// <summary>
        /// TRUE = Like, FALSE = Dislike, NULL = Không phản ứng
        /// </summary>
        public bool? IsLike { get; set; }

        public DateTime? ReactedAt { get; set; }

        // Navigation properties
        public virtual Blog Blog { get; set; }
        public virtual User User { get; set; }
    }
}
