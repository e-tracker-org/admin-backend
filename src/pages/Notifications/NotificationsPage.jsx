import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import NotificationsList from "../../components/notifications/NotificationsList";
import SystemAlerts from "../../components/notifications/SystemAlerts";

const dummyNotifications = [
  {
    id: 1,
    type: "email",
    recipient: "john@example.com",
    subject: "Rent Payment Reminder",
    message: "This is a reminder that your rent payment of $1200 is due on May 1st.",
    date: "2023-04-25 10:30 AM"
  },
  {
    id: 2,
    type: "in-app",
    recipient: "jane@example.com",
    subject: "New Tenant Application",
    message: "John Doe has applied to rent your property Sunshine Apartments - Unit 101.",
    date: "2023-04-20 02:15 PM"
  },
  {
    id: 3,
    type: "email",
    recipient: "bob@example.com",
    subject: "Lease Agreement Signed",
    message: "Your lease agreement for Downtown Loft has been signed and is now active.",
    date: "2023-04-15 09:45 AM"
  }
];

const dummyAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Payment Processing Issue",
    message: "There was an issue processing payment PAY-2023-003. Please review.",
    date: "2023-04-10 11:20 AM"
  },
  {
    id: 2,
    type: "info",
    title: "New Landlord Registration",
    message: "A new landlord (Sarah Williams) has registered and requires KYC approval.",
    date: "2023-04-08 03:45 PM"
  },
  {
    id: 3,
    type: "error",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance will occur on April 5th from 2:00 AM to 4:00 AM.",
    date: "2023-04-01 08:00 AM"
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [alerts, setAlerts] = useState(dummyAlerts);

  const handleSendNotification = (newNotification) => {
    const notification = {
      id: notifications.length + 1,
      ...newNotification,
      date: new Date().toLocaleString()
    };
    setNotifications([notification, ...notifications]);
    // In a real app, you would also make an API call here
  };

  return (
    <div>
      <PageMeta
        title="Notifications | Property Management Platform"
        description="Manage notifications and system alerts in the property management system"
      />
      <PageBreadcrumb pageTitle="Notifications" />

      <div>

        {/* coming soon */}
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-900 dark:border-gray-100"></div>
        </div>
        <NotificationsList 
          notifications={notifications} 
          onSendNotification={handleSendNotification}
        />
        {/* <SystemAlerts alerts={alerts} /> */}
      </div>
    </div>
  );
}