/**
 * 生长曲线相关类型定义
 */

/**
 * 婴儿性别
 */
export type Gender = 'male' | 'female';

/**
 * 生长指标类型
 */
export type GrowthMetric = 'weight' | 'length' | 'bmi' | 'headCircumference';

/**
 * 曲线类型
 */
export type CurveType = 'age' | 'length';

/**
 * 体重记录
 */
export interface WeightRecord {
  _id: string;
  weight: number; // 体重（kg）
  weightTime: Date; // 称重时间
  note?: string; // 备注
  updatedAt: Date; // 更新时间
}

/**
 * 身长记录
 */
export interface LengthRecord {
  _id: string;
  length: number; // 身长（cm）
  lengthTime: Date; // 测量时间
  note?: string; // 备注
  updatedAt: Date; // 更新时间
}

/**
 * 宝宝信息
 */
export interface BabyInfo {
  _id: string;
  name: string; // 宝宝姓名
  gender: Gender; // 性别
  birthDate: Date; // 出生日期
  prematureDays: number; // 早产天数（默认0表示非早产）
}

/**
 * 婴儿生长数据点（实际记录）
 */
export interface BabyGrowthPoint {
  age: number; // 年龄（月）
  value: number; // 测量值
  date: Date; // 测量日期
  metric: GrowthMetric; // 指标类型
}

/**
 * 生长曲线数据点（用于图表渲染）
 */
export interface GrowthChartDataPoint {
  age: number; // 年龄（月）
  value: number; // 数值
  type: string; // 数据类型：'p3', 'p10', 'p25', 'p50', 'p75', 'p90', 'p97', 'actual'
  date?: Date; // 实际测量日期
}

/**
 * 生长曲线配置
 */
export interface GrowthChartConfig {
  metric: GrowthMetric; // 指标类型
  gender: Gender; // 性别
  curveType: CurveType; // 曲线类型
  babyData?: BabyGrowthPoint[]; // 婴儿实际数据
  babyInfo: BabyInfo; // 宝宝信息
}

/**
 * 生长评估结果
 */
export interface GrowthAssessment {
  percentile: number; // 百分位数
  status: 'low' | 'normal' | 'high'; // 状态：偏低、正常、偏高
  advice: string; // 建议
}