import type { IMenuConfig } from "../components/HeaderNav/config";

// 通用菜单配置接口
export interface IBaseMenuConfig {
    title: React.ReactNode;
    /**
     * 如果title是React.ReactNode，则需要将title转换为字符串
     * 如果title是字符串，则直接使用title
     */
    titleToString?: string;
    icon?: React.ReactNode;
    activeIcon?: React.ReactNode;
    url?: string | (() => void);
    activeList?: string[];
    code?: string;
    children?: IBaseMenuConfig[];
}

/**
 * 检查用户是否有权限访问指定页面
 * @param userAuth 用户权限数组
 * @param pageTitle 页面标题
 * @returns 是否有权限
 */
export const hasPermission = (
    userAuth: string[],
    pageTitle: string,
): boolean => {
    // 如果没有权限数组，默认有权限（向后兼容）
    if (!userAuth || userAuth.length === 0) {
        return true;
    }

    // 检查用户权限数组中是否包含该页面标题
    return userAuth.includes(pageTitle);
};

/**
 * 根据用户权限过滤菜单配置
 * @param menuConfig 菜单配置数组
 * @param userAuth 用户权限数组
 * @returns 过滤后的菜单配置
 */
export const filterMenuByPermission = <T extends IBaseMenuConfig>(
    menuConfig: T[],
    userAuth: string[],
): T[] => {
    // 如果没有权限数组，返回所有菜单（向后兼容）
    if (!userAuth || userAuth.length === 0) {
        return menuConfig;
    }

    return menuConfig
        .filter((item) => {
            // 检查当前菜单项是否有权限
            const hasCurrentPermission = hasPermission(
                userAuth,
                item.titleToString || (item.title as string),
            );
            // 暂时不过滤子菜单
            // // 如果有子菜单，递归过滤子菜单
            // if (item.children && item.children.length > 0) {
            //     const filteredChildren = filterMenuByPermission(
            //         item.children,
            //         userAuth,
            //     );
            //     // 如果过滤后还有子菜单，则保留该菜单项
            //     if (filteredChildren.length > 0) {
            //         return true;
            //     }
            // }

            // 返回是否有权限
            return hasCurrentPermission;
        })
        .map((item) => {
            // 如果有子菜单，更新子菜单
            if (item.children && item.children.length > 0) {
                return {
                    ...item,
                    // 暂时不过滤子菜单
                    // children: filterMenuByPermission(item.children, userAuth),
                } as T;
            }
            return item;
        });
};

/**
 * 检查用户是否有任何权限
 * @param userAuth 用户权限数组
 * @returns 是否有权限
 */
export const hasAnyPermission = (userAuth: string[]): boolean => {
    return userAuth && userAuth.length > 0;
};
