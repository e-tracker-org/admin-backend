import { FiCheckCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';

export default function SystemHealth() {
  const healthMetrics = [
    { name: 'API Response Time', value: '142ms', status: 'good', icon: <FiCheckCircle className="text-green-500" /> },
    { name: 'Database Load', value: '32%', status: 'normal', icon: <FiCheckCircle className="text-green-500" /> },
    { name: 'Active Sessions', value: '1,842', status: 'normal', icon: <FiInfo className="text-blue-500" /> },
    { name: 'Error Rate', value: '0.12%', status: 'warning', icon: <FiAlertTriangle className="text-yellow-500" /> }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-4">System Health</h3>
      <div className="space-y-3">
        {healthMetrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-3">{metric.icon}</span>
              <span>{metric.name}</span>
            </div>
            <span className="font-medium">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}