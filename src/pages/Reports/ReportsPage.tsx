// @ts-nocheck
import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ReportCard from "../../components/reports/ReportCard";
import { FiDollarSign, FiHome, FiTrendingUp, FiUsers } from "react-icons/fi";
import { fetchAllUsers } from "../../services/user";
import { getAllGeneralProperties } from "../../services/properties";
import { API_URL } from "../../config/config";
import Loading from "../../components/elements/Loading";

interface ReportData {
  totalUsers: number;
  userChange: number;
  totalProperties: number;
  propertyChange: number;
  totalPayments: number;
  paymentChange: number;
  occupancyRate: number;
  occupancyChange: number;
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("month"); // 'month', 'quarter', 'year', 'custom'
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData>({
    totalUsers: 0,
    userChange: 0,
    totalProperties: 0,
    propertyChange: 0,
    totalPayments: 0,
    paymentChange: 0,
    occupancyRate: 0,
    occupancyChange: 0
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [users, properties, payments] = await Promise.all([
          fetchAllUsers(),
          getAllGeneralProperties(),
          fetch(`${API_URL}/payment/transactions`).then(res => res.json())        
        ]);

        // Filter data based on date range
        const filteredUsers = filterByDateRange(users, dateRange);
        const filteredProperties = filterByDateRange(properties, dateRange);
        const filteredPayments = filterByDateRange(payments, dateRange);
        const successfulPayments = filteredPayments.filter(p => p.status === 'success');

        // Calculate metrics
        const totalUsers = filteredUsers.length;
        const totalProperties = filteredProperties.length;
        const totalPayments = successfulPayments.reduce((sum, p) => sum + p.amount, 0) / 100; // Convert to dollars
        const occupancyRate = calculateOccupancyRate(filteredProperties, filteredUsers);

        // Calculate changes (simplified - in a real app you'd compare with previous period)
        const userChange = 12.5; // Replace with actual calculation
        const propertyChange = 8.2; // Replace with actual calculation
        const paymentChange = 15.3; // Replace with actual calculation
        const occupancyChange = 3.1; // Replace with actual calculation

        setReportData({
          totalUsers,
          userChange,
          totalProperties,
          propertyChange,
          totalPayments,
          paymentChange,
          occupancyRate,
          occupancyChange
        });

      } catch (error) {
        console.error("Failed to fetch report data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [dateRange]);

  const filterByDateRange = (data: any[], range: string) => {
    const now = new Date();
    const cutoffDate = new Date();

    switch(range) {
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data; // 'custom' or invalid - return all data
    }

    return data.filter(item => {
      const itemDate = new Date(item.createdAt || item.paymentDate);
      return itemDate >= cutoffDate;
    });
  };

  const calculateOccupancyRate = (properties: any[], users: any[]) => {
    // Simplified calculation - adjust based on your business logic
    const occupiedProperties = users.filter(u => u.accountType === 'tenant').length;
    const totalAvailableProperties = properties.length;
    return totalAvailableProperties > 0 
      ? Math.round((occupiedProperties / totalAvailableProperties) * 100)
      : 0;
  };

  const handleDownloadReport = (reportType: string) => {
    alert(`Downloading ${reportType} report for ${dateRange}`);
    // In a real app, you would generate or fetch a report here
  };

  if (loading) {
    return (
        <Loading />
    );
  }

  return (
    <div>
      <PageMeta
        title="Reports | Property Management Platform"
        description="View and download system reports"
      />
      <PageBreadcrumb pageTitle="Reports" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Performance Reports</h2>
          <div className="mt-4 md:mt-0">
            <select
              className="border text-gray-800 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ReportCard 
            title="Total Users" 
            value={reportData.totalUsers.toLocaleString()} 
            change={`${reportData.userChange >= 0 ? '+' : ''}${reportData.userChange}%`} 
            icon={FiUsers} 
            onDownload={() => handleDownloadReport("users")}
          />
          <ReportCard 
            title="Total Properties" 
            value={reportData.totalProperties.toLocaleString()} 
            change={`${reportData.propertyChange >= 0 ? '+' : ''}${reportData.propertyChange}%`} 
            icon={FiHome} 
            onDownload={() => handleDownloadReport("properties")}
          />
          <ReportCard 
            title="Total Payments" 
            value={`$${reportData.totalPayments.toLocaleString()}`} 
            change={`${reportData.paymentChange >= 0 ? '+' : ''}${reportData.paymentChange}%`} 
            icon={FiDollarSign} 
            onDownload={() => handleDownloadReport("payments")}
          />
          <ReportCard 
            title="Occupancy Rate" 
            value={`${reportData.occupancyRate}%`} 
            change={`${reportData.occupancyChange >= 0 ? '+' : ''}${reportData.occupancyChange}%`} 
            icon={FiTrendingUp} 
            onDownload={() => handleDownloadReport("occupancy")}
          />
        </div>

        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Generate Custom Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => handleDownloadReport("user_activity")}
            >
              <div className="flex items-center">
                <FiUsers className="text-blue-500 mr-3" size={24} />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">User Activity</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reportData.totalUsers} users in selected period
                  </p>
                </div>
              </div>
            </div>
            <div 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => handleDownloadReport("payment_history")}
            >
              <div className="flex items-center">
                <FiDollarSign className="text-green-500 mr-3" size={24} />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Payment History</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ${reportData.totalPayments.toLocaleString()} total revenue
                  </p>
                </div>
              </div>
            </div>
            <div 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => handleDownloadReport("property_performance")}
            >
              <div className="flex items-center">
                <FiHome className="text-purple-500 mr-3" size={24} />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Property Performance</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {reportData.occupancyRate}% occupancy rate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}