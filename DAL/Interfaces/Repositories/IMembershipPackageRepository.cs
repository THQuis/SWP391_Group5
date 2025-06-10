using Smoking.DAL.Entities;

namespace Smoking.DAL.Interfaces.Repositories
{
    /// <summary>
    /// Interface cho MembershipPackage (không bổ sung phương thức đặc biệt)
    /// </summary>
    public interface IMembershipPackageRepository : IGenericRepository<MembershipPackage>
    {
        // Nếu cần thêm truy vấn đặc thù, khai báo ở đây
        Task<MembershipPackage> GetPackageByNameAsync(string packageName);
    }
}
