// @ts-nocheck
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { useState } from "react";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  currentKyc?: {
    accountType: number; // 1 = tenant, 2 = landlord
  };
  subscriptionStatus: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

interface RecentUsersProps {
  users: User[];
}

export default function RecentUsers({ users }: RecentUsersProps) {
  const [showAll, setShowAll] = useState(false);

  // Map account type number to display text and badge color
  const getAccountType = (accountType: number | undefined) => {
    switch(accountType) {
      case 1: return { text: 'Tenant', color: 'warning' };
      case 2: return { text: 'Landlord', color: 'success' };
      default: return { text: 'Incomplete', color: 'error' };
    }
  };

  // Map subscription status to display text and badge color
  const getStatus = (status: string) => {
    switch(status) {
      case 'active': return { text: 'Active', color: 'success' };
      case 'pending': return { text: 'Pending', color: 'warning' };
      default: return { text: 'Inactive', color: 'error' };
    }
  };

  // Sort users by most recent first and limit to 5 unless showAll is true
  const displayedUsers = [...users]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, showAll ? users.length : 5);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Users
          </h3>
        </div>

        <div className="flex items-center gap-3">

          <button 
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            {showAll ? 'Show Less' : 'See All'}
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Email
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Type
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {displayedUsers.length > 0 ? (
              displayedUsers.map((user) => {
                const name = `${user.firstname} ${user.lastname}`;
                const accountType = getAccountType(user.currentKyc?.accountType);
                const status = getStatus(user.subscriptionStatus);

                return (
                  <TableRow key={user.id}>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                          <span className="font-semibold text-gray-700 dark:text-white text-lg">
                            {user.firstname[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {user.email}
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={accountType.color}>
                        {accountType.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={status.color}>
                        {status.text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-6 text-center text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}