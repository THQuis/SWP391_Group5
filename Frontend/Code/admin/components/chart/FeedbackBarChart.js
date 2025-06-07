import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const FeedbackBarChart = () => {
    const data = {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
            {
                label: 'Số lượt đánh giá',
                data: [2, 4, 6, 10, 18],
                backgroundColor: '#95a5a6',
            },
        ],
    };

    return <Bar data={data} />;
};

export default FeedbackBarChart;
