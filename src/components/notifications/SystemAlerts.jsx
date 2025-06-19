import { FiAlertTriangle, FiInfo, FiCheckCircle } from "react-icons/fi";

export default function SystemAlerts({ alerts }) {
  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">System Alerts</h2>
      
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <div key={alert.id} className={`border-l-4 p-4 rounded ${
              alert.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
              alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
              'border-green-500 bg-green-50 dark:bg-green-900/20'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {alert.type === 'error' ? (
                    <FiAlertTriangle className="h-5 w-5 text-red-500" />
                  ) : alert.type === 'warning' ? (
                    <FiInfo className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <FiCheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    alert.type === 'error' ? 'text-red-800 dark:text-red-200' :
                    alert.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                    'text-green-800 dark:text-green-200'
                  }`}>
                    {alert.title}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    alert.type === 'error' ? 'text-red-700 dark:text-red-300' :
                    alert.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                    'text-green-700 dark:text-green-300'
                  }`}>
                    <p>{alert.message}</p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {alert.date}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 dark:text-gray-400">No system alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}