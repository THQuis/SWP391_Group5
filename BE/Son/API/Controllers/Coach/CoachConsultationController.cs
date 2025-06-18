using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.API.Models.Coach;
using Smoking.DAL.Interfaces.Repositories;
using System.Security.Claims;

namespace Smoking.API.Controllers.Coach
{
    [ApiController]
    [Route("api/coach/consultation")]
    [Authorize(Roles = "3")] // Chỉ Coach (RoleID = 3)
    public class CoachConsultationController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public CoachConsultationController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // 🔹 Lấy lịch tư vấn mà Coach nhận được
        [HttpGet("my-appointments")]
        public async Task<IActionResult> GetAppointments()
        {
            var coachId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var bookings = await _unitOfWork.ConsultationBookings.GetByCoachIdAsync(coachId);

            return Ok(bookings.Select(b => new
            {
                b.BookingID,
                UserName = b.User?.FullName ?? "Unknown",
                b.BookingDate,
                b.Status,
                b.Notes,
                b.MeetingLink,
                b.PreferredLanguage
            }));
        }

        // 🔹 Duyệt lịch
        [HttpPut("approve/{bookingId}")]
        public async Task<IActionResult> ApproveBooking(int bookingId)
        {
            var booking = await _unitOfWork.ConsultationBookings.GetByIdAsync(bookingId);
            if (booking == null || booking.Status != "Pending")
                return BadRequest(new { Message = "Lịch không tồn tại hoặc không thể duyệt." });

            booking.Status = "Approved";
            _unitOfWork.ConsultationBookings.Update(booking);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Duyệt lịch thành công." });
        }

        // 🔹 Từ chối lịch
        [HttpPut("reject/{bookingId}")]
        public async Task<IActionResult> RejectBooking(int bookingId)
        {
            var booking = await _unitOfWork.ConsultationBookings.GetByIdAsync(bookingId);
            if (booking == null || booking.Status != "Pending")
                return BadRequest(new { Message = "Không thể từ chối." });

            booking.Status = "Rejected";
            _unitOfWork.ConsultationBookings.Update(booking);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Đã từ chối lịch." });
        }

        // 🔹 Cập nhật thông tin cuộc hẹn (gửi meeting link, ghi chú,...)
        [HttpPut("update/{bookingId}")]
        public async Task<IActionResult> UpdateConsultation(int bookingId, [FromBody] CoachUpdateRequest request)
        {
            var booking = await _unitOfWork.ConsultationBookings.GetByIdAsync(bookingId);
            if (booking == null)
                return NotFound();

            booking.MeetingLink = request.MeetingLink;
            booking.CoachNotes = request.CoachNotes;
            booking.PreferredLanguage = request.PreferredLanguage;

            _unitOfWork.ConsultationBookings.Update(booking);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Đã cập nhật thông tin cuộc hẹn." });
        }

        // 🔹 Đánh dấu đã hoàn thành
        [HttpPut("complete/{bookingId}")]
        public async Task<IActionResult> CompleteConsultation(int bookingId)
        {
            var booking = await _unitOfWork.ConsultationBookings.GetByIdAsync(bookingId);
            if (booking == null || booking.Status != "Approved")
                return BadRequest(new { Message = "Chỉ có thể hoàn thành lịch đã được duyệt." });

            booking.Status = "Completed";
            _unitOfWork.ConsultationBookings.Update(booking);
            await _unitOfWork.CompleteAsync();

            return Ok(new { Message = "Đã đánh dấu hoàn thành." });
        }
    }

}
