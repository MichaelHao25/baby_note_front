# className 重构指南 - 解决超长类名问题

## 🎯 目标

解决项目中超长 className 的问题，提高代码可读性和维护性。

## 🔧 解决方案

### 1. 使用 clsx 库拆分长 className（推荐）

#### 安装依赖

```bash
pnpm add clsx
```

#### 创建工具函数

```typescript
// src/utils/classNames.ts
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}
```

#### 使用示例

**重构前：**

```tsx
<div className="w-[160px] h-[160px] flex justify-center items-center bg-[#fff3db] rounded-px relative border border-gray-300 shadow-lg">
    <span className="text-[16px] font-semibold pl-[5px] border-l-[3px] border-[#ffaa44] bg-white px-4 py-2">
        内容
    </span>
</div>
```

**重构后：**

```tsx
<div
    className={cn(
        // 尺寸相关
        "w-[160px] h-[160px]",
        // 布局相关
        "flex justify-center items-center",
        // 背景和边框
        "bg-[#fff3db] rounded-px relative",
        "border border-gray-300 shadow-lg",
    )}
>
    <span
        className={cn(
            // 字体相关
            "text-[16px] font-semibold",
            // 边框装饰
            "pl-[5px] border-l-[3px] border-[#ffaa44]",
            // 背景和内边距
            "bg-white px-4 py-2",
        )}
    >
        内容
    </span>
</div>
```

### 2. 使用数组分割法

```tsx
const TestComponent = () => {
    const containerClasses = [
        "w-[160px] h-[160px]",
        "flex justify-center items-center",
        "bg-[#fff3db] rounded-px relative",
        "border border-gray-300 shadow-lg",
    ].join(" ");

    return <div className={containerClasses}>内容</div>;
};
```

### 3. 使用预定义样式组合

```tsx
// src/utils/classNames.ts
export const layouts = {
    center: "flex justify-center items-center",
    card: "bg-white rounded-lg shadow-md p-4",
    button: "px-4 py-2 rounded-md font-medium transition-colors",
};

export const sizes = {
    avatar: {
        sm: "w-8 h-8 rounded-full",
        md: "w-12 h-12 rounded-full",
        lg: "w-16 h-16 rounded-full",
    },
};

// 使用
<div className={cn(sizes.avatar.lg, layouts.center, "bg-blue-500")}>头像</div>;
```

### 4. 条件 className

```tsx
const Button = ({ isActive, isDisabled }) => {
    return (
        <button
            className={cn(
                // 基础样式
                "px-4 py-2 rounded-md font-medium transition-colors",
                // 条件样式
                {
                    "bg-blue-500 text-white": isActive,
                    "bg-gray-300 text-gray-500": isDisabled,
                    "hover:bg-blue-600": !isDisabled,
                },
            )}
        >
            按钮
        </button>
    );
};
```

## 🚀 实际项目重构示例

### 重构前的代码

```tsx
// src/page/Evaluateprogress/components/cardItem.tsx
<div className="left-img w-[160px] h-[160px] flex justify-center items-center bg-[#fff3db] rounded-px relative">
    <div className="w-[30px] h-[30px] rounded-[15px] bg-[#4880ff] flex justify-center items-center text-[#fff] absolute top-2 right-2">
        {data.num}
    </div>
</div>
```

### 重构后的代码

```tsx
// 导入工具函数
import { cn, layouts, sizes } from "@/utils/classNames";

// 重构后的组件
<div
    className={cn(
        // 尺寸和布局
        "w-[160px] h-[160px]",
        layouts.center,
        // 背景和圆角
        "bg-[#fff3db] rounded-px relative",
    )}
>
    <div
        className={cn(
            // 尺寸和形状
            "w-[30px] h-[30px] rounded-[15px]",
            // 布局
            layouts.center,
            // 颜色和位置
            "bg-[#4880ff] text-[#fff]",
            "absolute top-2 right-2",
        )}
    >
        {data.num}
    </div>
</div>;
```

## 📋 重构清单

### 立即可以做的改进

1. **安装 clsx 库** ✅
2. **创建 cn 工具函数** ✅
3. **创建常用样式组合** ✅
4. **重构超长 className**

### 逐步重构计划

1. **第一阶段**：重构最长的 className（100+ 字符）
2. **第二阶段**：重构中等长度的 className（80+ 字符）
3. **第三阶段**：统一项目中的样式模式
4. **第四阶段**：创建组件样式库

### 重构优先级

#### 高优先级

- 超过 100 字符的 className
- 重复出现的样式组合
- 复杂的条件 className

#### 中等优先级

- 80-100 字符的 className
- 组件内部的样式复用

#### 低优先级

- 简单的单行 className
- 不经常修改的样式

## 💡 最佳实践

### 1. 分类组织

```tsx
className={cn(
    // 布局相关
    "flex justify-center items-center",
    // 尺寸相关
    "w-full h-12",
    // 颜色相关
    "bg-blue-500 text-white",
    // 边框和圆角
    "border border-gray-300 rounded-md",
    // 状态相关
    "hover:bg-blue-600 transition-colors"
)}
```

### 2. 使用语义化命名

```tsx
// 好的做法
const cardStyles = "bg-white rounded-lg shadow-md p-4";
const buttonStyles = "px-4 py-2 rounded-md font-medium";

// 避免
const styles1 = "bg-white rounded-lg shadow-md p-4";
const styles2 = "px-4 py-2 rounded-md font-medium";
```

### 3. 保持一致性

```tsx
// 统一的间距系统
const spacing = {
    xs: "p-1",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
};

// 统一的颜色系统
const colors = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
};
```

## 🔧 配置 Prettier

确保 `.prettierrc` 包含以下配置：

```json
{
    "printWidth": 80,
    "singleAttributePerLine": true,
    "tabWidth": 4
}
```

这会确保：

- 每个属性独占一行
- 代码行宽度控制在 80 字符
- 使用 4 个空格缩进

## 🎉 预期效果

重构后的代码将具有：

1. **更好的可读性** - 每个样式分类清晰
2. **更好的维护性** - 样式复用，修改方便
3. **更好的协作性** - 团队成员容易理解
4. **更好的一致性** - 统一的样式模式
5. **更好的条件控制** - 动态样式更容易管理

---

_通过这些技巧，您可以彻底解决超长 className 的问题，让代码更加优雅和易维护！_
