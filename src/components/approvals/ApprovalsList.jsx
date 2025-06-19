import { useState } from "react";
import { 
  FiSearch, 
  FiUser, 
  FiHome, 
  FiCheck, 
  FiX,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiFileText,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";

export default function ApprovalsList({ approvals, onApprove, onReject }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'verification', 'tenant'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate statistics
  const stats = {
    totalRequests: approvals.length,
    verificationRequests: approvals.filter(a => a.type === 'verification').length,
    tenantRequests: approvals.filter(a => a.type === 'tenant').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
    pending: approvals.filter(a => a.status === 'pending').length
  };

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         approval.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || approval.type === filter;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalItems = filteredApprovals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApprovals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'verification':
        return <FiUser className="h-5 w-5 text-purple-500 mr-2" />;
      case 'tenant':
        return <FiUsers className="h-5 w-5 text-green-500 mr-2" />;
      default:
        return <FiFileText className="h-5 w-5 text-gray-500 mr-2" />;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'verification':
        return 'Verification';
      case 'tenant':
        return 'Default Tenant';
      default:
        return type;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Requests Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Requests</p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-white">{stats.totalRequests}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800/30">
              <FiFileText className="text-blue-600 dark:text-blue-300" size={20} />
            </div>
          </div>
        </div>

        {/* Verification Requests Card */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Verification Requests</p>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-white">{stats.verificationRequests}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800/30">
              <FiUser className="text-purple-600 dark:text-purple-300" size={20} />
            </div>
          </div>
        </div>

        {/* Tenant Requests Card */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Tenant Requests</p>
              <h3 className="text-2xl font-bold text-green-900 dark:text-white">{stats.tenantRequests}</h3>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800/30">
              <FiUsers className="text-green-600 dark:text-green-300" size={20} />
            </div>
          </div>
        </div>

        {/* Pending Requests Card */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Pending Approval</p>
              <h3 className="text-2xl font-bold text-yellow-900 dark:text-white">{stats.pending}</h3>
              <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                {stats.approved} approved • {stats.rejected} rejected
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-800/30">
              <FiClock className="text-yellow-600 dark:text-yellow-300" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {/* Pending Approvals ({filteredApprovals.length}) */}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search approvals..."
              className="pl-10 text-gray-500 dark:text-gray-300 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border text-gray-500 dark:text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Approvals</option>
            <option value="verification">Verification Requests</option>
            <option value="tenant">Default Tenants</option>
          </select>
        </div>
      </div>

      {/* Items per page selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Show</span>
          <select
            className="border text-gray-500 dark:text-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">entries</span>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} entries
        </div>
      </div>

      {/* Approvals Table */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentItems.length > 0 ? (
              currentItems.map((approval) => (
                <tr key={approval.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTypeIcon(approval.type)}
                      <span className="capitalize text-gray-500 dark:text-gray-300">{getTypeLabel(approval.type)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{approval.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">{approval.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {approval.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {approval.submittedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onApprove(approval.id, approval.requestType)}
                        className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-full"
                        title="Approve"
                      >
                        <FiCheck size={18} />
                      </button>
                      <button
                        onClick={() => onReject(approval.id, approval.requestType)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full"
                        title="Reject"
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No approvals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              <FiChevronLeft size={18} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
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