// import React from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const ProgressPieChart = () => {
//     const data = {
//         labels: ['Đang tiến trình', 'Thành công', 'Thất bại', 'Hồi phục'],
//         datasets: [
//             {
//                 data: [40, 30, 20, 10],
//                 backgroundColor: ['#f39c12', '#2ecc71', '#e74c3c', '#3498db'],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     return <Pie data={data} />;
// };

// export default ProgressPieChart;


import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { color } from 'chart.js/helpers';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const ProgressPieChart = () => {
    const data = {
        labels: ['Đang tiến trình', 'Thành công', 'Thất bại', 'Hồi phục'],
        datasets: [
            {
                data: [40, 30, 20, 10],
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
                    font: { size: 10 },// tăng cỡ chú thíchthích
                    boxWidth: 20,
                },
            },
            datalabels: {
                formatter: (value, context) => {
                    const total = context.chart._metasets[0].total || 100;
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
            {/* Biểu đồ tròn với kích thước nhỏ */}
            <Pie data={data} options={options} />
        </div>
    );
};

export default ProgressPieChart;
