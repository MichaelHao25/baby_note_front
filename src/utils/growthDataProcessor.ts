import dayjs from 'dayjs';
import {
  BOYS_WEIGHT_FOR_AGE,
  BOYS_LENGTH_FOR_AGE,
  BOYS_BMI_FOR_AGE,
  BOYS_HEAD_CIRCUMFERENCE_FOR_AGE,
  GIRLS_WEIGHT_FOR_AGE,
  GIRLS_LENGTH_FOR_AGE,
  GIRLS_BMI_FOR_AGE,
  GIRLS_HEAD_CIRCUMFERENCE_FOR_AGE,
} from '@/data/growth';
import type {
  GrowthStandardPoint,
  WeightForLengthPoint,
} from '@/data/growth/types';
import type {
  BabyGrowthPoint,
  BabyInfo,
  Gender,
  GrowthAssessment,
  GrowthChartDataPoint,
  GrowthMetric,
  WeightRecord,
} from '@/types/growth';

/**
 * 计算年龄（月）
 *
 * @param birthDate - 出生日期
 * @param measurementDate - 测量日期
 * @param prematureDays - 早产天数（可选）
 * @returns 年龄（月），保留两位小数
 *
 * @example
 * ```ts
 * calculateAge(new Date('2024-01-01'), new Date('2024-02-01')) // 1.00
 * calculateAge(new Date('2024-01-01'), new Date('2024-01-15')) // 0.48
 * ```
 */
export function calculateAge(
  birthDate: Date,
  measurementDate: Date,
  prematureDays?: number,
): number {
  const baseDate = prematureDays
    ? dayjs(birthDate).add(prematureDays, 'day')
    : dayjs(birthDate);

  const months = dayjs(measurementDate).diff(baseDate, 'month', true);
  return Math.max(0, Math.round(months * 100) / 100);
}

/**
 * 按月取点：将月龄 +1 后 Math.floor 取整得到图表月龄，
 * 同一图表月份内选取 (age+1) 最接近该整数的记录。
 *
 * 例如：原始 0.3 月 → 1.3 → 图表第 1 月；原始 1.2 月 → 2.2 → 图表第 2 月
 */
function pickPointsPerMonth<T extends { age: number }>(
  points: T[],
): T[] {
  const groups = new Map<number, T[]>();

  for (const point of points) {
    const chartAge = Math.floor(point.age + 1);
    if (!groups.has(chartAge)) {
      groups.set(chartAge, []);
    }
    groups.get(chartAge)!.push(point);
  }

  const result: T[] = [];
  for (const [month, groupPoints] of groups) {
    // 选出 (age+1) 最接近 month 的记录
    const best = groupPoints.reduce((prev, curr) => {
      const prevDist = Math.abs(prev.age + 1 - month);
      const currDist = Math.abs(curr.age + 1 - month);
      return currDist < prevDist ? curr : prev;
    });
    result.push({ ...best, age: month });
  }

  return result.sort((a, b) => a.age - b.age);
}

/**
 * 转换体重记录为生长数据点
 *
 * 月龄 +1 后 Math.floor 取整为图表月份，
 * 同一图表月份内选取最接近该整数值的记录。
 * 图表从第 1 月开始，不保留第 0 月。
 */
export function convertWeightRecordsToGrowthPoints(
  records: WeightRecord[],
  birthDate: Date,
  prematureDays?: number,
): BabyGrowthPoint[] {
  const allPoints = records
    .filter((record) => record.weightTime && record.weight != null && record.weight > 0)
    .map((record) => ({
      age: calculateAge(
        birthDate,
        new Date(record.weightTime),
        prematureDays,
      ),
      value: record.weight as number,
      date: new Date(record.weightTime),
      metric: 'weight' as const,
    }));

  return pickPointsPerMonth(allPoints);
}

/**
 * 转换身长记录为生长数据点
 *
 * 月龄 +1 后 Math.floor 取整为图表月份，
 * 同一图表月份内选取最接近该整数值的记录。
 * 图表从第 1 月开始，不保留第 0 月。
 */
export function convertLengthRecordsToGrowthPoints(
  records: WeightRecord[],
  birthDate: Date,
  prematureDays?: number,
): BabyGrowthPoint[] {
  const allPoints = records
    .filter((record) => record.weightTime && record.height != null && record.height > 0)
    .map((record) => ({
      age: calculateAge(
        birthDate,
        new Date(record.weightTime),
        prematureDays,
      ),
      value: record.height as number,
      date: new Date(record.weightTime),
      metric: 'length' as const,
    }));

  return pickPointsPerMonth(allPoints);
}

/**
 * 获取生长标准数据
 *
 * 根据性别和指标类型从标准数据文件中获取对应数据
 *
 * @param metric - 生长指标类型
 * @param gender - 性别
 * @returns 标准数据数组
 *
 * @example
 * ```ts
 * getStandardData('weight', 'male') // BOYS_WEIGHT_FOR_AGE
 * getStandardData('length', 'female') // GIRLS_LENGTH_FOR_AGE
 * ```
 */
