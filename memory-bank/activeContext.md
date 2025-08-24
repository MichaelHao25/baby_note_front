# 当前工作上下文

## 当前开发焦点

### 主要问题

正在解决 `ReactCorssTable` 组件的TypeScript类型错误：

1. **数据类型不匹配**

    - `list1` 常量与 `ICell[][]` 类型不兼容
    - 需要修正数据结构定义

2. **组件属性类型错误**

    - `SelectEvaluationStandard` 组件props类型不匹配
    - `Level` 组件props类型不匹配
    - 需要统一组件接口定义

3. **属性类型定义问题**
    - `placeholder`, `min`, `max`, `inputRule` 等属性类型为unknown
    - 需要在 `ICell` 接口中明确定义这些属性

### 近期已修复的问题

1. **Prettier格式化问题 - 已修复 ✅**

    - 问题：代码存在大量超过80字符的长行，prettier配置未生效
    - 解决：添加了format脚本到package.json，运行全项目格式化
    - 结果：所有文件现在都符合prettier格式标准（printWidth: 80）
    - 命令：`pnpm run format` 用于格式化，`pnpm run format:check` 用于检查

2. **保存时自动格式化配置 - 已完成 ✅**

    - 配置文件：`.vscode/settings.json` 用于VSCode/Cursor
    - 配置文件：`.idea/prettier.xml` 用于WebStorm/IntelliJ
    - 文档：`docs/editor-setup.md` 包含详细配置说明
    - 功能：保存时自动运行prettier格式化和ESLint修复
    - 测试：创建测试文件验证格式化功能正常工作

3. **超长className解决方案 - 已完成 ✅**
    - 问题：项目中存在大量超长className影响可读性
    - 解决：安装clsx库，创建className工具函数
    - 工具：`src/utils/classNames.ts` 提供cn函数和预定义样式
    - 配置：`.prettierrc` 设置 `singleAttributePerLine: true`
    - 文档：`docs/className-refactor-guide.md` 包含完整的重构指南
    - 方案：多种处理超长className的方法（clsx、数组分割、预定义样式等）

### 近期工作

1. **API开发**: 正在开发属性管理相关的CRUD接口

    - `/attr/add` - 创建属性
    - `/attr/update` - 更新属性
    - `/attr/lists` - 属性列表
    - `/attr/delete` - 删除属性

2. **交叉表格组件**: 核心的量表创建组件需要类型修复

### 最近完成的功能

1. **停用功能实现** - 已完成

    - 为ICell接口添加了`hidden`属性用于标记停用状态
    - 修复了CorssTable组件的TypeScript类型错误
    - 实现了Level组件的停用/启用功能
    - 添加了停用状态的视觉标识

2. **上移下移功能实现** - 已完成

    - 创建了`getLevelBlocks`工具函数来识别所有维度块
    - 实现了维度块的上移和下移功能
    - 添加了边界条件检查和按钮禁用逻辑
    - 优化了维度块交换的算法

3. **评价标准列右键菜单功能实现** - 已完成

    - 为SelectEvaluationStandard组件添加了完整的右键菜单
    - 实现了添加、删除、上移、下移、停用等功能
    - 优化了上移下移逻辑，只在同类型同index的项之间交换
    - 添加了停用状态的视觉标识和功能

4. **具体实现内容**

    **停用功能：**

    - 在`interface.ts`中添加了`hidden?: boolean`和`title?: string`属性
    - 修复了`CorssTable.tsx`中的title类型错误（使用String()转换）
    - 完善了Level组件的停用菜单项，支持停用和重新启用
    - 在层次1列添加了"已停用"的红色标识
    - 停用状态下单元格变为灰色且输入框禁用

    **上移下移功能：**

    - 创建了`getLevelBlocks.ts`工具函数来管理维度块
    - 使用块索引而非复杂的行遍历来实现移动
    - 添加了`canMoveUp`和`canMoveDown`状态判断
    - 在菜单项中添加了disabled属性来禁用不可操作的按钮

    **评价标准列功能：**

    - 重构SelectEvaluationStandard组件，添加右键菜单支持
    - 实现添加功能：在当前行后插入新的评价标准行
    - 实现删除功能：删除当前行（带确认对话框）
    - 实现上移下移：只在相同列相同index的项之间移动
    - 实现停用功能：支持单个评价标准项的停用/启用
    - 修复类型错误：value属性正确转换为字符串类型

### 技术实现细节

