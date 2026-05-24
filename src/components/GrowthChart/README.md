# GrowthChart 组件

基于 @antv/f2 实现的生长曲线图表组件，支持 WS/T 423-2022《7岁以下儿童生长标准》曲线展示。

## 功能特性

- ✅ 支持四种生长指标：体重、身长、BMI、头围
- ✅ 支持两种曲线类型：年龄别曲线、身长别体重曲线
- ✅ 显示 P3, P10, P25, P50, P75, P90, P97 标准曲线
- ✅ 显示婴儿实际测量数据点
- ✅ 支持早产儿纠正年龄计算
- ✅ 响应式设计，适配移动端
- ✅ 数据点交互提示

## 使用示例

```tsx
import { GrowthChart } from '@/components/GrowthChart';
import type { GrowthChartConfig } from '@/types/growth';

const config: GrowthChartConfig = {
  metric: 'weight',
  gender: 'male',
  curveType: 'age',
  babyData: [
    {
      age: 6,
      value: 8.5,
      date: new Date('2024-05-15'),
      metric: 'weight',
    },
  ],
  babyInfo: {
    _id: '1',
    name: '宝宝',
    birthDate: new Date('2023-11-15'),
    prematureDays: 0,
  },
};

<GrowthChart config={config} height={350} />;
```

## Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| config | `GrowthChartConfig` | 是 | 图表配置对象 |
| height | `number` | 否 | 图表高度，默认 350 |
| className | `string` | 否 | 自定义类名 |

## 配置说明

### GrowthChartConfig

```typescript
interface GrowthChartConfig {
  metric: GrowthMetric;    // 指标类型：'weight' | 'length' | 'bmi' | 'headCircumference'
  gender: Gender;          // 性别：'male' | 'female'
  curveType: CurveType;    // 曲线类型：'age' | 'length'
  babyData?: BabyGrowthPoint[];  // 婴儿实际数据
  babyInfo: BabyInfo;      // 宝宝信息
}
```

### 曲线颜色说明

- **红色虚线 (P3/P97)**：偏低/偏高，建议咨询医生
- **橙色 (P10/P90)**：中下/中上
- **黄色 (P25/P75)**：中等范围
- **绿色 (P50)**：中位数，参考标准
- **蓝色点 (实际)**：宝宝实际测量数据

## 工具函数

组件提供以下工具函数用于数据处理：

- `getGrowthChartData()` - 获取完整图表数据
- `getMetricInfo()` - 获取指标单位和名称
- `getXAxisLabel()` - 获取X轴标签
- `calculatePercentile()` - 计算百分位数
- `filterByAgeRange()` - 按年龄范围过滤数据
- `separateDataByType()` - 分离标准数据和实际数据

## 技术栈

- @antv/f-react ^1.8.2
- @antv/f2 ^5.11.0
- React 19

## 注意事项

1. 确保传入的 `babyInfo.birthDate` 是有效的 Date 对象
2. `babyData` 可以为空数组，此时仅显示标准曲线
3. 早产儿会自动使用纠正年龄进行计算
4. 图表会自动适配数据范围，无需手动设置坐标轴范围
