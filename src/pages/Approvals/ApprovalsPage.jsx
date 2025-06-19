import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ApprovalsList from "../../components/approvals/ApprovalsList";
import axios from "axios";
import { API_URL, USER_TOKEN } from "../../config/config";
import Loading from "../../components/elements/Loading";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const [verificationRes, tenantsRes] = await Promise.all([
          axios.get(`${API_URL}/approvals/verification-requests`, {
            headers: {
              Authorization: `Bearer ${USER_TOKEN}`,
            },
          }),
          axios.get(`${API_URL}/approvals/default-tenants`, {
            headers: {
              Authorization: `Bearer ${USER_TOKEN}`,
            }
          })
        ]);

        // Format verification requests
        const formattedVerifications = verificationRes.data.map(item => ({
          id: item._id,
          type: 'verification',
          name: `${item.firstName} ${item.lastName}`,
          description: `NIN: ${item.nin} | Email: ${item.userEmail}`,
          submittedDate: new Date(item.createdAt).toLocaleDateString(),
          status: item.status,
          requestType: 'verification',
          originalData: item
        }));

        // Format default tenants
        const formattedTenants = tenantsRes.data.map(item => ({
          id: item.id,
          type: 'tenant',
          name: item.tenantEmail, // Using email as name since name isn't in the data
          description: `Property: ${item.propertyAddress} | Complaints: ${item.complaints}`,
          submittedDate: new Date(item.createdAt).toLocaleDateString(),
          status: item.status,
          requestType: 'tenant',
          originalData: item
        }));

        setApprovals([...formattedVerifications, ...formattedTenants]);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const handleApprove = async (id, requestType) => {
    try {
      await axios.put(
        `${API_URL}/approvals/approve/${requestType}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
          },
        }
      );
      setApprovals(approvals.map(approval =>
        approval.id === id ? { ...approval, status: "approved" } : approval
      ));
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleReject = async (id, requestType) => {
    try {
      await axios.put(
        `${API_URL}/approvals/reject/${requestType}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${USER_TOKEN}`,
          },
        }
      );
      setApprovals(approvals.map(approval =>
        approval.id === id ? { ...approval, status: "rejected" } : approval
      ));
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  if (loading) return <Loading/>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <PageMeta
        title="Approvals | Property Management Platform"
        description="Manage pending approvals in the property management system"
      />
      <PageBreadcrumb pageTitle="Approvals" />

      <div className="p-4">
        <ApprovalsList 
          approvals={approvals} 
          onApprove={(id, requestType) => handleApprove(id, requestType)}
          onReject={(id, requestType) => handleReject(id, requestType)}
        />
      </div>
    </div>
  );
}