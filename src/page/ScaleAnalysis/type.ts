export interface ScaleItem {
  criterion: Criterion[];
  name: string;
  id: string;
}

export interface Criterion {
  name: string;
  id: string;
  type: number;
  criterionTitleInfos?: CriterionTitleInfo[];
}

export interface CriterionTitleInfo {
  id: string;
  createDate: string;
  lastModifiedDate: string;
  name: string;
  criterionId: string;
  seq: number;
  schoolCode: string;
  status: number;
}

export interface RecordItem {
  criterion: Criterion[];
  name: string;
  id: string;
}

export interface Criterion {
  name: string;
  id: string;
  type: number;
  criterionTitleInfos?: CriterionTitleInfo[];
}

export interface CriterionTitleInfo {
  id: string;
  createDate: string;
  lastModifiedDate: string;
  name: string;
  criterionId: string;
  seq: number;
  schoolCode: string;
  status: number;
}
