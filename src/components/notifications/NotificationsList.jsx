import { useState } from "react";
import { FiSearch, FiMail, FiBell, FiSend } from "react-icons/fi";

export default function NotificationsList({ notifications, onSendNotification }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [newNotification, setNewNotification] = useState({
    type: "email",
    recipient: "",
    subject: "",
    message: ""
  });
  const [showForm, setShowForm] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    return notification.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendNotification(newNotification);
    setNewNotification({
      type: "email",
      recipient: "",
      subject: "",
      message: ""
    });
    setShowForm(false);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white"></h2>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="pl-10 dark:text-white pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FiSend className="mr-2" />
            New Notification
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Send New Notification</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  name="type"
                  value={newNotification.type}
                  onChange={handleInputChange}
                  className="w-full dark:text-white border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  {/* <option value="in-app">In-App Notification</option> */}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient</label>
                <input
                  type="text"
                  name="recipient"
                  value={newNotification.recipient}
                  onChange={handleInputChange}
                  placeholder="Email or User ID"
                  className="w-full dark:text-white border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                value={newNotification.subject}
                onChange={handleInputChange}
                placeholder="Notification subject"
                className="w-full dark:text-white border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                name="message"
                value={newNotification.message}
                onChange={handleInputChange}
                placeholder="Notification message"
                rows="4"
                className="w-full dark:text-white border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 dark:text-white border rounded-lg text-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Send Notification
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div key={notification.id} className="border dark:border-gray-500 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {notification.type === 'email' ? (
                    <FiMail className="h-5 w-5 text-blue-500" />
                  ) : (
                    <FiBell className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">{notification.subject}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notification.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      To: {notification.recipient}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {notification.date}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No notifications found</p>
          </div>
        )}
      </div>
    </div>
  );
}