using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Interface cho Payment, bổ sung GetByUserMembershipIdAsync
    /// </summary>
    public interface IPaymentRepository : IGenericRepository<Payment>
    {
        Task<IEnumerable<Payment>> GetByUserMembershipIdAsync(int userMembershipId);
    }
}
