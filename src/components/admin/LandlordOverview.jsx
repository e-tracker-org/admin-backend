import { FiUser, FiStar, FiDollarSign, FiClock, FiHome } from 'react-icons/fi';

export default function LandlordOverview() {
  // Dummy landlord data
  const landlords = [
    { id: 1, name: 'Sarah Johnson', properties: 8, joined: '2022-03-15', rating: 4.8 },
    { id: 2, name: 'Michael Chen', properties: 12, joined: '2021-11-02', rating: 4.5 },
    { id: 3, name: 'David Wilson', properties: 5, joined: '2023-01-20', rating: 4.2 }
  ];

  const stats = [
    { title: "Total Landlords", value: "86", icon: <FiUser className="text-blue-500" /> },
    { title: "Avg Rating", value: "4.6", icon: <FiStar className="text-yellow-500" /> },
    { title: "Avg Properties", value: "7.2", icon: <FiHome className="text-green-500" /> },
    { title: "New This Month", value: "12", icon: <FiClock className="text-purple-500" /> }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold text-lg mb-4">Landlord Overview</h3>
      
      {/* Landlord Stats */}
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

      {/* Top Landlords */}
      <div>
        <h4 className="font-medium mb-3">Top Landlords</h4>
        <div className="space-y-3">
          {landlords.map(landlord => (
            <div key={landlord.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium">{landlord.name}</p>
                <p className="text-sm text-gray-500">{landlord.properties} properties</p>
              </div>
              <div className="flex items-center">
                <FiStar className="text-yellow-500 mr-1" />
                <span>{landlord.rating}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 text-sm text-blue-500 hover:text-blue-700">View All Landlords</button>
      </div>
    </div>
  );
}