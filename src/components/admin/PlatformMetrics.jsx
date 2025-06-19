import { FiAlertTriangle, FiInfo } from 'react-icons/fi';

export default function PlatformAlerts() {
  const alerts = [
    { id: 1, severity: 'high', message: 'Payment processor API experiencing delays', timestamp: '2023-06-15 09:42' },
    { id: 2, severity: 'medium', message: 'Scheduled maintenance tonight at 2AM', timestamp: '2023-06-14 16:30' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mt-6">
      <h3 className="font-semibold text-lg mb-4">Platform Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg flex items-start ${
            alert.severity === 'high' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'
          }`}>
            {alert.severity === 'high' ? (
              <FiAlertTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            ) : (
              <FiInfo className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">{alert.message}</p>
              <p className="text-sm text-gray-500 mt-1">{alert.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}