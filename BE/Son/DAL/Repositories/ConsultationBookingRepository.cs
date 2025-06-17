using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class ConsultationBookingRepository : IConsultationBookingRepository
    {
        private readonly AppDbContext _context;

        public ConsultationBookingRepository(AppDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả lịch tư vấn
        public async Task<IEnumerable<ConsultationBooking>> GetAllAsync()
        {
            return await _context.ConsultationBookings.ToListAsync();
        }

        // Lấy lịch tư vấn theo BookingID (chuẩn interface)
        public async Task<ConsultationBooking> GetByIdAsync(int bookingId)
        {
            return await _context.ConsultationBookings
                .FirstOrDefaultAsync(cb => cb.BookingID == bookingId);
        }

        // Lấy lịch tư vấn theo BookingID (IGenericRepository<object>)
        public async Task<ConsultationBooking> GetByIdAsync(object id)
        {
            return await GetByIdAsync((int)id);
        }

        // Tìm kiếm các lịch tư vấn theo điều kiện
        public async Task<IEnumerable<ConsultationBooking>> FindAsync(Expression<Func<ConsultationBooking, bool>> predicate)
        {
            return await _context.ConsultationBookings
                .Where(predicate)
                .ToListAsync();
        }

        // Thêm mới lịch tư vấn
        public async Task AddAsync(ConsultationBooking entity)
        {
            await _context.ConsultationBookings.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        // Cập nhật thông tin lịch tư vấn (async)
        public async Task Update(ConsultationBooking entity)
        {
            _context.ConsultationBookings.Update(entity);
            await _context.SaveChangesAsync();
        }

        // Cập nhật thông tin lịch tư vấn (async) với phương thức UpdateAsync
        public async Task UpdateAsync(ConsultationBooking booking)
        {
            _context.ConsultationBookings.Update(booking);
            await _context.SaveChangesAsync();
        }

        // Xóa lịch tư vấn (async)
        public async Task Remove(ConsultationBooking entity)
        {
            _context.ConsultationBookings.Remove(entity);
            await _context.SaveChangesAsync();
        }

        // Xóa lịch tư vấn theo BookingID (async)
        public async Task DeleteAsync(int bookingId)
        {
            var booking = await GetByIdAsync(bookingId);
            if (booking != null)
            {
                _context.ConsultationBookings.Remove(booking);
                await _context.SaveChangesAsync();
            }
        }

        // Kiểm tra xem có bất kỳ lịch tư vấn nào thỏa mãn điều kiện
        public async Task<bool> AnyAsync(Expression<Func<ConsultationBooking, bool>> predicate)
        {
            return await _context.ConsultationBookings
                .AnyAsync(predicate);
        }

        // Lấy lịch tư vấn theo UserID
        public async Task<IEnumerable<ConsultationBooking>> GetByUserIdAsync(int userId)
        {
            return await _context.ConsultationBookings
                .Include(cb => cb.Coach)
                .Where(cb => cb.UserID == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        // Lấy lịch tư vấn theo CoachID
        public async Task<IEnumerable<ConsultationBooking>> GetByCoachIdAsync(int coachId)
        {
            return await _context.ConsultationBookings
                .Include(cb => cb.User)
                .Where(cb => cb.CoachID == coachId)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}