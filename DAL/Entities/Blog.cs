using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smoking.DAL.Entities
{
    [Table("Blog")]

    public class Blog
    {
        [Key]
        public int BlogId { get; set; }

        [Required, MaxLength(255)]
        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public int AuthorId { get; set; }
        public User Author { get; set; }

        [MaxLength(100)]
        public string CategoryName { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime LastModifiedDate { get; set; } = DateTime.Now;

        [MaxLength(50)]
        public string Status { get; set; } = "Draft";

        public int Likes { get; set; } = 0;
        public int Dislikes { get; set; } = 0;
    }
}
