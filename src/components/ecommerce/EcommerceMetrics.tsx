// @ts-nocheck
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChatIcon,
  UserIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";

interface EcommerceMetricsProps {
  tenantData: any[];
  propertyData: any[];
  userData: any[];
  paymentData: any[];
}

export default function EcommerceMetrics({
  tenantData,
  propertyData,
  userData,
  paymentData
}: EcommerceMetricsProps) {
  // Calculate user metrics
  // const totalCustomers = userData.length;
  const totalTenants = tenantData.length;
  const totalLandlords = userData.filter(user => 
    user.currentKyc?.accountType === 2
  ).length;
  
  // Calculate payment metrics
  const successfulPayments = paymentData.filter(payment => payment.status === 'success');
  const successfulOrders = successfulPayments.length;
  const totalRevenue = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0) / 100; // Convert to Naira
  
  // Calculate percentage changes (you would replace these with real calculations)
  const tenantChange = 8.5; // Example - calculate based on previous period
  const landlordChange = 12.3; // Example
  const revenueChange = 15.7; // Example
  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 md:gap-6">

      {/* Tenants Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <UserIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tenants
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalTenants.toLocaleString()}
            </h4>
          </div>
          <Badge color={tenantChange >= 0 ? "success" : "error"}>
            {tenantChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(tenantChange).toFixed(1)}%
          </Badge>
        </div>
      </div>

      {/* Landlords Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <ChatIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Landlords
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalLandlords.toLocaleString()}
            </h4>
          </div>
          <Badge color={landlordChange >= 0 ? "success" : "error"}>
            {landlordChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(landlordChange).toFixed(1)}%
          </Badge>
        </div>
      </div>

      {/* Revenue Metric */}
      {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Revenue
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ₦{totalRevenue.toLocaleString()}
            </h4>
          </div>
          <Badge color={revenueChange >= 0 ? "success" : "error"}>
            {revenueChange >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(revenueChange).toFixed(1)}%
          </Badge>
        </div>
      </div> */}
    </div>
  );
}