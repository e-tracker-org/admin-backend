import { useState } from "react";
import { 
  FiSearch, 
  FiUser, 
  FiUserCheck, 
  FiUserX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiHome, 
  FiUsers, 
  FiCheckCircle, 
  FiXCircle,
  FiPlus,
  FiRefreshCw
} from "react-icons/fi";

export default function UserList({ 
  users, 
  onUserClick, 
  onStatusChange, 
  onAddUser,
  onRefresh 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  // Calculate statistics
  const stats = {
    totalUsers: users.length,
    landlords: users.filter(user => user.currentKyc?.accountType === 2).length,
    tenants: users.filter(user => user.currentKyc?.accountType === 1).length,
    active: users.filter(user => user.subscriptionStatus === 'active').length,
    inactive: users.filter(user => user.subscriptionStatus !== 'active').length,
    verified: users.filter(user => user.currentKyc?.status === 'COMPLETE').length,
    incomplete: users.filter(user => !user.currentKyc || user.currentKyc.status !== 'COMPLETE').length
  };

  const filteredUsers = users.filter((user) => {
    const name = `${user.firstname} ${user.lastname}`;
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const role = user.currentKyc?.accountType === 1 ? 'tenant' : 
                user.currentKyc?.accountType === 2 ? 'landlord' : 'incomplete';
    
    const status = user.subscriptionStatus === 'active' ? 'active' : 'inactive';
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'tenant' && role === 'tenant') ||
                         (filter === 'landlord' && role === 'landlord') ||
                         (filter === 'active' && status === 'active') ||
                         (filter === 'inactive' && status === 'inactive');
    
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Users Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Users</p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-white">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800/30">
              <FiUsers className="text-blue-600 dark:text-blue-300" size={20} />
            </div>
          </div>
        </div>

        {/* Landlords Card */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Landlords</p>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-white">{stats.landlords}</h3>
              <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                {Math.round((stats.landlords / stats.totalUsers) * 100)}% of total
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800/30">
              <FiHome className="text-purple-600 dark:text-purple-300" size={20} />
            </div>
          </div>
        </div>

        {/* Tenants Card */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Tenants</p>
              <h3 className="text-2xl font-bold text-green-900 dark:text-white">{stats.tenants}</h3>
              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                {Math.round((stats.tenants / stats.totalUsers) * 100)}% of total
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800/30">
              <FiUser className="text-green-600 dark:text-green-300" size={20} />
            </div>
          </div>
        </div>

        {/* Active Accounts Card */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Active Accounts</p>
              <h3 className="text-2xl font-bold text-indigo-900 dark:text-white">{stats.active}</h3>
              <div className="flex items-center mt-1">
                <span className="text-xs text-indigo-600 dark:text-indigo-300">
                  {stats.verified} verified
                </span>
                <span className="mx-1">•</span>
                <span className="text-xs text-indigo-600 dark:text-indigo-300">
                  {stats.incomplete} incomplete
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-800/30">
              <FiCheckCircle className="text-indigo-600 dark:text-indigo-300" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">User Management</h2>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 text-black dark:text-white py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <select
            className="border text-black dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Users</option>
            <option value="tenant">Tenants</option>
            <option value="landlord">Landlords</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={onRefresh}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            title="Refresh"
          >
            <FiRefreshCw className="text-gray-700 dark:text-gray-300" />
          </button>
          <button
            onClick={onAddUser}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Users per page selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Show</span>
          <select
            className="text-gray-800 dark:text-white border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={usersPerPage}
            onChange={handleUsersPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">entries</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="border-b border-gray-100 dark:border-white/[0.05]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => {
                const name = `${user.firstname} ${user.lastname}`;
                const role = user.currentKyc?.accountType === 1 ? 'tenant' : 
                            user.currentKyc?.accountType === 2 ? 'landlord' : 'incomplete';
                const status = user.subscriptionStatus === 'active' ? 'active' : 'inactive';
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => onUserClick(user)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profileImage ? (
                            <img className="h-10 w-10 rounded-full" src={user.profileImage} alt={name} />
                          ) : (
                            <FiUser className="h-10 w-10 rounded-full bg-gray-200 p-2 text-gray-600" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-300">{user.state || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{user.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        role === 'landlord' ? 'bg-purple-100 text-purple-800' : 
                        role === 'tenant' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(user.id, status === 'active' ? 'inactive' : 'active');
                        }}
                        className={`mr-2 ${status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                      >
                        {status === 'active' ? <FiUserX size={18} /> : <FiUserCheck size={18} />}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-500 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <FiChevronLeft size={18} />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => paginate(totalPages)}
                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  currentPage === totalPages
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}