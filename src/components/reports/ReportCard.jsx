import { useState } from "react";
import { FiUsers, FiHome, FiDollarSign, FiTrendingUp, FiDownload, FiFileText, FiFile } from "react-icons/fi";

export default function ReportCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  onDownloadPDF, 
  onDownloadExcel 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6 relative">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mt-1">{value}</h3>
          {change && (
            <p className={`text-sm mt-2 flex items-center ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Icon size={20} />
        </div>
      </div>
      
      {(onDownloadPDF || onDownloadExcel) && (
        <div className="mt-4 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FiDownload className="mr-1" /> Download Report
          </button>
          
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-700 z-10">
              <div className="py-1">
                {onDownloadExcel && (
                  <button
                    disabled
                    onClick={() => {
                      onDownloadExcel();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <FiFile className="mr-2" /> Export as Excel
                  </button>
                )}
                {onDownloadPDF && (
                  <button
                  disabled
                    onClick={() => {
                      onDownloadPDF();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    <FiFileText className="mr-2" /> Export as PDF
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}