// @ts-nocheck
import { useEffect, useState } from "react";
import {  Routes, Route } from "react-router-dom"; // ✅ FIXED

import SignIn from "./pages/AuthPages/SignIn";
// import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import UsersPage from "./pages/UsersPage/UsersPage";

import Properties from "./pages/Properties/PropertiesPage";
// Approvals
import ApprovalsPage from "./pages/Approvals/ApprovalsPage";
// Notifications
import NotificationsPage from "./pages/Notifications/NotificationsPage";
// Payments
import PaymentsPage from "./pages/Payments/PaymentsPage";
// Reports
// import ReportsPage from "./pages/Reports/ReportsPage";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentPath = window.location.pathname;

    // If no token and not on signin, redirect
    if (!token && currentPath !== "/signin") {
      window.location.href = "/signin";
      return;
    }

    // If token exists and you're on /signin, redirect to home
    if (token && currentPath === "/signin") {
      window.location.href = "/";
      return;
    }

    setReady(true); // Only show content once auth checks pass
  }, []);

  if (!ready) return null; // Don't render anything until auth check completes

  return (
    <>
      {/* <Router> */}
        
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Users */}
            <Route path="/users" element={<UsersPage />} />

            {/* Properties */}
            <Route path="/properties" element={<Properties />} />

            {/* Approvals */}
            <Route path="/approvals" element={<ApprovalsPage />} />

            {/* Notifications */}
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* Payments */}
            <Route path="/payments" element={<PaymentsPage />} />

            {/* Reports */}
            {/* <Route path="/reports" element={<ReportsPage />} /> */}

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </>
  );
}