**数据结构扩展**

- `ICell.hidden?: boolean` - 标记单元格是否被停用
- `ICell.title?: string` - 明确定义表头标题类型

**停用逻辑**

- 使用`getRowStartAndEndIndex`确定相关行范围
- 通过`produce`和`immer`更新数据状态
- 只对层次1（columnIndex === 0）的单元格添加停用标识

**上移下移逻辑**

- `getLevelBlocks()` - 识别表格中所有的维度块边界
- `findBlockByRowIndex()` - 根据行索引查找对应的维度块
- 通过块索引确定相邻块，然后交换位置
- 边界检查防止越界操作

**评价标准列逻辑**

- 添加功能：复制当前行结构，前3列设为default，后续列设为相应的评价标准项
- 删除功能：直接删除当前行
- 上移下移：扫描找到相同contentType和index的目标行进行交换
- 停用功能：只影响当前单元格，不影响整行

**用户界面**

- 停用状态：灰色背景，透明度60%，文字变灰，输入框禁用
- 层次1列显示"已停用"红色标签
- 评价标准列也显示"已停用"红色标签
- 右键菜单动态显示"停用"或"启用"选项
- 上移下移按钮根据位置自动禁用/启用

### 最近修复的问题

1. **类型错误修复**

    - 解决了`title`属性的ReactNode类型错误
    - 为ICell接口添加了明确的属性定义
    - 修复SelectEvaluationStandard中value属性的类型问题

2. **移动逻辑优化**

    - 重构了复杂的行遍历逻辑，使用更可靠的块管理方式
    - 添加了完善的边界条件检查
    - 优化评价标准列的上移下移，只在同类型项之间移动

3. **组件接口统一**
    - SelectEvaluationStandard组件接口与IChildComponentProps保持一致
    - 添加了必要的props传递以支持完整功能

## 最近发现的模式

### 组件设计模式

- **多态渲染模式**: `CorssTable` 组件通过 `contentRender` 支持不同类型的单元格渲染
- **评估方法枚举**: 使用 `IEvaluationMethod` 枚举定义不同的评估类型

### 数据结构模式

- **单元格接口**: `ICell` 接口定义交叉表格的基本单元结构
- **常量数据**: 使用 `constant.ts` 文件管理静态数据

## 下一步计划

### 立即任务

1. **修复类型错误**: 解决 `ReactCorssTable` 组件的TypeScript问题
2. **接口完善**: 补全 `ICell` 接口的属性定义
3. **组件props统一**: 确保所有渲染组件的props接口一致

### 建议测试

1. **停用功能测试**

    - 测试Layer组件停用功能是否正确标记相关行
    - 测试评价标准列单项停用功能
    - 验证启用功能能否正确恢复
    - 确认视觉标识显示正确

2. **上移下移功能测试**

    - 测试维度块的上移下移是否正确交换位置
    - 测试评价标准列的上移下移是否只在同类型项间交换
    - 验证边界情况（第一个和最后一个项）的按钮禁用
    - 确认跨多行的维度块移动是否完整

3. **添加删除功能测试**

    - 测试评价标准列的添加功能是否正确创建新行
    - 验证删除功能是否正确移除行
    - 确认删除时的确认对话框

4. **边界情况测试**
    - 测试只有一个维度块时的行为
    - 测试只有一行评价标准时的删除限制
    - 验证复杂层次结构的各种操作
    - 确认停用状态在各种操作时的持久性

### 可能的增强

1. **数据验证**: 在各种操作时添加数据完整性检查
2. **批量操作**: 支持批量停用/启用、移动多个项目
3. **拖拽支持**: 考虑添加拖拽方式的重排
4. **撤销重做**: 添加操作历史和撤销功能
5. **删除限制**: 防止删除最后一行评价标准
6. **模板支持**: 添加评价标准模板快速插入

### 中期目标

1. **API集成**: 将属性管理API集成到Redux store
2. **数据流优化**: 完善组件间的数据传递
3. **测试覆盖**: 添加组件单元测试

## 当前技术决策

### 已确认的方案

- 使用Redux Toolkit进行状态管理
- TailwindCSS作为主要样式解决方案
- TypeScript严格模式确保类型安全
- 使用immer的produce进行不可变数据更新
- 通过hidden属性而非删除数据来实现停用
- 在相应列显示停用状态标识
- 动态菜单项根据当前状态显示对应操作
- 使用块管理方式处理维度移动
- 使用精确匹配方式处理评价标准项移动
- 通过disabled属性控制菜单项的可用性
- 统一的IChildComponentProps接口设计

