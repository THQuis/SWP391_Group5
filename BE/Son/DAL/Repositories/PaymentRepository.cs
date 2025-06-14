using Microsoft.EntityFrameworkCore;
using Smoking.DAL.Data;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smoking.DAL.Repositories
{
    public class PaymentRepository : GenericRepository<Payment>, IPaymentRepository
    {
        public PaymentRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Payment>> GetByUserMembershipIdAsync(int userMembershipId)
        {
            return await _context.Payments
                                 .Where(p => p.UserMembershipID == userMembershipId)
                                 .AsNoTracking()
                                 .ToListAsync();
        }
    }
}
