export interface UserInfoType {
  id: string;
  createDate: string;
  education: number;
  age: number;
  teachAges: TeachAge[];
  userId: string;
  schoolCode: string;
  ageNumber: number;
  teachNumber: number;
  computeCriterionId: string[];
  type: number;
  computeCriterionName: string[];
  userName: string;
  url: string;
  gender: string;
  userPower: UserPower;
  joinType: number;
  useComputCriterionMap: UseComputCriterionMap;
}

export interface TeachAge {
  startDate: number;
}

export interface UseComputCriterionMap {
  "659c32ea4413762a879c3a56": boolean;
}

export interface UserPower {
  grades: string[];
  subjects: string[];
}

export interface RecordItem {
  submitCount: number;
  finishCount: number;
  recordCount: number;
  name: string;
  id: string;
  childs?: RecordItem[];
  status: number;
  datas?: Data[];
}

export interface Data {
  dateHint: DateHint;
  criterionId: string;
  evlaueCount: number;
  finishCount: number;
  name: string;
  viewType: number;
  dataTypeAsk: number;
  evalTeacher: boolean;
  relationId: string;
  criterionClassId: string;
  type: number;
}

export enum DateHint {
  记录归属日期 = "记录归属日期",
}

export interface FindTreeItem {
  id: string;
  createDate: string;
  name: string;
  aliase: null;
  levelDesc: string;
  parentId: null;
  evalMode: null;
  criterionId: string;
  schoolCode: string;
  seq: number;
  scoreLevel: ScoreLevel;
  childs: null;
  editStatus: null;
  dimeFroms: null;
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
  calculationRules: null;
  type: number;
  isError: boolean;
  errorMessages: any[];
  commentTip: string;
  leafNoteNum: null;
  toScore: null;
  calculateParameter: null;
  fullName: null;
  fromId: null;
  hide: boolean;
  zero: boolean;
  sourceDesc: null;
  aboveDimensionId: null;
  max: null;
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

export interface ScoreLevel {
  id: string;
  createDate: string;
  scoreType: number;
  enterScoreMap: null;
  enterRule: null;
  min: number;
  max: number;
  ladderCount: number;
  schoolCode: string;
  levels: Level[];
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
  scoreTypeDesc: string;
}

export interface Level {
  level: string;
  desc: string;
  score: number;
  specialScore: number;
  scoreMap: ScoreMap;
  seq: number;
  hide: boolean;
  comment: null;
  oldIndex: number;
  objectId: null;
  syncValue: null;
}

export interface ScoreMap {}
