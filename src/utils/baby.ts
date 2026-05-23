import dayjs from "dayjs";

/**
 * 生肖顺序：鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪
 * 对应年份末位：4,5,6,7,8,9,10,11,0,1,2,3
 */
const ZODIAC_LIST = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

/**
 * 根据出生年份计算属相
 */
export function getZodiac(birthDate: Date | string): string {
  const year = dayjs(birthDate).year();
  return ZODIAC_LIST[(year - 4) % 12];
}

/**
 * 计算出生天数
 */
export function getDaysSinceBirth(birthDate: Date | string): number {
  return dayjs().diff(dayjs(birthDate), "day");
}

/**
 * 计算年龄，格式为 X岁X月X天
 */
export function getAge(birthDate: Date | string): string {
  const birth = dayjs(birthDate);
  const now = dayjs();

  const years = now.diff(birth, "year");
  const afterYears = birth.add(years, "year");
  const months = now.diff(afterYears, "month");
  const afterMonths = afterYears.add(months, "month");
  const days = now.diff(afterMonths, "day");

  const parts: string[] = [];
  if (years > 0) parts.push(`${years}岁`);
  if (months > 0) parts.push(`${months}个月`);
  if (days > 0 || parts.length === 0) parts.push(`${days}天`);
  return parts.join("") || "0天";
}

/** 属相到 emoji 的映射 */
const ZODIAC_EMOJI: Record<string, string> = {
  "鼠": "🐭",
  "牛": "🐮",
  "虎": "🐯",
  "兔": "🐰",
  "龙": "🐲",
  "蛇": "🐍",
  "马": "🐴",
  "羊": "🐑",
  "猴": "🐵",
  "鸡": "🐔",
  "狗": "🐶",
  "猪": "🐷",
};

/** 获取属相对应 emoji */
export function getZodiacEmoji(birthDate: Date | string): string {
  return ZODIAC_EMOJI[getZodiac(birthDate)] ?? "";
}

/** 纠正天数（实际天数减去早产天数） */
export function getCorrectedDaysSinceBirth(birthDate: Date | string, prematureDays: number): number {
  return getDaysSinceBirth(birthDate) - prematureDays;
}

/** 纠正年龄（基于纠正后的天数计算） */
export function getCorrectedAge(birthDate: Date | string, prematureDays: number): string {
  const correctedDate = dayjs(birthDate).add(prematureDays, "day");
  return getAge(correctedDate.toDate());
}