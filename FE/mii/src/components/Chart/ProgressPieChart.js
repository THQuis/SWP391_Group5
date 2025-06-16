import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ProgressPieChart = () => {
    const [progressData, setProgressData] = useState([0, 0, 0, 0]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch('/api/admin/progress-status');
                const data = await res.json();
                setProgressData([
                    data.inProgress || 0,
                    data.success || 0,
                    data.failed || 0,
                    data.recovered || 0,
                ]);
            } catch (err) {
                console.error('Lỗi khi tải tiến trình:', err);
            }
        };

        fetchProgress();
    }, []);

    const data = {
        labels: ['Đang tiến trình', 'Thành công', 'Thất bại', 'Hồi phục'],
        datasets: [
            {
                data: progressData,
                backgroundColor: ['#f39c12', '#2ecc71', '#e74c3c', '#3498db'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: { size: 10 },
                    boxWidth: 20,
                },
            },
            datalabels: {
                formatter: (value, context) => {
                    const total = context.chart._metasets[0].total || 1;
                    const percent = ((value / total) * 100).toFixed(1) + '%';
                    return percent;
                },
                color: '#fff',
                font: {
                    weight: 'bold',
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div style={{ width: '200px', height: '200px', margin: 'auto' }}>
            <Pie data={data} options={options} />
        </div>
    );
};

export default ProgressPieChart;
