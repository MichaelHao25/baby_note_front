/**
 * 生长曲线数据处理工具函数
 */

import dayjs from 'dayjs';
import {
  BOYS_WEIGHT_FOR_AGE,
  BOYS_LENGTH_FOR_AGE,
  BOYS_BMI_FOR_AGE,
  BOYS_HEAD_CIRCUMFERENCE_FOR_AGE,
  BOYS_WEIGHT_FOR_LENGTH,
  GIRLS_WEIGHT_FOR_AGE,
  GIRLS_LENGTH_FOR_AGE,
  GIRLS_BMI_FOR_AGE,
  GIRLS_HEAD_CIRCUMFERENCE_FOR_AGE,
  GIRLS_WEIGHT_FOR_LENGTH,
} from '../../data/growth';
import type {
  Gender,
  GrowthMetric,
  CurveType,
  BabyInfo,
  BabyGrowthPoint,
  GrowthChartDataPoint,
} from '../../types/growth';
import type {
  GrowthStandardPoint,
  WeightForLengthPoint,
} from '../../data/growth/types';
function getStandardData(
  gender: Gender,
  metric: GrowthMetric,
  curveType: CurveType,
): GrowthStandardPoint[] | WeightForLengthPoint[] {
  const isMale = gender === 'male';
  const isAgeCurve = curveType === 'age';

  switch (metric) {
    case 'weight':
      if (isAgeCurve) {
        return isMale ? BOYS_WEIGHT_FOR_AGE : GIRLS_WEIGHT_FOR_AGE;
      }
      return isMale ? BOYS_WEIGHT_FOR_LENGTH : GIRLS_WEIGHT_FOR_LENGTH;
    case 'length':
      return isMale ? BOYS_LENGTH_FOR_AGE : GIRLS_LENGTH_FOR_AGE;
    case 'bmi':
      return isMale ? BOYS_BMI_FOR_AGE : GIRLS_BMI_FOR_AGE;
    case 'headCircumference':
      return isMale ? BOYS_HEAD_CIRCUMFERENCE_FOR_AGE : GIRLS_HEAD_CIRCUMFERENCE_FOR_AGE;
    default:
      return [];
  }
}

/**
 * 将标准数据转换为图表数据点
 */
function convertStandardToChartData(
  standardData: GrowthStandardPoint[] | WeightForLengthPoint[],
  curveType: CurveType,
): GrowthChartDataPoint[] {
  const result: GrowthChartDataPoint[] = [];

  for (const point of standardData) {
    const xValue = curveType === 'age' ? (point as GrowthStandardPoint).month : (point as WeightForLengthPoint).length;
    const values = curveType === 'age'
      ? (point as GrowthStandardPoint)
      : (point as WeightForLengthPoint);

    result.push(
      { age: xValue, value: values.p3, type: 'p3' },
      { age: xValue, value: values.p10, type: 'p10' },
      { age: xValue, value: values.p25, type: 'p25' },
      { age: xValue, value: values.p50, type: 'p50' },
      { age: xValue, value: values.p75, type: 'p75' },
      { age: xValue, value: values.p90, type: 'p90' },
      { age: xValue, value: values.p97, type: 'p97' },
    );
  }

  return result;
}

/**
 * 计算纠正年龄（考虑早产）
 */
function calculateCorrectedAge(birthDate: Date, prematureDays: number, measureDate: Date): number {
  const correctedBirthDate = dayjs(birthDate).add(prematureDays, 'day');
  const months = dayjs(measureDate).diff(correctedBirthDate, 'month', true);
  return Math.max(0, months);
}

/**
 * 将婴儿数据转换为图表数据点
 *
 * 直接使用已取整的 age 值，不再重新计算原始月龄。
 */
function convertBabyDataToChartData(
  babyData: BabyGrowthPoint[],
): GrowthChartDataPoint[] {
  return babyData.map((point) => ({
    age: point.age,
    value: point.value,
    type: 'actual',
    date: point.date,
  }));
}

