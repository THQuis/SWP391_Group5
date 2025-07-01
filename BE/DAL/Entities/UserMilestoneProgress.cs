using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Smoking.DAL.Entities
{
    [Table("UserMilestoneProgress")]
    public class UserMilestoneProgress
    {
        public int UserMilestoneID { get; set; }  // Đây là khóa chính

        public int UserID { get; set; }
        public int MilestoneID { get; set; }
        public DateTime AchievedDate { get; set; }

        // Navigation Properties
        public virtual User User { get; set; }
        public virtual Milestone Milestone { get; set; }
    }
}
