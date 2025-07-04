// class ApiService {
//     // Lấy token từ localStorage (giống AuthPage)
//     getToken() {
//         return localStorage.getItem('userToken');
//     }
//     // Lấy thông tin user từ localStorage (giống AuthPage)
//     getUserData() {
//         return {
//             userToken: localStorage.getItem('userToken'),
//             userRole: localStorage.getItem('userRole'),
//             userName: localStorage.getItem('userName'),
//             userEmail: localStorage.getItem('userEmail'),
//             userId: localStorage.getItem('userId'),
//             coachId: localStorage.getItem('coachId'),
//             profilePicture: localStorage.getItem('profilePicture'),
//             gender: localStorage.getItem('gender'),
//             dateOfBirth: localStorage.getItem('dateOfBirth'),
//             phoneNumber: localStorage.getItem('phoneNumber')
//         };
//     }

//     // Kiểm tra xem user có đăng nhập không
//     isAuthenticated() {
//         const token = this.getToken();
//         return token && token !== 'null' && token !== 'undefined';
//     }

//     // Tạo headers với token từ localStorage
//     getHeaders() {
//         const token = this.getToken();
//         return {
//             'Content-Type': 'application/json',
//             'Accept': '*/*',
//             ...(token && { 'Authorization': `Bearer ${token}` })
//         };
//     }
//     // Generic API call method
//     async apiCall(endpoint, options = {}) {
//         try {
//             const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

//             const config = {
//                 headers: this.getHeaders(),
//                 ...options
//             };

//             console.log(`🚀 API Call: ${url}`);
//             console.log(`📋 Headers:`, config.headers);

//             const response = await fetch(url, config);

//             if (!response.ok) {
//                 if (response.status === 401) {
//                     // Token expired hoặc invalid, clear localStorage
//                     this.clearUserData();
//                     throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
//                 }
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();
//             console.log(`✅ API Response:`, data);
//             return data;
//         } catch (error) {
//             console.error('❌ API call failed:', error);
//             throw error;
//         }
//     }

//     // // Lấy money saved ranking từ API mới
//     // async getMoneySavedRanking(topN = 10) {
//     //     return await this.apiCall(`/api/ranking/top-money-saved?top=${topN}`, {
//     //         method: 'GET'
//     //     });
//     // }

//     // Clear user data from localStorage
//     clearUserData() {
//         const keysToRemove = [
//             'userToken', 'userRole', 'userName', 'userEmail', 'userId',
//             'coachId', 'profilePicture', 'gender', 'dateOfBirth', 'phoneNumber'
//         ];

//         keysToRemove.forEach(key => {
//             localStorage.removeItem(key);
//         });
//     }
// }

// // eslint-disable-next-line import/no-anonymous-default-export
// export default new ApiService();
