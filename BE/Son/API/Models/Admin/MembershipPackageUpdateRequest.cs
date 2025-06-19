namespace Smoking.API.Models.Admin
{
    public class MembershipPackageUpdateRequest
    {
        public string PackageName { get; set; }
        public string PackageType { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Duration { get; set; }
    }
}
