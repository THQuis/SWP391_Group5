import React from 'react';
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
    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
            {
                label: 'Doanh thu',
                data: [1000, 1200, 800, 1500, 1100, 1300, 1600, 1700, 1400, 1800, 1900, 2000],
                borderColor: '#3498db',
                backgroundColor: '#85c1e9',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    return <Line data={data} />;
};

export default RevenueLineChart;
