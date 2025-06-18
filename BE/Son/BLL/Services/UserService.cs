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
            if (existing != null) throw new System.Exception("Email đã tồn tại.");

            await _unitOfWork.Users.AddAsync(entity);
            await _unitOfWork.CompleteAsync();
            return entity;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(id);
            if (user == null) return false;

            _unitOfWork.Users.Remove(user);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
            => await _unitOfWork.Users.GetAllAsync();

        public async Task<User> GetByEmailAsync(string email)
            => await _unitOfWork.Users.GetByEmailAsync(email);

        public async Task<User> GetByIdAsync(int id)
            => await _unitOfWork.Users.GetByIdAsync(id);

        public async Task<bool> UpdateAsync(User entity)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(entity.UserID);
            if (user == null) return false;

            user.FullName = entity.FullName;
            user.Email = entity.Email;
            user.PhoneNumber = entity.PhoneNumber;
            user.RoleID = entity.RoleID;
            user.Status = entity.Status;
            user.ProfilePicture = entity.ProfilePicture;

            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<User> AuthenticateAsync(string email, string password)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            return user?.Password == password ? user : null;
        }

        public async Task DeleteUserByEmailAsync(string email)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null) throw new System.Exception("Không tìm thấy user với email này.");

            _unitOfWork.Users.Remove(user);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateProfileAsync(string email, string fullName, string phoneNumber, string profilePicture, string? description)
        {
            var user = await _unitOfWork.Users.GetByEmailAsync(email);
            if (user == null)
                throw new Exception("Không tìm thấy user với email này.");

            user.FullName = fullName;
            user.PhoneNumber = phoneNumber;
            user.ProfilePicture = profilePicture;
            user.Description = description; // 👈 Thêm dòng này

            _unitOfWork.Users.Update(user);
            await _unitOfWork.CompleteAsync();
        }


        public async Task<User> GetUserByEmailAsync(string email)
            => await _unitOfWork.Users.GetByEmailAsync(email);

        public async Task<IEnumerable<User>> GetAllUsersAsync()
            => await _unitOfWork.Users.GetAllAsync();

        public async Task<IEnumerable<User>> GetUsersByRoleAsync(string role)
            => await _unitOfWork.Users.GetByRoleAsync(role);
    }
}
