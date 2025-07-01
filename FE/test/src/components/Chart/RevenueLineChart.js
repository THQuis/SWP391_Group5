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

const MONTH_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const RevenueLineChart = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            setLoading(true);
            const currentYear = new Date().getFullYear();
            const monthlyRevenue = [];
            const token = localStorage.getItem('userToken');

            for (let month = 1; month <= 12; month++) {
                try {
                    const res = await fetch(`/api/Revenue/month?year=${currentYear}&month=${month}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        monthlyRevenue.push(data.total ?? 0);
                    } else {
                        console.error(`API error month ${month}:`, res.status, res.statusText);
                        monthlyRevenue.push(0);
                    }
                } catch (err) {
                    console.error(`Fetch error month ${month}:`, err);
                    monthlyRevenue.push(0);
                }
            }
            setRevenueData(monthlyRevenue);
            setLoading(false);
        };

        fetchRevenue();
    }, []);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    const chartData = {
        labels: MONTH_LABELS,
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