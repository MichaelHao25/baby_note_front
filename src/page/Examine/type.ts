export interface CardItemType {
    criterionName: string
    criterionId: string
    dimensionSize: number
    icon: string
    userName: string
    repulseDate: number
    userId: string
    score: number
    dimensionJsons: DimensionJson[]
    scoreLevelType: number
    criterionAttrJsons: CriterionAttrJson[]
    dataTime: string
    id: string
    time: string
    status: number
    desc: string
}

export interface DimensionJson {
    name: string
    value: string
}

export interface CriterionAttrJson {
    id: string
    createDate: string
    criterionId: string
    type: number
    seq: number
    name: string
    options?: any[]
    createUserId: string
    status: number
    desc: string
    fileUploadingStatus: number
    row: number
    inputType: number
    teacherAttrDocs: TeacherAttrDoc[]
}

export interface TeacherAttrDoc {
    id: string
    createDate: string
    lastModifiedDate: string
    schoolCode: string
    year: number
    term: number
    status: number
    userId: string
    teacherRecordId: string
    criterionId: string
    criterionAttrId: string
    answer?: string
    chooses: any[]
    lat: number
    lng: number
    fileJsons: FileJson[]
}

export interface FileJson {
    id: string
    url: string
    fileName: string
    mimeType: string
    fileMineType: string
    size: number
}
