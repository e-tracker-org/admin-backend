import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UserList from "../../components/users/UserList";
import UserProfile from "../../components/users/UserProfile";
import { fetchAllUsers } from "../../services/user";
import Loading from "../../components/elements/Loading";

const dummyUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    role: "tenant",
    status: "active",
    kycStatus: "verified",
    kycDocuments: [
      { type: "ID Proof", url: "#" },
      { type: "Address Proof", url: "#" }
    ],
    lease: {
      propertyName: "Sunshine Apartments - Unit 101",
      rentAmount: 1200,
      startDate: "2023-01-01",
      endDate: "2023-12-31"
    }
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    role: "landlord",
    status: "active",
    kycStatus: "pending",
    kycDocuments: [
      { type: "ID Proof", url: "#" },
      { type: "Property Deed", url: "#" }
    ],
    properties: [
      { id: 1, name: "Sunshine Apartments", address: "123 Main St, Anytown" },
      { id: 2, name: "Mountain View Villa", address: "456 Oak Ave, Somewhere" }
    ]
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "555-123-4567",
    role: "tenant",
    status: "suspended",
    kycStatus: "none",
    lease: null
  }
];


export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  
  useEffect(() => {
      setLoading(true);
      async function fetchData() {
          const users = await fetchAllUsers();
          // const allTenantDefault = await getAllTenantDefault();
          setUsers(users);
          // setAllDefault(allTenantDefault);
          setLoading(false);
      }
  
      fetchData();
  }, []);

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  if (loading){
    return <Loading/>;
  }

  return (
    <div>
      <PageMeta
        title="User Management | Property Management Platform"
        description="Manage tenants and landlords in the property management system"
      />
      <PageBreadcrumb pageTitle={selectedUser ? "User Profile" : "User Management"} />

      <div>
        {selectedUser ? (
          <UserProfile 
            user={selectedUser} 
            onBack={() => setSelectedUser(null)} 
          />
        ) : (
          <UserList 
            users={users} 
            onUserClick={setSelectedUser} 
            onStatusChange={handleStatusChange} 
          />
        )}
      </div>
    </div>
  );
}