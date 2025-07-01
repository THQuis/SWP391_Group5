import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

// Hook for ranking data với localStorage integration
export const useRanking = (type, topN = 10) => {
    const [rankingData, setRankingData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRanking = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Kiểm tra authentication trước khi gọi API
            if (!apiService.isAuthenticated()) {
                throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập để xem dữ liệu.');
            }

            let data;
            switch (type) {
                case 'money-saved':
                    data = await apiService.getMoneySavedRanking(topN);
                    break;
                default:
                    data = await apiService.getMoneySavedRanking(topN);
            }

            console.log('🎯 Ranking data received:', data);
            setRankingData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('❌ Error fetching ranking data:', error);
            setError(error.message);
            setRankingData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRanking();
    }, [type, topN]);

    const refetch = () => {
        console.log('🔄 Refetching ranking data...');
        fetchRanking();
    };

    return {
        rankingData,
        isLoading,
        error,
        refetch
    };
};

// Hook for general API and user data từ localStorage
export const useApi = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Lấy user data từ localStorage (giống AuthPage)
        const storedUserData = apiService.getUserData();
        console.log('👤 User data from localStorage:', storedUserData);
        setUserData(storedUserData);
    }, []);

    const isAuthenticated = () => {
        return apiService.isAuthenticated();
    };

    const clearUserData = () => {
        apiService.clearUserData();
        setUserData(null);
    };

    const refreshUserData = () => {
        const storedUserData = apiService.getUserData();
        setUserData(storedUserData);
    };

    return {
        userData,
        isAuthenticated,
        clearUserData,
        refreshUserData
    };
};
