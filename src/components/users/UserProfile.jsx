import { useState, useEffect } from "react";
import { 
  FiArrowLeft, FiMail, FiPhone, FiHome, FiFileText, 
  FiCheckCircle, FiXCircle, FiUser, FiDownload, 
  FiClock, FiCheck, FiAlertCircle, FiEye,
  FiDollarSign, FiCreditCard, FiCalendar
} from "react-icons/fi";
import axios from "axios";
import { API_URL } from "../../config/config";
import Loading from "../elements/Loading";

export default function UserProfile({ user, onBack }) {
  const fullName = `${user.firstname} ${user.lastname}`;
  const role = user.currentKyc?.accountType === 1 ? 'tenant' : 
              user.currentKyc?.accountType === 2 ? 'landlord' : 'incomplete';
  const status = user.subscriptionStatus || 'inactive';
  const kycStatus = user.currentKyc?.status || 'NOT_SUBMITTED';
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [kyc, setKyc] = useState({});
  const [payments, setPayments] = useState(null);

  // Fetch KYC documents, KYC details, and payment information
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch KYC documents
        const docsResponse = await axios.get(`${API_URL}/docs/upload/allUserFiles/${user.id}`);
        const docs = Array.isArray(docsResponse.data) 
          ? docsResponse.data 
          : Array.isArray(docsResponse.data?.data) 
            ? docsResponse.data.data 
            : [];
        setDocuments(docs);

        // Fetch KYC details if available
        if (user.currentKyc?.kycId) {
          const kycRes = await axios.get(`${API_URL}/kyc/user/${user.currentKyc.kycId}`);
          setKyc(kycRes.data?.data || {});
        }

        // Fetch payment information
        const paymentsRes = await axios.get(`${API_URL}/payment/user/payments/${user.id}`);
        setPayments(paymentsRes.data || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchData();
    }
  }, [user.id, user.currentKyc?.kycId]);

  // Update KYC status
  const updateKycStatus = async (newStatus) => {
    if (!user.currentKyc?.kycId) return;
    
    try {
      setLoading(true);
      await axios.post(`${API_URL}/kyc/status/${newStatus}/${user.currentKyc.kycId}`);
      const updatedUser = { 
        ...user, 
        currentKyc: { 
          ...user.currentKyc, 
          status: newStatus === 'approve' ? 'COMPLETE' : 'REJECTED' 
        } 
      };
      onBack(updatedUser);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <FiCheckCircle className="text-green-500 mr-1" />;
      case 'REJECTED':
        return <FiXCircle className="text-red-500 mr-1" />;
      case 'SUBMITTED':
        return <FiClock className="text-yellow-500 mr-1" />;
      default:
        return <FiAlertCircle className="text-gray-500 mr-1" />;
    }
  };

  if (loading && !payments) {
    return <Loading />;
  }

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-6">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <FiArrowLeft className="mr-2" /> Back to Users
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - User Info */}
        <div className="w-full md:w-1/3">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex flex-col items-center">
            {user.profileImage ? (
              <img 
                src={user.profileImage} 
                alt={fullName}
                className="w-32 h-32 rounded-full object-cover mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                <FiUser className="text-4xl text-gray-600" />
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{fullName}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2 capitalize">{role}</p>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {status}
            </span>
          </div>

          {/* Subscription Information */}
          <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Subscription Information</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <FiDollarSign className="text-gray-500 mr-2" />
                <div>
                  <span className="text-gray-500 text-sm">Status:</span>
                  <span className={`ml-2 text-sm font-semibold ${payments?.subscription?.status === "active" ? "text-green-700" : "text-red-700"}`}>
                    {payments?.subscription?.status || "inactive"}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <FiCalendar className="text-gray-500 mr-2" />
                <div>
                  <span className="text-gray-500 text-sm">Start Date:</span>
                  <span className="ml-2 text-gray-800 dark:text-white">
                    {payments?.subscription?.start ? new Date(payments.subscription.start).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <FiCreditCard className="text-gray-500 mr-2" />
                <div>
                  <span className="text-gray-500 text-sm">Reference:</span>
                  <span className="ml-2 text-gray-800 dark:text-white break-all">
                    {payments?.subscription?.reference || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <FiMail className="text-gray-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-gray-500 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">{user.phone || 'Not provided'}</span>
              </div>
              {user.state && (
                <div className="flex items-center">
                  <FiHome className="text-gray-500 mr-3" />
                  <span className="text-gray-600 dark:text-gray-300">{user.state}, {user.country || 'Nigeria'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - KYC, Documents, and Payments */}
        <div className="w-full md:w-2/3">
          {/* KYC Status Section */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800 dark:text-white">KYC Information</h3>
              {user.currentKyc && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateKycStatus('approve')}
                    disabled={loading || kycStatus === 'COMPLETE'}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      kycStatus === 'COMPLETE' 
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => updateKycStatus('reject')}
                    disabled={loading || kycStatus === 'REJECTED'}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      kycStatus === 'REJECTED'
                        ? 'bg-red-100 text-red-800 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {loading ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>

            {/* KYC Details from API */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  <span className="text-gray-500 text-sm">KYC Status:</span>
                  <span className="ml-2 text-gray-800 dark:text-white font-semibold">{kyc.status || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Account Type:</span>
                  <span className="ml-2 text-gray-800 dark:text-white">
                    {kyc.accountType === 1 ? "Tenant" : kyc.accountType === 2 ? "Landlord" : "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Filled Stages:</span>
                  <span className="ml-2 text-gray-800 dark:text-white">{Array.isArray(kyc.filledStages) ? kyc.filledStages.join(", ") : "N/A"}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Payment History Section */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Payment History</h3>
            
            {payments?.verificationRequests?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead className="bg-gray-50 dark:bg-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Payment Reference</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {payments.verificationRequests.map((payment) => (
                      <tr key={payment._id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {payment.paymentReference}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          Verification
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {payment.email}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">No payment history found</p>
            )}
          </div>

          {/* Documents Section */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-800 dark:text-white">Documents</h3>
            <button
              onClick={() => setShowDocuments((prev) => !prev)}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
            >
              <FiEye className="mr-1" />
              {showDocuments ? "Hide Documents" : "View Documents"}
            </button>
          </div>

          {showDocuments && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              {loading && !documents.length ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : documents.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No documents submitted</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {documents.flatMap((doc) =>
                    (doc.urls || []).map((url, index) => (
                      <div
                        key={doc.id + "-" + index}
                        className="border rounded-md overflow-hidden cursor-pointer group flex flex-col items-center p-2 bg-white dark:bg-gray-800"
                        onClick={() => window.open(url, "_blank")}
                        title="Click to view"
                      >
                        <div className="h-20 w-full flex items-center justify-center group-hover:opacity-80 transition-opacity">
                          {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                            <img
                              src={url}
                              alt={`Document ${index + 1}`}
                              className="h-16 w-16 object-contain"
                            />
                          ) : (
                            <FiFileText className="text-2xl text-gray-400" />
                          )}
                        </div>
                        <span className="text-xs truncate mt-2 text-gray-700 dark:text-gray-200 w-full text-center">
                          {doc.files?.[index] || `Document ${index + 1}`}
                        </span>
                        <span className="text-center text-xs text-blue-500 py-1 group-hover:underline">Click to view</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="font-medium text-gray-800 dark:text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-gray-800 dark:text-gray-200 capitalize">
                  {user.gender || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}