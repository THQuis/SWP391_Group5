import React from 'react';

// Performance utility để debug memory leaks và freeze issues
export const performanceUtils = {
    // Cleanup function cho components
    cleanupComponent: (name) => {
        console.log(`🧹 Cleaning up component: ${name}`);

        // Clear timeouts - safer approach
        const highestTimeoutId = setTimeout(() => { }, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

        // Clear intervals - safer approach
        const highestIntervalId = setInterval(() => { }, 9999);
        for (let i = 0; i < highestIntervalId; i++) {
            clearInterval(i);
        }
        clearInterval(highestIntervalId);
    },

    // Memory usage monitor
    monitorMemory: () => {
        if (window.performance && window.performance.memory) {
            const memory = window.performance.memory;
            console.log('🧠 Memory usage:', {
                used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
                total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
                limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
            });
        }
    },

    // Debounce function để tránh excessive calls
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function để limit frequency
    throttle: (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Cleanup localStorage khi logout
    clearUserData: () => {
        const keysToRemove = [
            'userToken', 'userRole', 'userName', 'userEmail',
            'userId', 'coachId', 'profilePicture', 'memberPackage'
        ];

        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
        });

        console.log('🗑️ User data cleared from localStorage');
    },

    // Token validation utilities
    validateToken: async () => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            console.log('🚫 No token found');
            return false;
        }

        try {
            // Decode JWT để check expiration (nếu backend sử dụng JWT)
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                const currentTime = Math.floor(Date.now() / 1000);

                if (payload.exp && payload.exp < currentTime) {
                    console.log('⏰ Token expired');
                    return false;
                }
            }

            // Validate với backend
            const response = await fetch('/api/Auth/validate', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('✅ Token valid');
                return true;
            } else {
                console.log('❌ Token invalid, status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Error validating token:', error);
            return false;
        }
    },

    // Auto logout when token expires
    handleTokenExpiration: () => {
        console.log('🔒 Token expired, clearing user data');
        performanceUtils.clearUserData();

        // Trigger storage event để update tất cả components
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'userToken',
            oldValue: 'expired',
            newValue: null,
            storageArea: localStorage
        }));

        // Redirect to login
        setTimeout(() => {
            window.location.replace('/login');
        }, 100);
    },
};

// React hook để monitor component lifecycle
export const useComponentLifecycle = (componentName) => {
    React.useEffect(() => {
        console.log(`🚀 Component mounted: ${componentName}`);
        performanceUtils.monitorMemory();

        return () => {
            console.log(`💀 Component unmounting: ${componentName}`);
            performanceUtils.cleanupComponent(componentName);
        };
    }, [componentName]);
};
