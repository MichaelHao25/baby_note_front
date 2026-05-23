/**
 * 儿童生长标准数据类型定义
 *
 * 用于 WS/T 423-2022《7岁以下儿童生长标准》数据结构
 */

/**
 * 生长标准数据点
 *
 * 表示特定年龄下儿童的某项生长指标的百分位数值
 */
export interface GrowthStandardPoint {
  /** 年龄（月） */
  month: number;

  /** P3 百分位数值（下等，建议咨询医生） */
  p3: number;

  /** P10 百分位数值（中下） */
  p10: number;

  /** P25 百分位数值（中等范围） */
  p25: number;

  /** P50 百分位数值（中位数） */
  p50: number;

  /** P75 百分位数值（中等范围） */
  p75: number;

  /** P90 百分位数值（中上） */
  p90: number;

  /** P97 百分位数值（上等，建议咨询医生） */
  p97: number;
}

/**
 * 身长/体重数据点
 *
 * 用于按身长/身高分组的体重百分位数据
 */
export interface WeightForLengthPoint {
  /** 身长/身高（厘米） */
  length: number;

  /** P3 百分位数值（下等，建议咨询医生） */
  p3: number;

  /** P10 百分位数值（中下） */
  p10: number;

  /** P25 百分位数值（中等范围） */
  p25: number;

  /** P50 百分位数值（中位数） */
  p50: number;

  /** P75 百分位数值（中等范围） */
  p75: number;

  /** P90 百分位数值（中上） */
  p90: number;

  /** P97 百分位数值（上等，建议咨询医生） */
  p97: number;
}
