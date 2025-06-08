using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebTestAPI.ModelFromDB;
using WebTestAPI.DTOs;

namespace WebTestAPI.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly CSDL_SmookingPlatFrom _context;

        public AdminController(CSDL_SmookingPlatFrom context)
        {
            _context = context;
        }

        // =======================
        // 🔐 API: Thêm người dùng
        // =======================

        [HttpPost("add-user")]
        public async Task<IActionResult> AddUser([FromBody] AddUserRequest request)
        {
            // Kiểm tra xem email có tồn tại trong hệ thống không
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return Conflict(new { message = "Email đã tồn tại trong hệ thống." });
            }

            // Kiểm tra xem RoleId có hợp lệ không
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == request.RoleId);
            if (role == null)
            {
                return BadRequest(new { message = "Vai trò không hợp lệ." });
            }

            // Kiểm tra xem PackageId có hợp lệ không
            var package = await _context.MembershipPackages.FirstOrDefaultAsync(p => p.PackageId == request.PackageId);
            if (package == null)
            {
                return BadRequest(new { message = "Gói thành viên không hợp lệ." });
            }

            // Tạo người dùng mới
            var newUser = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                Password = request.Password,  // Lưu ý mã hóa mật khẩu trước khi lưu vào DB
                PhoneNumber = request.PhoneNumber,
                RoleId = request.RoleId,
                Status = request.Status,
                RegistrationDate = DateTime.Now
            };

            // Thêm người dùng vào bảng User
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // Thêm gói thành viên cho người dùng (UserMembership)
            var newUserMembership = new UserMembership
            {
                UserId = newUser.UserId,
                PackageId = request.PackageId,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddMonths(1), // Thời gian bắt đầu và kết thúc của gói
                PaymentStatus = "Pending"
            };

            // Thêm vào bảng UserMembership
            _context.UserMemberships.Add(newUserMembership);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Người dùng đã được thêm thành công!" });
        }





        // =======================
        // 🔐 API: Update người dùng
        // =======================
        [HttpPut("update-user/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UpdateUserRequest request)
        {
            // Tìm người dùng theo UserId
            var user = await _context.Users
                                      .Include(u => u.UserMemberships)  // Bao gồm UserMemberships để xử lý gói thành viên
                                      .FirstOrDefaultAsync(u => u.UserId == userId);

            // Nếu người dùng không tồn tại
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại." });
            }

            // Cập nhật thông tin người dùng
            user.FullName = request.FullName;
            user.Email = request.Email;
            user.Password = request.Password;  // Mã hóa mật khẩu trước khi lưu vào DB nếu cần
            user.RoleId = request.RoleId;
            user.Status = request.Status;

            // Cập nhật gói thành viên (PackageId) - Cập nhật vào UserMembership
            var userMembership = user.UserMemberships.FirstOrDefault();
            if (userMembership != null)
            {
                userMembership.PackageId = request.PackageId;
                // Cập nhật lại thời gian và trạng thái của gói thành viên (tuỳ theo yêu cầu)
                userMembership.StartDate = DateTime.Now;
                userMembership.EndDate = DateTime.Now.AddMonths(1); // Ví dụ thời gian gói mới
                userMembership.PaymentStatus = "Pending"; // Hoặc trạng thái khác
            }
            else
            {
                // Nếu chưa có UserMembership, tạo mới
                var newMembership = new UserMembership
                {
                    UserId = userId,
                    PackageId = request.PackageId,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddMonths(1), // Thời gian bắt đầu và kết thúc của gói
                    PaymentStatus = "Pending"
                };
                _context.UserMemberships.Add(newMembership);
            }

            // Cập nhật người dùng trong cơ sở dữ liệu
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thông tin người dùng thành công!" });
        }


        // =======================
        // 🔐 API: Xóa người dùng
        // =======================

        [HttpDelete("delete-user/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            // Tìm người dùng theo UserId
            var user = await _context.Users
                                      .Include(u => u.UserMemberships)  // Bao gồm UserMemberships để xóa thông tin gói thành viên
                                      .FirstOrDefaultAsync(u => u.UserId == userId);

            // Nếu người dùng không tồn tại
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại." });
            }

            // Xóa UserMembership (nếu có)
            if (user.UserMemberships != null)
            {
                _context.UserMemberships.RemoveRange(user.UserMemberships);
            }

            // Xóa người dùng
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Người dùng đã được xóa thành công!" });
        }


        [HttpGet("get-users")]
        public async Task<IActionResult> GetUsers([FromQuery] string role = null, [FromQuery] string status = null, [FromQuery] string name = null)
        {
            // Khởi tạo query để lấy tất cả người dùng
            var usersQuery = _context.Users
                                     .Include(u => u.Role)
                                     .Include(u => u.UserMemberships)
                                     .ThenInclude(um => um.Package) // Liên kết đến bảng MembershipPackage
                                     .AsQueryable();

            // Kiểm tra và áp dụng bộ lọc theo vai trò (nếu có)
            if (!string.IsNullOrEmpty(role))
            {
                usersQuery = usersQuery.Where(u => u.Role.RoleName == role);
            }

            // Kiểm tra và áp dụng bộ lọc theo trạng thái (nếu có)
            if (!string.IsNullOrEmpty(status))
            {
                usersQuery = usersQuery.Where(u => u.Status == status);
            }

            // Kiểm tra và áp dụng bộ lọc theo tên (nếu có)
            if (!string.IsNullOrEmpty(name))
            {
                usersQuery = usersQuery.Where(u => u.FullName.Contains(name));
            }

            // Lấy danh sách người dùng sau khi áp dụng bộ lọc (hoặc không áp dụng bộ lọc)
            var users = await usersQuery.ToListAsync();

            if (users.Count == 0)
            {
                return Ok(new { message = "Không tìm thấy người dùng thỏa mãn các bộ lọc." });
            }

            return Ok(users);
        }



    }

}
