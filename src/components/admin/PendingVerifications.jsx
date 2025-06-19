export default function PendingVerifications() {
  const verifications = [
    { id: 1, type: 'Landlord', name: 'Sarah Johnson', submitted: '2023-06-15', status: 'pending' },
    { id: 2, type: 'Property', name: '123 Main St', submitted: '2023-06-14', status: 'pending' },
    { id: 3, type: 'Tenant', name: 'Michael Brown', submitted: '2023-06-13', status: 'pending' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 mt-6">
      <h3 className="font-semibold text-lg mb-4">Pending Verifications</h3>
      <div className="space-y-3">
        {verifications.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.type} • {item.submitted}</p>
            </div>
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
          </div>
        ))}
      </div>
      <button className="mt-4 text-sm text-blue-500 hover:text-blue-700">View All</button>
    </div>
  );
}