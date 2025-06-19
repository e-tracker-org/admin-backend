import { Bar } from 'react-chartjs-2';

export default function UserGrowthChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Landlords',
        data: [45, 62, 78, 93, 107, 125],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
      {
        label: 'New Tenants',
        data: [120, 145, 182, 210, 245, 280],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-4">User Growth</h3>
      <Bar data={data} options={options} />
    </div>
  );
}