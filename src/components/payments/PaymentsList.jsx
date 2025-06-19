import { useState } from "react";
import { 
  FiSearch, 
  FiDollarSign, 
  FiDownload, 
  FiCheck, 
  FiRefreshCw, 
  FiChevronLeft, 
  FiChevronRight,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiClock
} from "react-icons/fi";

export default function PaymentsList({ payments, onConfirm, onReinitiate, onDownload }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate statistics
  const stats = {
    totalPayments: payments.length,
    successful: payments.filter(p => p.status === 'success').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed' || p.status === 'abandoned').length,
    totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
    averageAmount: payments.length > 0 
      ? payments.reduce((sum, p) => sum + (p.amount || 0), 0) / payments.length 
      : 0
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (payment.metadata?.searchTerm?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (payment.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filter === 'all' || 
                         (filter === 'pending' && payment.status === 'pending') ||
                         (filter === 'successful' && payment.status === 'success') ||
                         (filter === 'failed' && (payment.status === 'failed' || payment.status === 'abandoned'));
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalItems = filteredPayments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    return `₦${(amount / 100).toLocaleString()}`;
  };

  const formatLargeAmount = (amount) => {
    return `₦${(amount / 100).toLocaleString()}`;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Payments Card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Payments</p>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-white">{stats.totalPayments}</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800/30">
              <FiCreditCard className="text-blue-600 dark:text-blue-300" size={20} />
            </div>
          </div>
        </div>

        {/* Successful Payments Card */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">Successful</p>
              <h3 className="text-2xl font-bold text-green-900 dark:text-white">{stats.successful}</h3>
              <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                {stats.totalPayments > 0 ? Math.round((stats.successful / stats.totalPayments) * 100) : 0}% success rate
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800/30">
              <FiCheckCircle className="text-green-600 dark:text-green-300" size={20} />
            </div>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-100 dark:border-yellow-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Pending</p>
              <h3 className="text-2xl font-bold text-yellow-900 dark:text-white">{stats.pending}</h3>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-800/30">
              <FiClock className="text-yellow-600 dark:text-yellow-300" size={20} />
            </div>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Total Amount</p>
              <h3 className="text-2xl font-bold text-purple-900 dark:text-white">
                {formatLargeAmount(stats.totalAmount)}
              </h3>
              <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                Avg: {formatLargeAmount(stats.averageAmount)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800/30">
              <FiTrendingUp className="text-purple-600 dark:text-purple-300" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Payment Transactions</h2>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              className="text-gray-800 dark:text-white pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="text-gray-800 dark:text-white border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed/Abandoned</option>
          </select>
        </div>
      </div>

      {/* Items per page selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Show</span>
          <select
            className="text-gray-800 dark:text-white border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Payments Table */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentItems.length > 0 ? (
              currentItems.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{payment.reference}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{payment.customer?.email || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{payment.metadata?.purpose || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{formatAmount(payment.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {formatDate(payment.paid_at || payment.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'success' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {payment.status === 'pending' && (
                      <button
                        onClick={() => onConfirm(payment.id)}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Confirm Payment"
                      >
                        <FiCheck size={18} />
                      </button>
                    )}
                    {(payment.status === 'failed' || payment.status === 'abandoned') && (
                      <button
                        onClick={() => onReinitiate(payment.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Reinitiate Payment"
                      >
                        <FiRefreshCw size={18} />
                      </button>
                    )}
                    {payment.status === 'success' && (
                      <button
                        onClick={() => onDownload(payment.id)}
                        className="text-gray-600 dark dark:text-gray-200 hover:text-gray-900"
                        title="Download Receipt"
                      >
                        <FiDownload size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No payments found
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
                  className={`px-3 py-1 rounded-md ${currentPage === pageNumber ? 'bg-blue-600 text-white' : ' text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            
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