export function getStandardData(
  metric: GrowthMetric,
  gender: Gender,
): GrowthStandardPoint[] | WeightForLengthPoint[] {
  const isMale = gender === 'male';

  switch (metric) {
    case 'weight':
      return isMale ? BOYS_WEIGHT_FOR_AGE : GIRLS_WEIGHT_FOR_AGE;
    case 'length':
      return isMale ? BOYS_LENGTH_FOR_AGE : GIRLS_LENGTH_FOR_AGE;
    case 'bmi':
      return isMale ? BOYS_BMI_FOR_AGE : GIRLS_BMI_FOR_AGE;
    case 'headCircumference':
      return isMale
        ? BOYS_HEAD_CIRCUMFERENCE_FOR_AGE
        : GIRLS_HEAD_CIRCUMFERENCE_FOR_AGE;
    default:
      return [];
  }
}

/**
 * 转换标准数据为图表数据点
 *
 * 将标准数据转换为图表可用的数据点数组，每个百分位值转换为独立数据点
 *
 * @param standardData - 标准数据数组
 * @param metric - 生长指标类型
 * @returns 图表数据点数组
 *
 * @example
 * ```ts
 * const standardData = [
 *   { month: 0, p3: 2.8, p10: 3.0, p25: 3.2, p50: 3.5, p75: 3.7, p90: 4.0, p97: 4.2 }
 * ];
 * convertStandardToChartData(standardData, 'weight');
 * // [
 * //   { age: 0, value: 2.8, type: 'p3' },
 * //   { age: 0, value: 3.0, type: 'p10' },
 * //   ...
 * // ]
 * ```
 */
export function convertStandardToChartData(
  standardData: (GrowthStandardPoint | WeightForLengthPoint)[],
  metric: GrowthMetric,
): GrowthChartDataPoint[] {
  const percentiles = ['p3', 'p10', 'p25', 'p50', 'p75', 'p90', 'p97'] as const;

  const result: GrowthChartDataPoint[] = [];

  for (const point of standardData) {
    const key = metric === 'weight' && 'length' in point ? 'length' : 'month';
    const age = point[key as keyof typeof point] as number;

    for (const percentile of percentiles) {
      const value = point[percentile] as number;
      if (typeof value === 'number') {
        result.push({
          age,
          value,
          type: percentile,
        });
      }
    }
  }

  return result;
}

/**
 * 合并标准和实际数据用于图表展示
 *
 * @param standardData - 标准数据点数组
 * @param babyData - 婴儿实际数据点数组
 * @returns 合并后的图表数据点数组
 *
 * @example
 * ```ts
 * const standardData = [{ age: 0, value: 2.8, type: 'p3' }];
 * const babyData = [{ age: 0.5, value: 3.2, date: new Date(), metric: 'weight' }];
 * mergeDataForChart(standardData, babyData);
 * // [
 * //   { age: 0, value: 2.8, type: 'p3' },
 * //   { age: 0.5, value: 3.2, type: 'actual', date: Date }
 * // ]
 * ```
 */
export function mergeDataForChart(
  standardData: GrowthChartDataPoint[],
  babyData: BabyGrowthPoint[],
): GrowthChartDataPoint[] {
  const actualDataPoints: GrowthChartDataPoint[] = babyData.map((point) => ({
    age: point.age,
    value: point.value,
    type: 'actual',
    date: point.date,
  }));

  return [...standardData, ...actualDataPoints].sort(
    (a, b) => a.age - b.age || a.type.localeCompare(b.type),
  );
}

/**
 * 计算百分位数和评估
 *
 * 根据给定值、年龄、指标类型和性别，计算其在标准数据中的百分位数
 * 并提供生长评估结果
 *
 * @param value - 测量值
 * @param age - 年龄（月）
 * @param metric - 生长指标类型
 * @param gender - 性别
 * @returns 生长评估结果
 *
 * @example
 * ```ts
 * calculatePercentile(3.5, 0, 'weight', 'male');
 * // {
 * //   percentile: 50,
 * //   status: 'normal',
 * //   advice: '体重正常，继续保持'
 * // }
 * ```
 */
