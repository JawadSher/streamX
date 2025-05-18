import { getUserProfile } from "@/app/actions/user-actions/getUserProfile.action";
import UserProfileDataFetcher from "@/context/UserProfileDataFetcher";

async function Layout({ children }: { children: React.ReactNode }) {
  const response = await getUserProfile();

  return (
    <div>
      <UserProfileDataFetcher userProfileData={response.data} />
      {children}
    </div>
  );
}

export default Layout;
