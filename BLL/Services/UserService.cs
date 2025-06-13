using Smoking.BLL.Interfaces;
using Smoking.DAL.Entities;
using Smoking.DAL.Interfaces.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Smoking.BLL.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<User> CreateAsync(User entity)
        {
            var existing = await _unitOfWork.Users.GetByEmailAsync(entity.Email);
            if (existing != null)
            {
                throw new System.Exception("Email đã tồn tại.");
            }

            await _unitOfWork.Users.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _unitOfWork.Users.GetByIdAsync(id);
            if (existing == null)
                return false;

            _unitOfWork.Users.Remove(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _unitOfWork.Users.GetAllAsync();
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            return await _unitOfWork.Users.GetByEmailAsync(email);
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await _unitOfWork.Users.GetByIdAsync(id);
        }

        public async Task<bool> UpdateAsync(User entity)
        {
            var existing = await _unitOfWork.Users.GetByIdAsync(entity.UserID);
            if (existing == null)
                return false;

            existing.FullName = entity.FullName;
            existing.Email = entity.Email;
            existing.PhoneNumber = entity.PhoneNumber;
            existing.RoleID = entity.RoleID;
            existing.Status = entity.Status;
            existing.ProfilePicture = entity.ProfilePicture;

            _unitOfWork.Users.Update(existing);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<User> AuthenticateAsync(string email, string password)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null)
                return null;

            // Nếu lưu password dạng mã hóa (hash), bạn cần kiểm tra hash ở đây
            if (user.Password == password)
                return user;

            return null;
        }

        // MỚI THÊM:
        public async Task DeleteUserByEmailAsync(string email)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null)
                throw new System.Exception("Không tìm thấy user với email này.");

            _unitOfWork.Users.Remove(user);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateProfileAsync(string email, string fullName, string phoneNumber, string profilePicture)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null)
                throw new System.Exception("Không tìm thấy user với email này.");

            user.FullName = fullName;
            user.PhoneNumber = phoneNumber;
            user.ProfilePicture = profilePicture;

            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();
        }
    }
}
