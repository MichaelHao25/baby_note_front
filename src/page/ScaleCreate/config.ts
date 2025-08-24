// 量表创建页面配置项

// 类型选项
export const focusTypeOptions = [
    { name: "自评", value: 0 },
    { name: "他评", value: 1 },
    { name: "听评课", value: 2 },
];

// 状态选项
export const focusStatusOptions = [
    { name: "正常", value: 0 },
    { name: "停用", value: 1 },
];

// 听课性质选项
export const codeClassEvalsOptions = [
    { name: "随堂课", value: 0 },
    { name: "公开课", value: 1 },
];

// 记录班级选项
export const selectOrgOptions = [
    { name: "否", value: 0 },
    { name: "是", value: 1 },
];

// 专家评价选项
export const evalTypeOptions = [
    { name: "无", value: 0 },
    { name: "有", value: 1 },
];

// 学科性质选项
export const subjectTypeOptions = [
    { name: "无", value: 0 },
    { name: "有", value: 1 },
];

// 自评能力选项
export const selfEvalTypeOptions = [
    { name: "不能", value: 0 },
    { name: "能，结果不统计", value: 1 },
    { name: "能，结果进行统计", value: 2 },
];

// 评价时学科显示规则选项
export const subjectFilterTypeOptions = [
    { name: "根据老师的带班", value: 0 },
    { name: "显示所有学科", value: 1 },
];

// 审核模式选项
export const auditTypeOptions = [
    { name: "审核面板", value: 0 },
    { name: "他评面板", value: 1 },
];

// 审核人/评价人选项
export const auditorOptions = [
    { name: "无需审核", value: 0 },
    { name: "指定教师", value: 1 },
];

// 被评价人选项
export const evaluationObjectOptions = [
    { name: "全体教师", value: 0, type: 0 },
    { name: "班主任", value: 3, type: 3 },
    { name: "限定职称", value: 1, type: 1 },
    { name: "限定教师", value: 2, type: 2 },
];

// 激励话选项
export const submitShowMessageOptions = [
    { name: "不出现", value: 0 },
    { name: "出现", value: 1 },
];

// 管理员查看权限选项
export const adminShowOptions = [
    { name: "不能看", value: 0 },
    { name: "能看", value: 1 },
];

// 被评价人结果显示选项
export const seeTypeOptions = [
    { name: "能看，只能看最终汇总结果", value: 0 },
    { name: "能看明细", value: 1 },
    { name: "不能看", value: 2 },
];

// 评价人查看权限选项
export const evalCheckPowerOptions = [
    { name: "能看", value: 0 },
    { name: "不能看", value: 1 },
];

// 非管理层老师结果显示选项
export const checkPowerTypeOptions = [
    { name: "能看，只能看最终汇总结果", value: 0 },
    { name: "能看明细", value: 1 },
];

// 次数要求/计划轮次选项
export const mustDoIndexOptions = [
    { name: "每学期", value: 0 },
    { name: "每学年", value: 1 },
    { name: "限定时间段内", value: 2 },
];

// 要求性质选项
export const dataTypeAskOptions = [
    { name: "仅做提示", value: 0 },
    { name: "限制提交次数", value: 1 },
];

// 评价次数选项
export const evalCountOptions = [
    { name: "只能被评1次", value: 0 },
    { name: "不限，可被多位老师评价，但1个老师只能评1次", value: 1 },
    { name: "不限，可任意多次评价", value: 2 },
];

// 审核模式选项
export const evalBatchReviewOptions = [
    { name: "无", value: 0 },
    { name: "有", value: 1 },
];
