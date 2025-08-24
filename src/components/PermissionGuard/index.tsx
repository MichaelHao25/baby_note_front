import React from "react";
import { Result, Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { RootState } from "../../store";
import { hasAnyPermission } from "../../utils/permissions";

interface IPermissionGuardProps {
    children: React.ReactNode;
}

/**
 * 权限保护组件
 * 用于检查用户是否有任何权限，如果没有权限则显示403页面
 */
export const PermissionGuard: React.FC<IPermissionGuardProps> = ({
    children,
}) => {
    const navigate = useNavigate();
    const userAuth = useSelector((state: RootState) => state.user.auth);

    // 检查用户是否有任何权限
    const hasPermission = hasAnyPermission(userAuth);

    // 如果没有权限，显示403页面
    if (!hasPermission) {
        return (
            <Result
                status="403"
                title="403"
                subTitle="抱歉，您没有访问权限。"
                extra={
                    <Button
                        type="primary"
                        onClick={() => navigate("/")}
                    >
                        返回首页
                    </Button>
                }
            />
        );
    }

    // 如果有权限，渲染子组件
    return <>{children}</>;
};

export default PermissionGuard;
