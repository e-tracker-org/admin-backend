import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const location = useLocation();

  useEffect(() => {
    const routeTitles: Record<string, string> = {
      "/": "Dashboard – eTracker Admin",
      "/users": "Users – eTracker Admin",
      "/properties": "Properties – eTracker Admin",
      "/approvals": "Approvals – eTracker Admin",
      "/payments": "Payments – eTracker Admin",
      "/profile": "My Profile – eTracker Admin",
    };

    document.title = routeTitles[location.pathname] || "eTracker Admin Panel";

    const updateMeta = (nameOrProp: string, content: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${nameOrProp}"]`
        : `meta[name="${nameOrProp}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        if (isProperty) {
          tag.setAttribute("property", nameOrProp);
        } else {
          tag.setAttribute("name", nameOrProp);
        }
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    updateMeta(
      "description",
      "eTracker is an admin platform for managing properties, users, approvals, and payment insights."
    );
    updateMeta("og:title", document.title, true);
    updateMeta("og:site_name", "eTracker", true);
    updateMeta("og:url", window.location.href, true);
    updateMeta("og:type", "website", true);
  }, [location.pathname]);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default function AppLayout() {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}