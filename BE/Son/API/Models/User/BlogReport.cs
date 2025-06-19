using Smoking.DAL.Entities;  // Import đúng namespace

namespace Smoking.API.Models.User
{
    public class BlogReport
    {
        public int BlogReportId { get; set; }  // ID của báo cáo
        public int BlogId { get; set; }        // ID của bài blog bị báo cáo
        public int UserId { get; set; }        // ID của người dùng báo cáo
        public DateTime ReportDate { get; set; } // Ngày báo cáo
        public string Reason { get; set; }      // Lý do báo cáo

        // Tham chiếu đến Blog và User
        public Blog Blog { get; set; } // Tham chiếu đến bài blog bị báo cáo
        public Smoking.DAL.Entities.User User { get; set; } // Tham chiếu đến người dùng báo cáo
    }
}
