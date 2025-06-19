import { FiHome, FiDollarSign, FiMapPin, FiCheckCircle } from 'react-icons/fi';

export default function PropertyOverview() {
  // Dummy property data
  const properties = [
    { id: 1, address: '123 Main St', units: 12, occupied: 9, rent: 2500 },
    { id: 2, address: '456 Oak Ave', units: 8, occupied: 7, rent: 3200 },
    { id: 3, address: '789 Pine Rd', units: 24, occupied: 18, rent: 1800 }
  ];

  const stats = [
    { title: "Total Properties", value: "142", icon: <FiHome className="text-blue-500" /> },
    { title: "Occupancy Rate", value: "87%", icon: <FiCheckCircle className="text-green-500" /> },
    { title: "Avg Monthly Rent", value: "$2,450", icon: <FiDollarSign className="text-purple-500" /> },
    { title: "Cities Covered", value: "18", icon: <FiMapPin className="text-red-500" /> }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-4">Property Overview</h3>
      
      {/* Property Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="mr-3 p-2 rounded-full bg-white dark:bg-gray-600">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-300">{stat.title}</p>
              <p className="font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Properties */}
      <div>
        <h4 className="font-medium mb-3">Recent Properties</h4>
        <div className="space-y-3">
          {properties.map(property => (
            <div key={property.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">{property.address}</p>
                <p className="text-sm text-gray-500">{property.units} units ({property.occupied} occupied)</p>
              </div>
              <p className="font-semibold">${property.rent}/mo</p>
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm text-blue-500 hover:text-blue-700">View All Properties</button>
      </div>
    </div>
  );
}