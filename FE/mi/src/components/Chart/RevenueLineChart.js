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

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                const res = await fetch('/api/admin/revenue-monthly');
                const data = await res.json();
                setRevenueData(data.monthlyRevenue || []);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu doanh thu:', err);
            }
        };

        fetchRevenue();
    }, []);

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
