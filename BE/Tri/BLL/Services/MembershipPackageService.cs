using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class MembershipPackageService : IMembershipPackageService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MembershipPackageService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<MembershipPackage> CreateAsync(MembershipPackage entity)
        {
            await _unitOfWork.MembershipPackages.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.MembershipPackages.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.MembershipPackages.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<MembershipPackage>> GetAllAsync()
        {
            return await _unitOfWork.MembershipPackages.GetAllAsync();
        }

        public async Task<MembershipPackage> GetByIdAsync(int id)
        {
            return await _unitOfWork.MembershipPackages.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(MembershipPackage entity)
        {
            var existing = await _unitOfWork.MembershipPackages.GetByIdAsync(entity.PackageID);
            if (existing == null)
                return false;

            existing.PackageName = entity.PackageName;
            existing.PackageType = entity.PackageType;
            existing.Description = entity.Description;
            existing.Price = entity.Price;
            existing.Duration = entity.Duration;

            _unitOfWork.MembershipPackages.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}
