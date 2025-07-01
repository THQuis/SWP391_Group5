import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const RevenueLineChart = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                // TEST: Thử với dữ liệu mẫu trước
                const testData = [100000, 150000, 200000, 180000, 250000, 300000, 350000, 893000, 400000, 450000, 500000, 550000];
                console.log('Dữ liệu test:', testData);
                setRevenueData(testData);
                setLoading(false);
                return; // Tạm thời skip API call

                const currentYear = new Date().getFullYear();
                const monthlyRevenue = [];

                // Gọi API cho từng tháng (1-12)
                for (let month = 1; month <= 12; month++) {
                    const url = `http://localhost:7049/api/Revenue/month?year=${currentYear}&month=${month}`;

                    try {
                        const res = await fetch(url, {
                            headers: {
                                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJDYW8gSOG7r3UgVHLDrSIsImVtYWlsIjoiY2FvaHV1dHJpdGwxMjM0QGdtYWlsLmNvbSIsInJvbGUiOiIxIiwibmJmIjoxNzUxMzcwNzY4LCJleHAiOjE3NTEzNzQzNjgsImlhdCI6MTc1MTM3MDc2OCwiaXNzIjoiU21va2luZ0FQSSIsImF1ZCI6IlNtb2tpbmdDbGllbnRzIn0.sYaZ9ESOiCYreCP85y2-2kkDoA3HtBjLOtIQFXIjufw'
                            }
                        });

                        if (res.ok) {
                            const data = await res.json();
                            console.log(`Tháng ${month}:`, data); // Debug log
                            monthlyRevenue.push(data.total || 0);
                        } else {
                            console.error(`Lỗi API tháng ${month}:`, res.status, res.statusText);
                            monthlyRevenue.push(0);
                        }
                    } catch (monthErr) {
                        console.error(`Lỗi khi tải dữ liệu tháng ${month}:`, monthErr);
                        monthlyRevenue.push(0);
                    }
                }

                console.log('Dữ liệu doanh thu final:', monthlyRevenue); // Debug log
                setRevenueData(monthlyRevenue);
                setLoading(false);

            } catch (err) {
                console.error('Lỗi khi tải dữ liệu doanh thu:', err);
                // Đặt dữ liệu mặc định nếu có lỗi
                setRevenueData(Array(12).fill(0));
                setLoading(false);
            }
        };

        fetchRevenue();
    }, []);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    const chartData = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
            {
                label: 'Doanh thu (nghìn đồng)',
                data: revenueData,
                borderColor: '#3498db',
                backgroundColor: '#85c1e9',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    return <Line data={chartData} />;
};

export default RevenueLineChart;
