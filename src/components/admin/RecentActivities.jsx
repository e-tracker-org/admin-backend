export default function RecentActivities() {
  const activities = [
    { id: 1, user: 'admin@example.com', action: 'Approved landlord verification', timestamp: '2023-06-15 14:32' },
    { id: 2, user: 'system', action: 'Performed nightly backup', timestamp: '2023-06-15 03:15' },
    { id: 3, user: 'support@example.com', action: 'Resolved ticket #1254', timestamp: '2023-06-14 18:42' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mt-6">
      <h3 className="font-semibold text-lg mb-4">Recent Activities</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-l-2 border-blue-500 pl-3 py-1">
            <p className="font-medium">{activity.action}</p>
            <p className="text-sm text-gray-500">
              By {activity.user} • {activity.timestamp}
            </p>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-blue-500 hover:text-blue-700">View All</button>
    </div>
  );
}