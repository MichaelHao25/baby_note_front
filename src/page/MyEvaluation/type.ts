export interface CardItemType {
  teacherAttrObjectList: TeacherAttrObjectList[];
  criterion: string;
  evalCount: number;
  evalUserId: string;
  userName: string;
  userId: string;
  repulses: Repulses;
  photoUrl: string;
  parentName: string;
  criterionType: number;
  dataTime: string;
  levelSum: string;
  viewType: number;
  name: string;
  reviewStatus: number;
  id: string;
  detail: boolean;
  status: number;
  desc: string;
  createDate: string;
}

export interface Repulses {
  remark: string;
  backDate: string;
  userId: string;
  status: number;
  userName: string;
}

export interface TeacherAttrObjectList {
  answer: string;
  teacherFileDocs: TeacherFileDoc[];
  name: string;
  options: any[];
  type: number;
}

export interface TeacherFileDoc {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  fileMineType: string;
  size: number;
}
