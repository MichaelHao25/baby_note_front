export interface MainDataType {
    name: string
    id: string
    child: Child[]
}

export interface Child {
    evalTeacherCount: number
    infoReviewType: number
    allSize: number
    evalCount: number
    subjects: string[]
    evalBatchReview: number
    type: number
    parentName: string
    teacher: Teacher[]
    finishSize: number
    name: string
    id: string
}

export interface Teacher {
    name: string
    id: string
    power: Power
}

export interface Power {
    一年级: string[]
    二年级: string[]
    三年级: string[]
    四年级: string[]
    五年级: string[]
}
