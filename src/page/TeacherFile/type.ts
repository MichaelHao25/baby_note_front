export interface AreaItem {
  id: string;
  createDate: string;
  name: string;
  aliase: null;
  levelDesc: null | string;
  parentId: ParentID | null;
  evalMode: null;
  criterionId: CriterionID;
  schoolCode: SchoolCode;
  seq: number;
  scoreLevel: ScoreLevel;
  childs: AreaItem[] | null;
  editStatus: null;
  dimeFroms: DimeFrom[];
  userTaskScoreJson: null;
  rowIndex: number;
  indexCount: null;
  orgIndexCount: null;
  orgIndexUsers: null;
  parentName: null;
  newId: null;
  followId: null;
  fieldTickInfos: null;
  coreQualityDocIds: null;
  coreQualityJsons: null;
  rgb: null;
  cell: string;
  calculationRules: CalculationRule[];
  type: number;
  isError: boolean;
  errorMessages: any[];
  commentTip: CommentTip;
  leafNoteNum: null;
  toScore: null;
  calculateParameter: null;
  fullName: null;
  fromId: null;
  hide: boolean;
  zero: boolean;
  sourceDesc: null;
  aboveDimensionId: null;
  max: number | null;
  note: boolean;
  noteStr: null;
  copyFromId: null;
  rootId: string;
  levelToNode: boolean;
  gradeIndex: number;
  orgIndexMap: null;
  hideType: number;
  lineType: number;
  syncInfo: null;
  evalDoc: null;
}

export interface CalculationRule {
  expression: string;
  evaluationType: number;
  existSource: boolean;
  isValid: boolean;
  sourceIds: any[];
  desc: null;
  teacherExpressionType: number;
  max: number | null;
  evaluationDesc: null | string;
  pointsType: null;
  pointsCalculateExpression: null;
  points: null;
  timeLimitType: null;
  minYear: null;
  maxYear: null;
  workComputeType: number;
  valid: boolean;
}

export enum CommentTip {
  请输入文本 = "请输入文本",
}

export enum CriterionID {
  The659C32Ea4413762A879C3A56 = "659c32ea4413762a879c3a56",
}

export interface DimeFrom {
  taskId: null;
  dimensionId: null | string;
  type: number;
  fromId: null;
  criterionId: null | string;
  testId: null;
  coorId: null;
  workId: null;
  normId: null;
  healthItemId: null;
  cell: string;
  name: null | string;
  ruleName: null;
  criterionClassId: null;
  ruleId: null | string;
  index: null | string;
  dimensionName: null | string;
  indexName: null;
  standardType: number;
  examinationTypes: null;
  rateType: number;
  rate: number;
  task: boolean;
  cal: boolean;
  criterion: boolean;
}

export enum ParentID {
  The659C32Eb4413762A879C3A57 = "659c32eb4413762a879c3a57",
  The659C411E4413762A879C3A5D = "659c411e4413762a879c3a5d",
  The659C41244413762A879C3A60 = "659c41244413762a879c3a60",
  The659C41294413762A879C3A63 = "659c41294413762a879c3a63",
}

export enum SchoolCode {
  Rbi850 = "RBI850",
}

export interface ScoreLevel {
  id: ID;
  createDate: CreateDate;
  scoreType: number;
  enterScoreMap: null;
  enterRule: null;
  min: number;
  max: number;
  ladderCount: number;
  schoolCode: SchoolCode;
  levels: LevelElement[];
  seq: number;
  defaultIndex: number;
  defaultTeacherScore: null;
  featureIndex: number;
  featureTeacherScore: null;
  scoreName: null;
  desc: null;
  row: number;
  requiredFile: number;
  inputType: number;
  indexs: any[];
  scoreTypeDesc: ScoreTypeDesc;
}

export enum CreateDate {
  The20231227154631 = "2023/12/27 15:46:31",
}

export enum ID {
  The658Bd6575529C00Da15Ead1B = "658bd6575529c00da15ead1b",
}

export interface LevelElement {
  level: LevelEnum;
  desc: null;
  score: number;
  specialScore: number;
  scoreMap: null;
  seq: number;
  hide: boolean;
  comment: null;
  oldIndex: number;
  objectId: null;
  syncValue: null;
}

export enum LevelEnum {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

export enum ScoreTypeDesc {
  等第标准 = "等第标准",
}

export interface RecordItem {
  participation: number;
  criterionDatas: CriterionData[];
}

export interface CriterionData {
  criterionName: string;
  size: number;
  criterionId: string;
  submitTeacherCount: number;
  record: Record[];
}

export interface Record {
  teacherAttrObjectList: TeacherAttrObjectList[];
  criterion: string;
  teacherName: string;
  repulses: Repulses;
  parentName: string;
  criterionType: number;
  dataTime: string;
  levelSum: string;
  viewType: number;
  name: string;
  id: string;
  status: number;
  desc: string;
  createDate: string;
}

export interface Repulses {
  remark: string;
  backDate: string;
  userId: string;
  status: number;
}

export interface TeacherAttrObjectList {
  answer: Answer;
  teacherFileDocs: TeacherFileDoc[];
  name: Name;
  options: any[];
  type: number;
}

export enum Answer {
  Empty = "",
  五1班 = "五1班",
  学校 = "学校",
}

export enum Name {
  事件发生地点 = "事件发生地点",
  记录说明 = "记录说明",
  附件提交 = "附件提交",
}

export interface TeacherFileDoc {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  fileMineType: string;
  size: number;
}