### 待决定的问题

- 是否需要重构 `CorssTable` 组件的数据结构
- 如何更好地组织评估方法的类型定义
- 是否需要添加更多的单元格类型支持

## 开发环境状态

- **Git状态**: 工作目录干净，落后origin/main 2个提交
- **依赖状态**: 所有依赖已安装，版本稳定
- **构建状态**: 存在TypeScript类型错误，需要修复
- **功能状态**: 停用、上移下移、评价标准列完整功能已实现并集成
- **代码状态**: 所有TypeScript类型错误已修复
- **工具函数**: 新增getLevelBlocks等维度管理工具
- **组件接口**: SelectEvaluationStandard接口已统一
- **待验证**: 功能测试和用户体验验证

# 活动上下文

## 当前工作重点

交叉表格组件(CorssTable)的角标自动更新功能实现

## 最近更改（按时间倒序）

### 2024年12月 - 角标自动更新功能 ✅

**问题**: 用户希望在每次数据更新时自动更新右上角的角标（层次1：A1-An，层次2：B1-Bn）
**解决方案**:

- 创建`updateLevelFlags.ts`工具函数，自动重新计算角标
- 在Level组件中添加`setStateWithFlagUpdate`辅助函数
- 在SelectEvaluationStandard组件中添加`setStateWithFlagUpdate`辅助函数
- 替换所有setState调用为自动更新角标的版本

**技术实现**:

- `updateLevelFlags()` - 遍历表格数据，为层次1和层次2的level单元格重新编号
- 层次1（第1列）：A1, A2, A3...
- 层次2（第2列）：B1, B2, B3...
- 在所有数据操作后自动调用：添加、删除、上移、下移、停用
- 保持输入框的onChange不触发角标更新（只在结构性操作时更新）

### 2024年12月 - 评价标准移动边界修复 ✅

**问题**: 评价标准的上移下移可以移动出当前观察点，跨越到其他观察点
**解决方案**:

- 创建`getObservationPointBounds.ts`工具函数
- 通过分析观察点列（第3列）的parentKey来确定边界
- 修改SelectEvaluationStandard组件的移动逻辑
- 限制上移下移只能在同一观察点内进行

**技术实现**:

- `getObservationPointBounds()` - 获取当前行所属观察点的开始和结束行索引
- 边界检查：`i >= startIndex` 和 `i <= endIndex`
- 现在评价标准只能在同一观察点的评价标准行之间移动

### 2024年12月 - 输入框双向数据绑定 ✅

**问题**: 所有输入框都没有绑定到单元格数据，用户输入不会保存
**解决方案**:

- 修改Level组件：添加value属性和onChange事件处理
- 修改SelectEvaluationStandard组件：将defaultValue改为value，添加onChange
- 创建ObservationPoint组件：替换内联函数，实现双向绑定
- 创建SelectEvaluationStandardAndInput组件：替换内联函数，实现双向绑定
- 更新interface.ts中contentRender类型定义：支持React组件和函数两种类型
- 修复constant.ts：将字符串类型改为ICellType枚举值

**技术实现**:

- 使用`value={String(value || "")}`显示当前值
- 使用`onChange`事件 + `produce`更新数据状态
- 所有输入框现在都能正确保存用户输入到对应单元格的value属性

### 2024年12月 - 评价标准列功能完善 ✅

**实现内容**:

- SelectEvaluationStandard组件添加完整右键菜单
- 支持添加、删除、上移、下移、停用功能
- 修复组件接口与IChildComponentProps一致性
- 添加功能正确复制行结构
- 上移下移只在相同列相同index项之间操作

### 2024年12月 - 上移下移功能 ✅

**实现内容**:

- 创建getLevelBlocks.ts工具函数识别维度块
- 实现Level组件的上移下移功能
- 添加边界条件检查和按钮禁用逻辑
- 通过块索引确定相邻块并交换位置

### 2024年12月 - 停用功能实现 ✅

**实现内容**:

- ICell接口添加hidden和title属性
- Level组件完善停用菜单项
- 添加停用状态视觉标识
- 在层次1列显示"已停用"标签
- 右键菜单动态显示停用/启用选项

## 下一步工作

- 测试角标自动更新功能是否正常工作
- 验证所有功能的兼容性
- 确认用户体验的完整性
