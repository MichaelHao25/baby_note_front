import dayjs from "dayjs";

/**
 * 生长指标类型
 */
export type GrowthMetricType = 'weight' | 'height' | 'bmi' | 'headCircumference';

/**
 * 生长指标显示名称
 */
export const METRIC_LABELS: Record<GrowthMetricType, string> = {
  weight: '体重',
  height: '身长',
  bmi: 'BMI',
  headCircumference: '头围'
};

/**
 * 生长指标单位
 */
export const METRIC_UNITS: Record<GrowthMetricType, string> = {
  weight: 'kg',
  height: 'cm',
  bmi: '',
  headCircumference: 'cm'
};

/**
 * 体重记录数据接口
 */
export interface WeightRecord {
  _id: string;
  weight?: number;
  height?: number;
  weightTime: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 宝宝信息接口
 */
export interface BabyInfo {
  _id: string;
  name: string;
  birthDate: string;
  prematureDays: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 生长数据点接口
 */
export interface GrowthDataPoint {
  date: string;
  value: number;
  ageDays: number;
  correctedAgeDays?: number;
  note?: string;
}

/**
 * 生长评估结果接口
 */
export interface GrowthAssessment {
  metric: GrowthMetricType;
  current: {
    value: number;
    date: string;
    ageDays: number;
  };
  trend: 'growing' | 'stable' | 'declining';
  growthRate: number; // 单位/天
  assessment: string; // 评估结论
  advice: string; // 建议
  status: 'normal' | 'attention' | 'warning';
}

/**
 * 将体重记录转换为生长数据点
 */
export function transformWeightToGrowthData(
  records: WeightRecord[],
  birthDate: string,
  prematureDays: number = 0
): GrowthDataPoint[] {
  if (!records || records.length === 0) return [];

  const birth = dayjs(birthDate);

  return records
    .filter(record => record.weight != null && record.weight !== '')
    .map(record => {
      const recordDate = dayjs(record.weightTime);
      const ageDays = recordDate.diff(birth, 'day');
      const correctedAgeDays = prematureDays > 0 ? ageDays - prematureDays : undefined;

      return {
        date: record.weightTime,
        value: Number(record.weight),
        ageDays,
        correctedAgeDays,
        note: record.note
      };
    })
    .sort((a, b) => a.ageDays - b.ageDays);
}

/**
 * 计算BMI（体重kg / 身高m²）
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm || heightCm === 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

/**
 * 计算生长评估
 */
export function assessGrowth(
  data: GrowthDataPoint[],
  metric: GrowthMetricType,
  birthDate: string
): GrowthAssessment | null {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => a.ageDays - b.ageDays);
  const current = sortedData[sortedData.length - 1];

  // 计算增长率
  let growthRate = 0;
  let trend: GrowthAssessment['trend'] = 'stable';

  if (sortedData.length >= 2) {
    const recent = sortedData.slice(-7); // 最近7次记录
    const oldest = recent[0];
    const newest = recent[recent.length - 1];
    const daysDiff = newest.ageDays - oldest.ageDays;

    if (daysDiff > 0) {
      growthRate = Number(((newest.value - oldest.value) / daysDiff).toFixed(4));
    }

    // 判断趋势
    if (growthRate > 0.001) {
      trend = 'growing';
    } else if (growthRate < -0.001) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }
  }

  // 根据不同指标和年龄进行评估
  const ageDays = current.ageDays;
  const { assessment, advice, status } = getMetricAssessment(
    metric,
    current.value,
    ageDays,
    trend
  );

  return {
    metric,
    current: {
      value: current.value,
      date: current.date,
      ageDays: current.ageDays
    },
    trend,
    growthRate,
    assessment,
    advice,
    status
  };
}

/**
 * 根据指标和年龄获取评估结果
 */
