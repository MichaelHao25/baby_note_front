import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

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
  //   const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);

  // 检查用户是否有任何权限
  //   const hasPermission = hasAnyPermission(userAuth);

  // 如果没有权限，显示403页面
  if (!token) {
    return <div></div>;
  }

  // 如果有权限，渲染子组件
  return <>{children}</>;
};

export default PermissionGuard;