/**
 * 合并标准数据和婴儿数据
 */
export function mergeChartData(
  standardData: GrowthStandardPoint[] | WeightForLengthPoint[],
  babyData: BabyGrowthPoint[],
  curveType: CurveType,
): GrowthChartDataPoint[] {
  const standardChartData = convertStandardToChartData(standardData, curveType);
  const babyChartData = convertBabyDataToChartData(babyData);
  return [...standardChartData, ...babyChartData];
}

/**
 * 获取完整的图表数据
 *
 * 标准数据只展示到宝宝当前月数 + 2 个月余量，
 * 避免在图表上显示大量无关的远月标准曲线。
 */
export function getGrowthChartData(
  metric: GrowthMetric,
  gender: Gender,
  curveType: CurveType,
  babyData: BabyGrowthPoint[],
  babyInfo: BabyInfo,
): GrowthChartDataPoint[] {
  const standardData = getStandardData(gender, metric, curveType);
  // 根据宝宝当前月数截断标准数据，多留2个月余量
  const currentAge = calculateCorrectedAge(
    babyInfo.birthDate,
    babyInfo.prematureDays,
    new Date(),
  );
  const maxAge = Math.ceil(currentAge) + 2;
  let filteredStandard = standardData;
  if (curveType === 'age') {
    filteredStandard = (standardData as GrowthStandardPoint[]).filter(
      (p) => p.month <= maxAge,
    );
  }
  return mergeChartData(filteredStandard, babyData, curveType);
}

/**
 * 获取指标的单位和显示名称
 */
export function getMetricInfo(metric: GrowthMetric): { unit: string; name: string } {
  const infoMap = {
    weight: { unit: 'kg', name: '体重' },
    length: { unit: 'cm', name: '身长' },
    bmi: { unit: '', name: 'BMI' },
    headCircumference: { unit: 'cm', name: '头围' },
  };
  return infoMap[metric];
}

/**
 * 获取X轴标签
 */
export function getXAxisLabel(curveType: CurveType): string {
  return curveType === 'age' ? '年龄（月）' : '身长（cm）';
}

/**
 * 计算百分位数（基于标准数据线性插值）
 */
export function calculatePercentile(
  value: number,
  standardData: GrowthStandardPoint[] | WeightForLengthPoint[],
): number {
  if (standardData.length === 0) return 50;

  // 找到最接近的数据点
  const percentiles = ['p3', 'p10', 'p25', 'p50', 'p75', 'p90', 'p97'] as const;
  const percentileValues = percentiles.map(p => standardData[0][p]);

  // 简化的百分位计算（实际应该做更精确的插值）
  if (value <= percentileValues[0]) return 3;
  if (value >= percentileValues[6]) return 97;

  for (let i = 0; i < percentileValues.length - 1; i++) {
    if (value >= percentileValues[i] && value <= percentileValues[i + 1]) {
      const ratio = (value - percentileValues[i]) / (percentileValues[i + 1] - percentileValues[i]);
      return [3, 10, 25, 50, 75, 90, 97][i] + ratio * ([3, 10, 25, 50, 75, 90, 97][i + 1] - [3, 10, 25, 50, 75, 90, 97][i]);
    }
  }

  return 50;
}

/**
 * 过滤特定年龄范围的数据
 */
export function filterByAgeRange(
  data: GrowthChartDataPoint[],
  minAge?: number,
  maxAge?: number,
): GrowthChartDataPoint[] {
  return data.filter((point) => {
    if (minAge !== undefined && point.age < minAge) return false;
    if (maxAge !== undefined && point.age > maxAge) return false;
    return true;
  });
}

/**
 * 按类型分离图表数据
 */
export function separateDataByType(data: GrowthChartDataPoint[]): {
  standard: GrowthChartDataPoint[];
  actual: GrowthChartDataPoint[];
} {
  return {
    standard: data.filter((d) => d.type !== 'actual'),
    actual: data.filter((d) => d.type === 'actual'),
  };
}
