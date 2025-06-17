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

        // Lấy tất cả các payment theo UserMembershipID
        public async Task<IEnumerable<Payment>> GetByUserMembershipIdAsync(int userMembershipId)
        {
            return await _context.Payments
                                 .Where(p => p.UserMembershipID == userMembershipId)
                                 .AsNoTracking()
                                 .ToListAsync();
        }

        // Cập nhật thông tin Payment
        public async Task Update(Payment entity)
        {
            _context.Payments.Update(entity); // Cập nhật Payment
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }

        // Xóa Payment
        public async Task Remove(Payment entity)
        {
            _context.Payments.Remove(entity); // Xóa Payment
            await _context.SaveChangesAsync(); // Lưu thay đổi vào cơ sở dữ liệu
        }
    }
}
