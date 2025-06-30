using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smoking.DAL.Interfaces.Repositories;
using Smoking.BLL.Interfaces;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Smoking.API.Controllers.Coach
{
    [ApiController]
    [Route("api/coach")]
    [Authorize(Roles = "3")]
    public class CoachController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailService _mailService;

        public CoachController(IUnitOfWork unitOfWork, IMailService mailService)
        {
            _unitOfWork = unitOfWork;
            _mailService = mailService;
        }
        
        [HttpGet("my-users")]
        public async Task<IActionResult> GetMyUsers()
        {
            var coachId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var users = await _unitOfWork.Users.GetUsersByCoachIdAsync(coachId);

            return Ok(users.Select(u => new
            {
                u.UserID,
                u.FullName,
                u.Email,
                u.PhoneNumber,
                u.Status,
                u.ProfilePicture
            }));
        }

        // Xem tiến trình và thử thách của 1 user cụ thể
        [HttpGet("user/{userId}/progress")]
        public async Task<IActionResult> GetUserProgress(int userId)
        {
            try
            {
                var progressList = await _unitOfWork.QuitProgresses.GetByUserIdAsync(userId);
                var challenges = await _unitOfWork.UserQuitChallenges.GetByUserIdAsync(userId);

                // Gửi thông báo mail cho user
                var user = await _unitOfWork.Users.GetByIdAsync(userId);
                var coachName = User.FindFirst(ClaimTypes.Name)?.Value;

                if (user != null && !string.IsNullOrWhiteSpace(user.Email))
                {
                    string subject = "Huấn luyện viên đang theo dõi tiến trình của bạn";
                    string body = $"Xin chào {user.FullName},\n\n"
                                + $"Huấn luyện viên {coachName} vừa xem tiến trình và thử thách cai thuốc của bạn.\n"
                                + $"Nếu bạn cần hỗ trợ thêm, đừng ngần ngại phản hồi qua hệ thống.\n\n"
                                + $"Trân trọng,\nHệ thống hỗ trợ cai thuốc";

                    await _mailService.SendEmailAsync(user.Email, subject, body);
                }

                return Ok(new
                {
                    QuitProgress = progressList.Select(p => new
                    {
                        p.ProgressDate,
                        p.CigarettesPerDayBaseline,
                        p.CigarettesSmokedToday,
                        p.CigarettesDropped,
                        p.TotalCigarettesDropped,
                        p.TotalMoneySaved,
                        p.Notes
                    }),
                    QuitChallenges = challenges.Select(c => new
                    {
                        c.Id,
                        TemplateTitle = c.Template?.Title,
                        c.Template?.Description,
                        c.ScheduledDate,
                        c.IsCompleted,
                        c.Notes
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, stack = ex.StackTrace });
            }
        }
        // Lấy danh sách người dùng của huấn luyện viên
        [HttpGet("stats")]
        public async Task<IActionResult> GetCoachStats()
        {
            var coachId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            int userCount = await _unitOfWork.Users.CountUsersByCoachIdAsync(coachId);
            int bookingCount = await _unitOfWork.ConsultationBookings.CountByCoachIdAsync(coachId);

            return Ok(new
            {
                TotalUsers = userCount,
                TotalConsultations = bookingCount
            });
        }

        //Lấy danh sách thử thách của người dùng
        [HttpGet("user/{userId}/challenges")]
        public async Task<IActionResult> GetUserChallenges(int userId)
        {
            var challenges = await _unitOfWork.UserQuitChallenges.GetByUserIdAsync(userId);

            return Ok(challenges.Select(c => new
            {
                c.Id,
                TemplateTitle = c.Template?.Title,
                c.Template?.Description,
                c.ScheduledDate,
                c.IsCompleted,
                c.Notes
            }));
        }
    }
}
