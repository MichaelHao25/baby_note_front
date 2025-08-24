import { Outlet } from "react-router";
import { AsideNav } from "../../components/AsideNav";
import ErrorBoundary from "../../components/ErrorBoundary";
import HeaderNav from "../../components/HeaderNav";
import PermissionGuard from "../../components/PermissionGuard";

export const HomeLayout = () => {
    // const location = useLocation()
    // const navigate = useNavigate();
    // useEffect(() => {
    //     console.log('location.pathname', location.pathname);

    //     if (location.pathname === '/') {
    //         navigate('/HomePage')
    //     }
    // }, [location.pathname])
    return (
        <PermissionGuard>
            <div className="flex flex-row h-full">
                <AsideNav />
                <div className="flex-1">
                    <HeaderNav />
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </div>
            </div>
        </PermissionGuard>
    );
};
