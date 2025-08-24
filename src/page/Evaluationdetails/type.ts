export interface SubjectItem {
    id: string
    createDate: string
    lastModifiedDate: string
    subject: string
    seq: number
    show: number
    schoolCode: string
    gradeName?: string;
}


export interface YearItem {
    grade: string
    year: number
    organizationJsonList: OrganizationJsonList[]
}

export interface OrganizationJsonList {
    id: string
    createDate: string
    objectId: any
    type: number
    groupId: string
    name: string
    code: string
    ownerId: any
    year: number
    studentCount: number
    status: number
    seq: number
    num: string
    subjects: any
    headmaster: boolean
    schoolCode: string
    date: number
    addressId: any
    studentUsers: any
    orgTeachers: OrgTeacher[]
    grade: string
}

export interface OrgTeacher {
    userId: string
    subject: string
    type: number
}

export interface TeacherItem {
    data: Daum[]
    evalCount: number
    subjects: string[]
    name: string
    icon: string
    orgList: string[]
    userId: string
    mark: boolean
}

export interface Daum {
    evalBatchCheckMap: any[]
    evalUserId: string
    level: string
    userName: string
    userId: string
    score: number
    dataTime: string
    reviewInfoScores: any[]
    teacherRecordId: string
    evalUserName: string
    evalTime: string
    desc: string
    status: number
}


export interface EvalItem {
    id: string
    createDate: string
    name: string
    aliase: any
    levelDesc: string
    parentId: any
    evalMode: any
    criterionId: string
    schoolCode: string
    seq: number
    scoreLevel: ScoreLevel
    childs: any
    editStatus: any
    dimeFroms: any
    userTaskScoreJson: any
    rowIndex: number
    indexCount: any
    orgIndexCount: any
    orgIndexUsers: any
    parentName: any
    newId: any
    followId: any
    fieldTickInfos: any
    coreQualityDocIds: any
    coreQualityJsons: any
    rgb: any
    cell: string
    calculationRules: any
    type: number
    isError: boolean
    errorMessages: any[]
    commentTip: string
    leafNoteNum: any
    toScore: any
    calculateParameter: any
    fullName: any
    fromId: any
    hide: boolean
    zero: boolean
    sourceDesc: any
    aboveDimensionId: any
    max: any
    note: boolean
    noteStr: any
    copyFromId: any
    rootId: string
    levelToNode: boolean
    gradeIndex: number
    orgIndexMap: any
    hideType: number
    lineType: number
    syncInfo: any
    evalDoc: any
}

export interface ScoreLevel {
    id: string
    createDate: string
    scoreType: number
    enterScoreMap: any
    enterRule: any
    min: number
    max: number
    ladderCount: number
    schoolCode: string
    levels: Level[]
    seq: number
    defaultIndex: number
    defaultTeacherScore: any
    featureIndex: number
    featureTeacherScore: any
    scoreName: any
    desc: any
    row: number
    requiredFile: number
    inputType: number
    indexs: any[]
    scoreTypeDesc: string
}

export interface Level {
    level: string
    desc: string
    score: number
    specialScore: number
    scoreMap: ScoreMap
    seq: number
    hide: boolean
    comment: any
    oldIndex: number
    objectId: any
    syncValue: any
}

export interface ScoreMap {}
