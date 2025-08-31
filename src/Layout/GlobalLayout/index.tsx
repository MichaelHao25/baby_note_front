import { Outlet } from "react-router";
import ErrorBoundary from "../../components/ErrorBoundary";
import { GlobalToast } from "../../components/GlobalToast";
import PermissionGuard from "../../components/PermissionGuard";

export const GlobalLayout = () => {
  return (
    <PermissionGuard>
      {/* <div className="flex flex-row h-full"> */}
      {/* <AsideNav /> */}
      {/* <div className="flex-1"> */}
      {/* <HeaderNav /> */}
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
      {/* </div>
      </div> */}
      <GlobalToast />
    </PermissionGuard>
  );
};
