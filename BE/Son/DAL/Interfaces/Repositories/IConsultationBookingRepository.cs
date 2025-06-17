using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    public interface IConsultationBookingRepository : IGenericRepository<ConsultationBooking>
    {
        Task<IEnumerable<ConsultationBooking>> GetByUserIdAsync(int userId);
        Task<IEnumerable<ConsultationBooking>> GetByCoachIdAsync(int coachId);
        Task<ConsultationBooking> GetByIdAsync(int bookingId); // Phương thức mới

        Task UpdateAsync(ConsultationBooking booking);  // Phương thức UpdateAsync
        Task DeleteAsync(int bookingId); // Phương thức xóa theo ID
    }
}
