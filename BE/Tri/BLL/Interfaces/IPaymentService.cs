using Smoking.DAL.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Interfaces
{
    public interface IPaymentService
    {
        Task<(string payUrl, string transactionReference)> CreatePaymentAsync(int userId, int packageId, string method);
        Task HandlePaymentCallbackAsync(string reference, string status);
    }
}
