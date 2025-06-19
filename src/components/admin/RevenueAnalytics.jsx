import { Line } from 'react-chartjs-2';

export default function RevenueAnalytics() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Subscription Revenue',
        data: [12500, 15000, 18200, 21000, 24500, 28000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Transaction Fees',
        data: [8500, 9200, 10200, 11500, 12800, 14200],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mt-6">
      <h3 className="font-semibold text-lg mb-4">Revenue Analytics</h3>
      <Line data={data} options={options} />
    </div>
  );
}