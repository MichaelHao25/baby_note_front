import { clsx, type ClassValue } from "clsx";

/**
 * 组合className的工具函数，支持条件className和更好的可读性
 * @param inputs - className数组或对象
 * @returns 合并后的className字符串
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * 创建常用的布局组合
 */
export const layouts = {
    // 水平居中布局
    centerX: "flex justify-center items-center",
    // 垂直居中布局
    centerY: "flex flex-col justify-center items-center",
    // 完全居中布局
    center: "flex justify-center items-center",
    // 卡片布局
    card: "bg-white rounded-lg shadow-md p-4",
    // 按钮基础样式
    button: "px-4 py-2 rounded-md font-medium transition-colors",
    // 输入框基础样式
    input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
};

/**
 * 创建常用的尺寸组合
 */
export const sizes = {
    // 图标尺寸
    icon: {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-10 h-10",
    },
    // 头像尺寸
    avatar: {
        sm: "w-8 h-8 rounded-full",
        md: "w-12 h-12 rounded-full",
        lg: "w-16 h-16 rounded-full",
        xl: "w-20 h-20 rounded-full",
    },
    // 按钮尺寸
    button: {
        sm: "px-2 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
    },
};

/**
 * 创建常用的颜色组合
 */
export const colors = {
    // 主题色
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    info: "bg-blue-400 text-white hover:bg-blue-500",
    // 边框色
    border: {
        default: "border-gray-300",
        primary: "border-blue-500",
        success: "border-green-500",
        danger: "border-red-500",
        warning: "border-yellow-500",
    },
};

/**
 * 创建状态相关的样式
 */
export const states = {
    // 禁用状态
    disabled: "opacity-50 cursor-not-allowed",
    // 加载状态
    loading: "opacity-75 cursor-wait",
    // 活跃状态
    active: "bg-blue-100 text-blue-600 border-blue-300",
    // 悬停状态
    hover: "hover:bg-gray-50 transition-colors",
    // 聚焦状态
    focus: "focus:outline-none focus:ring-2 focus:ring-blue-500",
};
