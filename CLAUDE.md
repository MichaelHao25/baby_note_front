# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

安安记事本 - 婴儿成长记录应用，用于记录宝宝的饮食、体重、排便等数据，并提供时间线和报表功能。

## 常用命令

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 预览构建产物
pnpm preview

# 代码检查
pnpm lint

# 格式化代码
pnpm format

# 检查格式
pnpm format:check
```

## 技术栈

- **React 19** + **TypeScript 5.8**
- **Vite 6** - 构建工具
- **Konsta UI** - iOS 风格移动端组件库
- **Tailwind CSS 4** - 样式
- **Redux Toolkit + RTK Query** - 状态管理和 API 层
- **react-router 7** - 懒加载路由

## 架构结构

### 嵌套布局模式

```
GlobalLayout (权限守卫、全局 Toast/Notification)
  └─ HomeLayout (Navbar、底部 Tabbar)
      └─ 页面组件 (Home, Weight, Timeline, Chart)
```

### 路由配置

路由在 `src/App.tsx` 中配置，使用 `lazy` 模式懒加载页面组件和 loader：

```typescript
lazy: {
  Component: async () => (await import("./page/Home")).Component,
  loader: async () => (await import("./page/Home")).loader,
}
```

### API 层

使用 RTK Query (`src/store/apiSlice.ts`)，所有 API 请求自动携带 localStorage 中的 token：

- 开发环境：`http://127.0.0.1:8080/api/v1`
- 生产环境：`http://47.100.13.112/api/v1`

Tag 类型：`Eat`, `Weight`, `Timeline` - 用于自动刷新缓存

### 状态管理

Store slices：
- `userSlice` - 用户状态和初始化
- `scaleCreateSlice` - 创建相关状态
- `apiSlice` - RTK Query 缓存

使用 hooks：`useAppDispatch`, `useAppSelector`（见 `src/hooks/redux.ts`）

### 类型定义

API 类型集中在 `src/types/api.ts`，统一使用 `ApiResponse<T>` 响应格式：

```typescript
interface ApiResponse<T> {
  code: number;  // 1 成功, 0 失败
  msg: string;
  time: string;
  data: T;
}
```

## 目录结构要点

- `src/page/` - 页面组件，每个页面导出 `Component` 和可选的 `loader`
- `src/Layout/` - 嵌套布局组件
- `src/components/` - 通用组件（ErrorBoundary、GlobalToast、IconFont 等）
- `src/store/` - Redux slices 和 store 配置
- `src/hooks/` - 自定义 hooks
- `src/utils/` - 工具函数（auth、format、file 等）

## 代码规范

- Husky + lint-staged：提交前自动执行 Prettier 格式化
- ESLint 配置：TypeScript 严格模式 + react-hooks 规则
- 路由组件必须导出 `Component`，可选导出 `loader`

## 后端 API

后端项目位于 `../backend`（Go + Gin），API 端点包括：
- `/user/login` - 登录
- `/eat` - 饮食记录 CRUD
- `/weight` - 体重记录 CRUD
- `/timeline` - 时间线 CRUD
- `/insight` - 数据洞察
- `/insight/charts` - 图表数据