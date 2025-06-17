using System;
using System.ComponentModel.DataAnnotations;

namespace Smoking.DAL.Entities
{
    public class ConsultationBooking
    {
        [Key]
        public int BookingID { get; set; }

        [Required]
        public int UserID { get; set; }  // Mã người dùng
        public User User { get; set; }  // Thông tin người dùng

        [Required]
        public int CoachID { get; set; }  // Mã huấn luyện viên
        public User Coach { get; set; }  // Thông tin huấn luyện viên

        [Required]
        public DateTime BookingDate { get; set; }  // Ngày và giờ đặt lịch

        [Required]
        public int Duration { get; set; }  // Thời gian tư vấn (phút)

        [Required]
        [RegularExpression("Pending|Confirmed|Cancelled|Completed")]  // Trạng thái: Pending, Confirmed, Cancelled, Completed
        public string Status { get; set; }

        public string MeetingLink { get; set; }  // Link cuộc họp trực tuyến (nếu có)
        public string Notes { get; set; }  // Ghi chú của người dùng về cuộc tư vấn
        public string CoachNotes { get; set; }  // Ghi chú của huấn luyện viên về cuộc tư vấn

        [MaxLength(50)]
        public string PreferredLanguage { get; set; }  // Ngôn ngữ ưa thích của người dùng

        public bool ReminderSent { get; set; } = false;  // Đánh dấu xem thông báo nhắc nhở đã được gửi chưa
        public DateTime CreatedDate { get; set; } = DateTime.Now;  // Ngày tạo lịch tư vấn (mặc định là hiện tại)
    }
}