export function calculatePercentile(
  value: number,
  age: number,
  metric: GrowthMetric,
  gender: Gender,
): GrowthAssessment {
  const standardData = getStandardData(metric, gender);

  if (standardData.length === 0) {
    return {
      percentile: 0,
      status: 'normal',
      advice: '暂无标准数据对比',
    };
  }

  // 查找对应年龄的标准数据
  const ageKey = metric === 'weight' && 'length' in standardData[0] ? 'length' : 'month';
  let targetPoint = standardData.find(
    (point) => point[ageKey as keyof typeof point] === age,
  );

  // 如果没有精确匹配，进行线性插值
  if (!targetPoint) {
    const sortedData = [...standardData].sort(
      (a, b) =>
        (a[ageKey as keyof typeof a] as number) -
        (b[ageKey as keyof typeof b] as number),
    );

    const lowerIndex = sortedData.findIndex(
      (point) => (point[ageKey as keyof typeof point] as number) > age,
    ) - 1;

    if (lowerIndex >= 0 && lowerIndex < sortedData.length - 1) {
      const lower = sortedData[lowerIndex];
      const upper = sortedData[lowerIndex + 1];
      const lowerAge = lower[ageKey as keyof typeof lower] as number;
      const upperAge = upper[ageKey as keyof typeof upper] as number;
      const ratio = (age - lowerAge) / (upperAge - lowerAge);

      targetPoint = {
        month: age,
        p3:
          (lower.p3 * (1 - ratio) + upper.p3 * ratio),
        p10:
          (lower.p10 * (1 - ratio) + upper.p10 * ratio),
        p25:
          (lower.p25 * (1 - ratio) + upper.p25 * ratio),
        p50:
          (lower.p50 * (1 - ratio) + upper.p50 * ratio),
        p75:
          (lower.p75 * (1 - ratio) + upper.p75 * ratio),
        p90:
          (lower.p90 * (1 - ratio) + upper.p90 * ratio),
        p97:
          (lower.p97 * (1 - ratio) + upper.p97 * ratio),
      };
    }
  }

  if (!targetPoint) {
    return {
      percentile: 0,
      status: 'normal',
      advice: '年龄超出标准数据范围',
    };
  }

  // 计算百分位数
  const percentiles = [
    { rank: 3, value: targetPoint.p3 },
    { rank: 10, value: targetPoint.p10 },
    { rank: 25, value: targetPoint.p25 },
    { rank: 50, value: targetPoint.p50 },
    { rank: 75, value: targetPoint.p75 },
    { rank: 90, value: targetPoint.p90 },
    { rank: 97, value: targetPoint.p97 },
  ];

  let percentile = 50;
  for (let i = 0; i < percentiles.length - 1; i++) {
    if (
      value >= percentiles[i].value &&
      value <= percentiles[i + 1].value
    ) {
      const lowerRank = percentiles[i].rank;
      const upperRank = percentiles[i + 1].rank;
      const lowerValue = percentiles[i].value;
      const upperValue = percentiles[i + 1].value;

      if (upperValue !== lowerValue) {
        percentile =
          lowerRank +
          ((value - lowerValue) / (upperValue - lowerValue)) *
            (upperRank - lowerRank);
      } else {
        percentile = lowerRank;
      }
      break;
    }
  }

  // 处理超出范围的情况
  if (value < targetPoint.p3) {
    percentile = Math.max(0, (value / targetPoint.p3) * 3);
  } else if (value > targetPoint.p97) {
    percentile = 97 + ((value - targetPoint.p97) / targetPoint.p97) * 3;
  }

  percentile = Math.round(percentile);

  // 生成评估和建议
  let status: 'low' | 'normal' | 'high';
  let advice: string;

  const metricNames: Record<GrowthMetric, string> = {
    weight: '体重',
    length: '身长',
    bmi: 'BMI',
    headCircumference: '头围',
  };

  const metricName = metricNames[metric];

  if (percentile < 3) {
    status = 'low';
    advice = `${metricName}偏低（P${percentile}），建议咨询医生进行专业评估`;
  } else if (percentile > 97) {
    status = 'high';
    advice = `${metricName}偏高（P${percentile}），建议咨询医生进行专业评估`;
  } else if (percentile < 25) {
    status = 'normal';
    advice = `${metricName}正常（P${percentile}），处于中下水平，注意营养均衡`;
  } else if (percentile > 75) {
    status = 'normal';
    advice = `${metricName}正常（P${percentile}），处于中上水平，继续保持`;
  } else {
    status = 'normal';
    advice = `${metricName}正常（P${percentile}），处于中等水平，保持良好习惯`;
  }

  return {
    percentile,
    status,
    advice,
  };
}

/**
 * 计算纠正年龄（考虑早产天数）
 *
 * @param babyInfo - 宝宝信息
 * @param measurementDate - 测量日期
 * @returns 纠正后的年龄（月）
 */
export function calculateCorrectedAge(
  babyInfo: Pick<BabyInfo, 'birthDate' | 'prematureDays'>,
  measurementDate: Date,
): number {
  return calculateAge(
    babyInfo.birthDate,
    measurementDate,
    babyInfo.prematureDays || 0,
  );
}

/**
 * 验证数据是否在标准范围内
 *
 * @param age - 年龄（月）
 * @param metric - 生长指标类型
 * @returns 是否在标准数据范围内
 */
export function isWithinStandardRange(
  age: number,
  metric: GrowthMetric,
): boolean {
  // 标准数据范围：0-84月（7岁）
  const maxAge = 84;
  return age >= 0 && age <= maxAge;
}
