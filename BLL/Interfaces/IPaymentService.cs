using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IPaymentService
    {
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment> GetByIdAsync(int id);
        Task<IEnumerable<Payment>> GetByUserMembershipIdAsync(int userMembershipId);
        Task<Payment> CreateAsync(Payment entity);
        Task<bool> UpdateAsync(Payment entity);
        Task<bool> DeleteAsync(int id);
    }
}
