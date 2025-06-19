// @ts-nocheck
import { useState, useEffect } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";
import ReportCard from "../../components/reports/ReportCard";
import { FiDollarSign, FiHome, FiTrendingUp, FiUsers } from "react-icons/fi";
import { exportToExcel, exportToPDF } from "../../utils/exportUtils";
import { fetchAndFilterUsersByAccountType, fetchAllUsers } from "../../services/user";
import { getAllGeneralProperties } from "../../services/properties";
import { API_URL } from "../../config/config";
import RecentUsers from "../../components/ecommerce/RecentUsers";
import Loading from "../../components/elements/Loading";


interface UserData {
  createdAt: string;
  // other user properties
}

interface PropertyData {
  createdAt: string;
  // other property properties
}

interface PaymentData {
  amount: number;
  createdAt: string;
  status: string;
  // other payment properties
}


export default function Home() {
  const [dateRange, setDateRange] = useState("custom"); // 'month', 'quarter', 'year', 'custom'
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any[]>([]);
  const [tenantData, setTenantData] = useState<UserData[]>([]);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [allData, setAllData] = useState<{
    tenants: UserData[];
    properties: PropertyData[];
    users: UserData[];
    payments: PaymentData[];
  }>({ tenants: [], properties: [], users: [], payments: [] });

  // First fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [tenants, allProperties, allUsers, paymentResponse] = await Promise.all([
          fetchAndFilterUsersByAccountType(),
          getAllGeneralProperties(),
          fetchAllUsers(),
          fetch(`${API_URL}/payment/transactions`).then(res => res.json())
        ]);
        
        setAllData({
          tenants,
          properties: allProperties,
          users: allUsers,
          payments: paymentResponse.data || []
        });
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [tenants, allProperties, allUsers, paymentResponse] = await Promise.all([
          fetchAndFilterUsersByAccountType(),
          getAllGeneralProperties(),
          fetchAllUsers(),
          fetch(`${API_URL}/payment/transactions`).then(res => res.json())
        ]);
        
        setAllData({
          tenants,
          properties: allProperties,
          users: allUsers,
          payments: paymentResponse.data || []
        });
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    if (!allData.users.length) return; // Don't process if no data yet

    const filterDataByDateRange = (data: any[], dateKey: string = 'createdAt') => {
      const now = new Date();
      const cutoffDate = new Date();

      switch(dateRange) {
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'custom':
          // For custom range, you would need to implement a date picker
          // For now, just return all data
          return data;
        default:
          cutoffDate.setMonth(now.getMonth() - 1);
      }

      return data.filter(item => {
        const itemDate = new Date(item[dateKey]);
        return itemDate >= cutoffDate;
      });
    };

    // Filter all data sets based on date range
    const filteredTenants = filterDataByDateRange(allData.tenants);
    const filteredProperties = filterDataByDateRange(allData.properties);
    const filteredUsers = filterDataByDateRange(allData.users);
    const filteredPayments = filterDataByDateRange(allData.payments);

    setTenantData(filteredTenants);
    setProperties(filteredProperties);
    setUsers(filteredUsers);
    setPayments(filteredPayments);

    // Process the filtered data for reports
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Helper function to group filtered data by month
    const groupByMonth = (data: any[], dateKey: string = 'createdAt', valueKey: string = 'count') => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const result = Array(12).fill(0).map((_, i) => ({
        month: months[i],
        count: 0,
        amount: 0,
        rate: 0
      }));
      
      data.forEach(item => {
        const date = new Date(item[dateKey]);
        const month = date.getMonth();
        if (date.getFullYear() === currentYear) {
          if (valueKey === 'amount') {
            result[month].amount += item.amount;
          } else {
            result[month].count += 1;
          }
        }
      });
      
      // For ranges longer than month, show all months in range
      if (dateRange === 'quarter') {
        return result.slice(Math.max(0, currentMonth - 2), currentMonth + 1);
      } else if (dateRange === 'year') {
        return result;
      }
      return result.slice(currentMonth, currentMonth + 1);
    };

    // Calculate monthly data with filtered data
    const userMonthlyData = groupByMonth(filteredUsers);
    const propertyMonthlyData = groupByMonth(filteredProperties);
    const paymentMonthlyData = groupByMonth(filteredPayments, 'createdAt', 'amount');
    
    // Filter successful payments
    const successfulPayments = filteredPayments.filter((p: PaymentData) => p.status === 'success');
    const totalPaymentsAmount = successfulPayments.reduce((sum: number, payment: PaymentData) => sum + payment.amount, 0) / 100;
    
    // Calculate occupancy rate with filtered data
    const totalProperties = filteredProperties.length;
    const occupiedProperties = filteredTenants.length;
    const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;
    
    // Calculate changes based on filtered data
    const userChange = calculatePercentageChange(filteredUsers, allData.users);
    const propertyChange = calculatePercentageChange(filteredProperties, allData.properties);
    const paymentChange = calculatePercentageChange(
      successfulPayments, 
      allData.payments.filter((p: PaymentData) => p.status === 'success'),
      'amount'
    );

    // Update report data
    setReportData([
      { 
        title: "Total Users", 
        value: filteredUsers.length.toLocaleString(), 
        change: `${userChange >= 0 ? '+' : ''}${userChange}%`, 
        icon: FiUsers,
        data: userMonthlyData
      },
      { 
        title: "Total Properties", 
        value: filteredProperties.length.toLocaleString(), 
        change: `${propertyChange >= 0 ? '+' : ''}${propertyChange}%`, 
        icon: FiHome,
        data: propertyMonthlyData
      },
      { 
        title: "Total Payments", 
        value: `₦${totalPaymentsAmount.toLocaleString()}`, 
        change: `${paymentChange >= 0 ? '+' : ''}${paymentChange}%`, 
        icon: FiDollarSign,
        data: paymentMonthlyData
      },
      { 
        title: "Occupancy Rate", 
        value: `${occupancyRate}%`, 
        change: "+0%", // You would need historical data to calculate this properly
        icon: FiTrendingUp,
        data: [] // You would need to create monthly occupancy data
      }
    ]);

  }, [dateRange, allData]);

  const calculatePercentageChange = (
    filteredData: any[], 
    allData: any[], 
    valueKey: string = 'count'
  ) => {
    if (allData.length === 0) return 0;
    
    const filteredValue = valueKey === 'amount' 
      ? filteredData.reduce((sum, item) => sum + item.amount, 0)
      : filteredData.length;
      
    const totalValue = valueKey === 'amount'
      ? allData.reduce((sum, item) => sum + item.amount, 0)
      : allData.length;
      
    const previousValue = totalValue - filteredValue;
    
    if (previousValue === 0) return 0;
    
    return Math.round(((filteredValue - previousValue) / previousValue) * 100);
  };

  const handleExport = (type: string, data: any[], title: string) => {
    if (type === 'excel') {
      exportToExcel(data, title);
    } else {
      exportToPDF(data, title);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <PageMeta
        title="Property Management Dashboard"
        description="Overview of your property management platform"
      />
      
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Report Statistics Section */}
        <div className="col-span-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h2>
            <div className="mt-4 md:mt-0">
              <select
                className="border text-gray-800 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">View All</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportData.map((report, index) => (
              <ReportCard 
                key={index}
                title={report.title} 
                value={report.value} 
                change={report.change} 
                icon={report.icon} 
                onDownloadExcel={() => handleExport('excel', report.data, report.title)}
                onDownloadPDF={() => handleExport('pdf', report.data, report.title)}
              />
            ))}
          </div>
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics 
            tenantData={tenantData}
            propertyData={properties}
            userData={users}
            paymentData={payments}
          />
          <MonthlySalesChart 
            paymentData={payments.filter(p => p.status === 'success')}
          />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget 
            occupancyRate={parseInt(reportData[3]?.value || "0")}
            paymentData={payments}
          />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <RecentUsers 
          // @ts-ignore
            users={users} 
          />
        </div>
      </div>
    </>
  );
}