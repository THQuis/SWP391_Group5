using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System;
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

        public async Task<IEnumerable<ConsultationBooking>> GetAllAsync()
        {
            return await _context.ConsultationBookings.AsNoTracking().ToListAsync();
        }

        public async Task<ConsultationBooking> GetByIdAsync(object id)
        {
            return await _context.ConsultationBookings.FirstOrDefaultAsync(cb => cb.BookingID == (int)id);
        }

        public async Task<ConsultationBooking> GetByIdAsync(int bookingId)
        {
            return await _context.ConsultationBookings.FirstOrDefaultAsync(cb => cb.BookingID == bookingId);
        }

        public async Task<IEnumerable<ConsultationBooking>> FindAsync(Expression<Func<ConsultationBooking, bool>> predicate)
        {
            return await _context.ConsultationBookings.AsNoTracking().Where(predicate).ToListAsync();
        }

        public async Task AddAsync(ConsultationBooking entity)
        {
            await _context.ConsultationBookings.AddAsync(entity);
        }

        public Task Update(ConsultationBooking entity)
        {
            _context.ConsultationBookings.Update(entity);
            return Task.CompletedTask;
        }

        public Task Remove(ConsultationBooking entity)
        {
            _context.ConsultationBookings.Remove(entity);
            return Task.CompletedTask;
        }

        public async Task<bool> AnyAsync(Expression<Func<ConsultationBooking, bool>> predicate)
        {
            return await _context.ConsultationBookings.AnyAsync(predicate);
        }

        public async Task<IEnumerable<ConsultationBooking>> GetByUserIdAsync(int userId)
        {
            return await _context.ConsultationBookings
                .Include(cb => cb.Coach)
                .Where(cb => cb.UserID == userId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<IEnumerable<ConsultationBooking>> GetByCoachIdAsync(int coachId)
        {
            return await _context.ConsultationBookings
                .Include(cb => cb.User)
                .Where(cb => cb.CoachID == coachId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task DeleteAsync(int bookingId)
        {
            var booking = await GetByIdAsync(bookingId);
            if (booking != null)
            {
                _context.ConsultationBookings.Remove(booking);
            }
        }
    }
}
