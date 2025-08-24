export const formatTeachNumber = (teachNumber: number) => {
  if (!teachNumber) return teachNumber;

  const year = Math.floor(teachNumber / 12).toFixed(0);
  const month = teachNumber % 12;

  return `${year}年${month}月`;
};
