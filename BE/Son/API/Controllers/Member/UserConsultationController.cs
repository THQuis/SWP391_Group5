using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.User;
using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Member
{
    [ApiController]
    [Route("api/user/consultation")]
    public class UserConsultationController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;

        public UserConsultationController(IUnitOfWork unitOfWork, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _mailService = mailService;
        }

        // 1️⃣ Đặt lịch tư vấn
        [HttpPost("book")]
        public async Task<IActionResult> BookConsultation([FromBody] ConsultationRequest request)
        {   
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { Message = "Người dùng không hợp lệ." });
            }

            // Kiểm tra xem Coach có tồn tại không
            var coach = await _unitOfWork.Users.GetByIdAsync(request.CoachId);
            if (coach == null || coach.RoleID != 3)  // Kiểm tra xem có phải là Coach không
            {
                return BadRequest(new { Message = "Coach không tồn tại hoặc không hợp lệ." });
            }

            // Kiểm tra thời gian tư vấn có hợp lệ không (ví dụ không trùng lịch)
            var existingBooking = await _unitOfWork.ConsultationBookings.GetAllAsync();  // Lấy tất cả các lịch tư vấn
            var conflictingBooking = existingBooking.FirstOrDefault(booking =>
                booking.CoachID == request.CoachId &&
                booking.BookingDate == request.ConsultationDate &&
                booking.Status != "Cancelled");

            if (conflictingBooking != null)
            {
                return BadRequest(new { Message = "Thời gian này đã có lịch tư vấn. Vui lòng chọn thời gian khác." });
            }

            // Tạo mới lịch tư vấn
            var consultation = new ConsultationBooking
            {
                UserID = userId,
                CoachID = request.CoachId,
                BookingDate = request.ConsultationDate,
                Duration = request.Duration,
                Status = "Pending", // Trạng thái ban đầu là Pending (Chờ duyệt)
                CreatedDate = System.DateTime.Now,
                Notes = request.Notes // Gán giá trị Notes từ request vào
            };

            await _unitOfWork.ConsultationBookings.AddAsync(consultation);  // Thêm lịch tư vấn vào cơ sở dữ liệu
            await _unitOfWork.CompleteAsync();

            // Gửi thông báo qua email cho User và Coach
            var user = await _unitOfWork.Users.GetByIdAsync(userId);
            var emailBodyForUser = $"Bạn đã đặt lịch tư vấn với Coach {coach.FullName} vào {request.ConsultationDate}.";
            await _mailService.SendEmailAsync(user.Email, "Đặt lịch tư vấn thành công", emailBodyForUser);

            var emailBodyForCoach = $"Bạn có một lịch tư vấn mới từ người dùng {user.FullName} vào {request.ConsultationDate}.";
            await _mailService.SendEmailAsync(coach.Email, "Lịch tư vấn mới", emailBodyForCoach);

            return Ok(new { Message = "Đặt lịch tư vấn thành công. Chờ Coach duyệt." });
        }

        // 2️⃣ Xem lịch tư vấn của người dùng
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyConsultations()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { Message = "Người dùng không hợp lệ." });
            }

            // Lấy tất cả lịch tư vấn của người dùng
            var consultations = await _unitOfWork.ConsultationBookings.GetByUserIdAsync(userId);

            return Ok(consultations.Select(c => new
            {
                c.BookingID,
                CoachName = c.Coach?.FullName ?? "Unknown",
                c.BookingDate,
                c.Duration,
                c.Status,
                c.MeetingLink,
                c.Notes
            }));
        }

        // 3️⃣ Hủy lịch tư vấn (Nếu lịch chưa được xác nhận)
        [HttpDelete("cancel/{bookingId}")]
        public async Task<IActionResult> CancelConsultation(int bookingId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized(new { Message = "Người dùng không hợp lệ." });

            var consultation = await _unitOfWork.ConsultationBookings.GetByIdAsync(bookingId);
            if (consultation == null)
                return NotFound(new { Message = "Lịch tư vấn không tồn tại." });

            if (consultation.UserID != userId)
                return BadRequest(new { Message = "Bạn không thể hủy lịch của người khác." });

            if (consultation.Status != "Pending")
                return BadRequest(new { Message = "Không thể hủy lịch đã được duyệt hoặc đã hoàn thành." });

            // 🔐 Lưu ID trước khi context dispose
            var bookingIdCopy = consultation.BookingID;

            // Cập nhật trạng thái
            consultation.Status = "Cancelled";
            _unitOfWork.ConsultationBookings.Update(consultation);

            // 1️⃣ Gọi SaveChanges trước
            await _unitOfWork.CompleteAsync();

            // 2️⃣ Sau đó mới gửi email - không truy cập consultation nữa
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "noreply@example.com";
            var message = $"Lịch tư vấn #{bookingIdCopy} của bạn đã bị huỷ.";

            await _mailService.SendEmailAsync(userEmail, "Huỷ lịch tư vấn", message);

            return Ok(new { Message = "Huỷ lịch thành công." });
        }







    }
}