function getMetricAssessment(
  metric: GrowthMetricType,
  value: number,
  ageDays: number,
  trend: GrowthAssessment['trend']
): Pick<GrowthAssessment, 'assessment' | 'advice' | 'status'> {
  const ageMonths = Math.floor(ageDays / 30);

  // 这里使用简化的评估逻辑，实际应用中应该参考WHO标准
  let status: GrowthAssessment['status'] = 'normal';
  let assessment = '';
  let advice = '';

  if (metric === 'weight') {
    if (ageMonths < 6) {
      if (value < 3) {
        status = 'warning';
        assessment = '体重偏低';
        advice = '建议咨询儿科医生，可能需要加强营养';
      } else if (value < 5) {
        status = 'attention';
        assessment = '体重偏轻';
        advice = '注意观察宝宝吃奶情况，确保充足摄入';
      } else {
        assessment = '体重正常';
        advice = '继续保持良好的喂养习惯';
      }
    } else if (ageMonths < 12) {
      if (value < 6) {
        status = 'warning';
        assessment = '体重偏低';
        advice = '建议添加辅食，增加营养密度';
      } else if (value < 7.5) {
        status = 'attention';
        assessment = '体重偏轻';
        advice = '可适当增加辅食种类和数量';
      } else {
        assessment = '体重正常';
        advice = '继续保持均衡饮食';
      }
    } else {
      if (value < 8) {
        status = 'warning';
        assessment = '体重偏低';
        advice = '建议咨询医生检查是否存在营养问题';
      } else if (value < 9) {
        status = 'attention';
        assessment = '体重偏轻';
        advice = '注意饮食均衡，确保营养充足';
      } else {
        assessment = '体重正常';
        advice = '继续保持健康饮食';
      }
    }

    // 根据趋势调整建议
    if (trend === 'declining') {
      if (status === 'normal') status = 'attention';
      advice += '；近期体重有下降趋势，请密切关注';
    } else if (trend === 'growing') {
      assessment += '，增长良好';
    }
  }

  return { assessment, advice, status };
}

/**
 * 格式化日期标签
 */
export function formatDateLabel(date: string): string {
  const d = dayjs(date);
  if (d.date() === 1 && d.month() === 0) {
    return d.format('YYYY年');
  }
  if (d.date() === 1) {
    return d.format('M月');
  }
  return d.format('D日');
}

/**
 * 获取图表颜色
 */
export function getMetricColor(metric: GrowthMetricType): string {
  const colors: Record<GrowthMetricType, string> = {
    weight: '#1790ff',
    height: '#52c41a',
    bmi: '#faad14',
    headCircumference: '#722ed1'
  };
  return colors[metric] || '#1790ff';
}

/**
 * 线性插值填充缺失数据
 */
export function interpolateData(data: GrowthDataPoint[]): GrowthDataPoint[] {
  if (data.length === 0) return data;

  const valuePoints = data
    .map((item, index) => ({ index, value: item.value }))
    .filter(item => item.value !== null && item.value !== undefined);

  if (valuePoints.length === 0) return data;

  if (valuePoints.length === 1) {
    return data.map(item => ({
      ...item,
      value: valuePoints[0].value
    }));
  }

  return data.map((item, index) => {
    if (item.value !== null && item.value !== undefined) {
      return item;
    }

    const prevPoint = valuePoints.filter(p => p.index < index).pop();
    const nextPoint = valuePoints.find(p => p.index > index);

    if (!prevPoint && nextPoint) {
      return { ...item, value: nextPoint.value };
    }
    if (prevPoint && !nextPoint) {
      return { ...item, value: prevPoint.value };
    }
    if (!prevPoint && !nextPoint) {
      return item;
    }

    const ratio = (index - prevPoint.index) / (nextPoint.index - prevPoint.index);
    const interpolatedValue = Number(
      (prevPoint.value + ratio * (nextPoint.value - prevPoint.value)).toFixed(2)
    );

    return { ...item, value: interpolatedValue };
  });
}
