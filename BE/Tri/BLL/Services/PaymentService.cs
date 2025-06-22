using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Smoking.BLL.Interfaces;
using Smoking.BLL.Models;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Smoking.BLL.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserMembershipService _userMembershipService;
        private readonly MomoConfig _momoConfig;

        public PaymentService(IUnitOfWork unitOfWork, IUserMembershipService userMembershipService, IOptions<MomoConfig> momoOptions)
        {
            _unitOfWork = unitOfWork;
            _userMembershipService = userMembershipService;
            _momoConfig = momoOptions.Value;
        }

        public async Task<(string payUrl, string transactionReference)> CreatePaymentAsync(int userId, int packageId, string method)
        {
            // Kiểm tra nếu user đang có gói còn hiệu lực
            var current = await _unitOfWork.UserMemberships.GetActiveByUserIdAsync(userId);
            if (current != null)
            {
                throw new Exception("Bạn đang sử dụng một gói thành viên còn hiệu lực. Vui lòng đợi hết hạn để mua gói mới.");
            }

            var package = await _unitOfWork.MembershipPackages.GetByIdAsync(packageId);
            if (package == null)
                throw new Exception("Gói không tồn tại");

            // Tạo UserMembership mới
            var userMembership = await _userMembershipService.CreateOrUpdateMembershipAsync(userId, packageId);

            var requestId = Guid.NewGuid().ToString();
            var orderId = Guid.NewGuid().ToString();
            var amount = package.Price.ToString("F0");

            var rawHash = $"accessKey={_momoConfig.AccessKey}&amount={amount}&extraData=&ipnUrl={_momoConfig.NotifyUrl}&orderId={orderId}&orderInfo=Thanh toán gói {package.PackageName}&partnerCode={_momoConfig.PartnerCode}&redirectUrl={_momoConfig.ReturnUrl}&requestId={requestId}&requestType=captureWallet";

            var signature = CreateSignature(_momoConfig.SecretKey, rawHash);

            var body = new
            {
                partnerCode = _momoConfig.PartnerCode,
                accessKey = _momoConfig.AccessKey,
                requestId,
                amount,
                orderId,
                orderInfo = $"Thanh toán gói {package.PackageName}",
                redirectUrl = _momoConfig.ReturnUrl,
                ipnUrl = _momoConfig.NotifyUrl,
                extraData = "",
                requestType = "captureWallet",
                signature,
                lang = "vi"
            };

            using var client = new HttpClient();
            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");
            var response = await client.PostAsync(_momoConfig.Endpoint, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            var responseData = JsonSerializer.Deserialize<JsonElement>(responseBody);
            if (!responseData.TryGetProperty("payUrl", out var urlProp))
            {
                throw new Exception("MoMo không trả về payUrl: " + responseBody);
            }

            var payUrl = urlProp.GetString();

            await _unitOfWork.Payments.AddAsync(new Payment
            {
                Amount = package.Price,
                UserMembershipID = userMembership.UserMembershipID,
                PaymentMethod = "Momo",
                Status = "Pending",
                TransactionReference = orderId,
                PaymentDate = DateTime.UtcNow
            });

            await _unitOfWork.CompleteAsync();
            return (payUrl!, orderId);
        }

        public async Task HandlePaymentCallbackAsync(string reference, string status)
        {
            var payment = await _unitOfWork.Payments.GetByTransactionReferenceAsync(reference);
            if (payment == null) return;

            payment.Status = status;
            await _unitOfWork.Payments.UpdateAsync(payment);
            await _unitOfWork.CompleteAsync();
        }

        private string CreateSignature(string secretKey, string rawData)
        {
            var encoding = new UTF8Encoding();
            byte[] keyByte = encoding.GetBytes(secretKey);
            byte[] messageBytes = encoding.GetBytes(rawData);

            using var hmacsha256 = new HMACSHA256(keyByte);
            byte[] hashmessage = hmacsha256.ComputeHash(messageBytes);

            return BitConverter.ToString(hashmessage).Replace("-", "").ToLower();
        }
    }

}
