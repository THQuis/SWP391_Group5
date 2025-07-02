class ApiService {
    constructor() {
        // Lấy baseURL từ biến môi trường
        this.baseURL = process.env.REACT_APP_API_URL;
    }

    getToken() {
        return localStorage.getItem('userToken');
    }

    getUserData() {
        return {
            userToken: localStorage.getItem('userToken'),
            userRole: localStorage.getItem('userRole'),
            userName: localStorage.getItem('userName'),
            userEmail: localStorage.getItem('userEmail'),
            userId: localStorage.getItem('userId'),
            coachId: localStorage.getItem('coachId'),
            profilePicture: localStorage.getItem('profilePicture'),
            gender: localStorage.getItem('gender'),
            dateOfBirth: localStorage.getItem('dateOfBirth'),
            phoneNumber: localStorage.getItem('phoneNumber')
        };
    }

    isAuthenticated() {
        const token = this.getToken();
        return token && token !== 'null' && token !== 'undefined';
    }

    getHeaders() {
        const token = this.getToken();
        return {
            'Content-Type': 'application/json',
            'Accept': '*/*',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    async apiCall(endpoint, options = {}) {
        try {
            const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
            const config = {
                ...options,
                headers: this.getHeaders()
            };

            console.log(`🚀 API Call: ${url}`);
            console.log(`📋 Headers:`, config.headers);

            const response = await fetch(url, config);

            if (!response.ok) {
                if (response.status === 401) {
                    this.clearUserData();
                    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                }
                // Lấy message từ response nếu có
                let errMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errMsg = errorData.message || errorData.error || errMsg;
                } catch { }
                throw new Error(errMsg);
            }

            const data = await response.json();
            console.log(`✅ API Response:`, data);
            return data;
        } catch (error) {
            console.error('❌ API call failed:', error);
            throw error;
        }
    }

    async getMoneySavedRanking(topN = 10) {
        return await this.apiCall(`/ranking/top-money-saved?top=${topN}`, {
            method: 'GET'
        });
    }

    clearUserData() {
        const keysToRemove = [
            'userToken', 'userRole', 'userName', 'userEmail', 'userId',
            'coachId', 'profilePicture', 'gender', 'dateOfBirth', 'phoneNumber'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
}

export default new ApiService();