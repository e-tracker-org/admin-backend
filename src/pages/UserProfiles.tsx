// @ts-nocheck
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { getUser } from "../config/config";

export default function UserProfiles() {
  // User data from the provided object
  const userData = getUser();

  return (
    <>
      <PageMeta
        title={`${userData.fullName} | Profile`}
        description={`Profile page for ${userData.fullName}`}
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6">
          <UserMetaCard userData={userData} />
          <UserInfoCard userData={userData} />
          <UserAddressCard userData={userData} />
        </div>
      </div>
    </>
  );
}