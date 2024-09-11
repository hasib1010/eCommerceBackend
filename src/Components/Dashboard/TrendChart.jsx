import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TrendsChart = () => {
  const data = {
    labels: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
    datasets: [
      {
        label: 'Today',
        data: [10, 15, 38, 20, 25, 35, 30, 40],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        pointBackgroundColor: '#2563EB',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Yesterday',
        data: [20, 25, 28, 22, 15, 28, 25, 35],
        borderColor: '#D1D5DB',
        backgroundColor: 'rgba(209, 213, 219, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 15,
          color: '#6B7280',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
        },
        ticks: {
          color: '#6B7280',
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-10 h-[525px]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-900">Today's trends</span>
        <span className="text-sm text-gray-400">30 Sept 2021</span>
      </div>
      <div className="h-[425px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TrendsChart;
