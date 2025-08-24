export interface TeacherItem {
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
  showSubjectGradeMap: ShowSubjectGradeMap;
  subjectGrades?: SubjectGrades;
  orgSubjectGrades: OrgSubjectGrades;
}

export interface TeachAge {
  startDate: number;
}

export interface UserPower {
  grades?: string[];
  subjects?: string[];
}

export interface ShowSubjectGradeMap {
  语文?: string[];
  道法?: string[];
  "拓展（体）"?: string[];
  美术?: string[];
  "拓展（心）"?: string[];
  唱游?: string[];
  英语?: string[];
  拓展?: string[];
  体健?: string[];
  数学?: string[];
  探究?: string[];
  "拓展（科）"?: string[];
  科技?: string[];
  体育?: string[];
  信息科技?: string[];
  音乐?: string[];
}

export interface SubjectGrades {}

export interface OrgSubjectGrades {
  语文?: string[];
  道法?: string[];
  "拓展（体）"?: string[];
  美术?: string[];
  "拓展（心）"?: string[];
  唱游?: string[];
  英语?: string[];
  拓展?: string[];
  体健?: string[];
  数学?: string[];
  探究?: string[];
  "拓展（科）"?: string[];
  科技?: string[];
  体育?: string[];
  信息科技?: string[];
  音乐?: string[];
}
