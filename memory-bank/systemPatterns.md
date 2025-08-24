# 系统架构模式

## 技术架构

### 前端架构

```
React 19 (UI框架)
├── TypeScript (类型安全)
├── Vite (构建工具)
├── Antd (UI组件库)
├── Redux Toolkit (状态管理)
├── React Router (路由管理)
├── TailwindCSS (样式框架)
└── ECharts (数据可视化)
```

### 目录结构模式

```
src/
├── components/          # 通用组件
│   ├── AsideNav/       # 侧边导航
│   ├── Header/         # 页头组件
│   ├── Icon/           # 图标组件
│   └── Upload/         # 上传组件
├── page/               # 页面组件
│   ├── ScaleCreate/    # 量表创建
│   ├── Evaluate/       # 评价管理
│   ├── PersonalData/   # 个人数据
│   └── ...
├── store/              # Redux状态管理
├── Layout/             # 布局组件
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
└── types/              # 类型定义
```

## 设计模式

### 组件设计模式

1. **容器组件模式**

    - 页面级组件负责数据获取和状态管理
    - 展示组件专注于UI渲染

2. **复合组件模式**

    - 如 `CorssTable` 组件支持多种内容渲染器
    - 通过 `contentRender` 实现灵活的内容定制

3. **Hooks模式**
    - 使用自定义Hooks封装业务逻辑
    - Redux hooks统一状态管理

### 状态管理模式

- **RTK Query** - API状态管理和缓存
- **Feature-based Slices** - 按功能模块划分状态
- **Normalized State** - 规范化状态结构

### 数据流模式

```
Component → Action → Reducer → Store → Component
     ↓
API Layer (RTK Query) ← → Backend
```

## 核心组件架构

### 交叉表格组件 (CorssTable)

- **多态渲染**: 支持不同类型单元格的自定义渲染
- **类型安全**: 通过TypeScript接口定义严格类型
- **可扩展性**: 易于添加新的评估方法类型

### 路由结构

- **布局路由**: 统一的页面布局管理
- **权限路由**: 基于角色的路由访问控制
- **懒加载**: 代码分割优化加载性能

## 开发规范

### 代码组织

- 每个功能模块独立目录
- 组件内部按功能划分子组件
- 共享逻辑提取为Hooks或Utils

### 类型定义

- 严格的TypeScript类型检查
- Interface优先，Type作为补充
- 统一的API响应类型定义

### 样式管理

- TailwindCSS优先
- 组件级样式文件补充
- 响应式设计标准

## 性能优化策略

- React.memo优化重渲染
- 懒加载路由和组件
- 虚拟化长列表
- 图片资源优化
