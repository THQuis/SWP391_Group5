using System;
using System.ComponentModel.DataAnnotations;

namespace Smoking.DAL.Entities
{
    public class Feedback
    {
        [Key]
        public int FeedbackID { get; set; }

        [Required]
        public int UserID { get; set; }
        public User User { get; set; }

        [Required]
        public string FeedbackContent { get; set; }

        [Required]
        public int Rating { get; set; }

        public DateTime FeedbackDate { get; set; } = DateTime.Now;
    }
}
