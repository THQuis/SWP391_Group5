import React, { useEffect, useState } from 'react';
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
    const [ratingsData, setRatingsData] = useState([0, 0, 0, 0, 0]);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await fetch('/api/admin/feedback-ratings');
                const data = await res.json();

                // Chuyển object { "1": 2, "2": 4, ... } thành array [2, 4, 6, 10, 18]
                const parsed = [1, 2, 3, 4, 5].map((key) => data.ratings[key] || 0);
                setRatingsData(parsed);
            } catch (err) {
                console.error('Lỗi khi tải đánh giá:', err);
            }
        };

        fetchRatings();
    }, []);

    const chartData = {
        labels: ['1', '2', '3', '4', '5'],
        datasets: [
            {
                label: 'Số lượt đánh giá',
                data: ratingsData,
                backgroundColor: '#95a5a6',
            },
        ],
    };

    return <Bar data={chartData} />;
};

export default FeedbackBarChart;
