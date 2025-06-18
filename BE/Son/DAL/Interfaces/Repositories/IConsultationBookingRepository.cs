using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;

public interface IConsultationBookingRepository : IGenericRepository<ConsultationBooking>
{
    Task<IEnumerable<ConsultationBooking>> GetByUserIdAsync(int userId);
    Task<IEnumerable<ConsultationBooking>> GetByCoachIdAsync(int coachId);
    Task<ConsultationBooking> GetByIdAsync(int bookingId);
    Task DeleteAsync(int bookingId);  // OK để giữ
    // ❌ Xoá dòng này ↓
    // Task UpdateAsync(ConsultationBooking booking);
}
