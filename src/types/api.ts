import type { Dayjs } from "dayjs";

// 通用响应接口
export interface ApiResponse<T = any> {
    code: number; // 1为成功，0为失败
    msg: string; // 提示消息
    time: string;
    data: T;
}

// 添加新的类型定义
export interface TokenResponse {
    code: number;
    msg: string;
    time: string;
    data: {
        userinfo: {
            id: number;
            username: string;
            nickname: string;
            mobile: string;
            avatar: string;
            score: number;
            token: string;
            user_id: number;
            createtime: number;
            expiretime: number;
            expires_in: number;
        };
        auth: string[];
    };
}

export interface TokenRequest {
    token: string;
    school_id: string;
}

// eexcel 更新接口
export interface UpdateEexcelRequest {
    id: string;
    isshow?: boolean;
    excelName?: string;
    excelNikeName?: string;
    seq?: number;
    // 其他可能需要更新的字段
}

export interface EexcelData {
    id: string;
    createDate: string;
    lastModifiedDate: string;
    criterionId: string;
    objectId: string;
    type: number;
    excelName: string;
    excelNikeName: string;
    seq: number;
    isshow: string | boolean;
    status: number;
    name: string;
    nikeName: string;
    created_at: string;
    updated_at: number;
}

export type UpdateEexcelResponse = ApiResponse<EexcelData>;

// eexcel 列表查询接口
export interface EexcelListRequest {
    criterionId: string;
}

export type EexcelListResponse = ApiResponse<EexcelData[]>;

// eexcel 排序接口
export interface EexcelSeqItem {
    id: string;
    seq: number;
}

export type EexcelSeqRequest = EexcelSeqItem[];

export type EexcelSeqResponse = ApiResponse<any>;

// eexcel 初始化接口
export type EexcelAddRequest = EexcelData[];

export type EexcelAddResponse = ApiResponse<null>;

// 分类相关接口
export interface Category {
    id: number;
    name: string;
    seq: number;
    pid: number;
    schoolCode: string;
    childs?: Category[]; // 子分类是可选的
}

export interface CategoryRequest {
    schoolCode: string;
}

export type CategoryResponse = ApiResponse<Category[]>;

// 学科相关接口
export interface Subject {
    id: number;
    name: string;
    teacher_num: number;
    sort: number;
    show: number;
    image: string;
    create_by: string;
    create_time: string;
    update_by: string;
    update_time: string;
    school_id: number;
    status: number;
    deleted_at: string | null;
}

export interface EvaluateItem {
    name: string;
    id: string;
    list: List[];
}

export interface List {
    evaluationType: number;
    number: number;
    evaluations: string[];
    criterionId: string;
    subjects: any[];
    viewType: number;
    name: string;
    reviewTeachers: string[];
    reviewStatus: number;
    id: string;
    type: number;
    seq: number;
}

export interface UserInfo {
    id: number;
    phone: string;
    name: string;
    no: string;
    avatar: string;
    sex: string;
    master_subject: string;
    target: string;
    extend_json: string;
    create_by: string;
    create_time: Date;
    update_by: string;
    update_time: Date;
    status: number;
    school_id: number;
    department: string;
    class_ids: string;
    uid: number;
    apps: string;
    super: number;
    place: string;
    birthday: Date;
    address: string;
    id_photo: string;
    deleted_at: null;
}

export interface ExamineItem {
    reviewSize: number;
    notReview?: NotReview[];
    review?: NotReview[];
    notReviewSize: number;
}

export interface NotReview {
    criterionName: string;
    criterionId: string;
    dimensionSize: number;
    icon: string;
    userName: string;
    repulseDate: number;
    userId: string;
    score: number;
    dimensionJsons: DimensionJSON[];
    scoreLevelType: number;
    criterionAttrJsons: CriterionAttrJSON[];
    dataTime: string;
    id: string;
    time: string;
    status: number;
    desc: string;
}

export interface CriterionAttrJSON {
    id: string;
    createDate: string;
    criterionId: string;
    type: number;
    seq: number;
    name: string;
    options: any[];
    createUserId: string;
    status: number;
    desc: string;
    fileUploadingStatus: number;
    row: number;
    inputType: number;
    teacherAttrDocs: TeacherAttrDoc[];
}

export interface TeacherAttrDoc {
    id: string;
    createDate: string;
    lastModifiedDate: string;
    schoolCode: string;
    year: number;
    term: number;
    status: number;
    userId: string;
    teacherRecordId: string;
    criterionId: string;
    criterionAttrId: string;
    answer: string;
    chooses: any[];
    lat: number;
    lng: number;
    fileJsons: any[];
}

export interface DimensionJSON {
    name: string;
    value: string;
}

export interface SearchTeacherItem {
    teacherName: string;
    teachers: Teacher[];
}

export interface CalendarItem {
    id: number;
    school_id: number;
    pid: number;
    name: string;
    start_time: Date;
    end_time: Date;
    deleted_at: null;
    created_at: Date;
    updated_at: Date;
}

export type SubjectResponse = ApiResponse<Subject[]>;

// 消息相关接口
export interface SaveMessageRequest {
    // 根据实际需求添加字段
    content: string;
    // 其他字段...
}

export type SaveMessageResponse = ApiResponse<any>;

// 教师搜索相关接口
export interface TeacherUserPower {
    subjects: string[];
    grades: string[];
}

export interface Teacher {
    orgNum: string;
    grade: string;
    name: string;
    id: string;
    userPower: TeacherUserPower;
}

export interface TeacherGroup {
    teacherName: string;
    id: string;
    teachers: Teacher[];
}

export interface TeacherSearchRequest {
    schoolCode: string;
    searchText: string;
    /**
     * 0 搜索姓名
     * 1 选择班主任
     * 2 根据学科选择
     */
    searchType: string;
}

export type TeacherSearchResponse = ApiResponse<TeacherGroup[]>;

// 评价设置 - 量表分类相关接口
export interface UpdateCategoryRequest {
    schoolCode: string;
    name: string;
    id: string;
    childDocs: {
        name: string;
        id?: string;
        seq: number;
    }[];
}

export type UpdateCategoryResponse = ApiResponse<any>;

export interface DeleteCategoryRequest {
    id: string;
}

export type DeleteCategoryResponse = ApiResponse<any>;

export type AddCategoryRequest = UpdateCategoryRequest;
export type AddCategoryResponse = ApiResponse<any>;

// 评价设置 - 量表列表相关接口
export interface EvaluateListRequest {
    focusStatus: number;
    focusType: number;
    parendId: number;
}

export type EvaluateListResponse = ApiResponse<EvaluateItem[]>;

// 评价设置 - 获取ID接口
export type EvaluateGetIdResponse = ApiResponse<string>;

// 我的信息相关接口
export type MyInfoResponse = ApiResponse<UserInfo>;

// 审核面板相关接口
export interface ExamineListRequest {
    schoolCode: string;
    userId: string;
    criterionClassId: string;
    criterionId: string;
    pageNum: number;
    pageCount: number;
    review: boolean;
    isLoading: boolean;
    teacherId: string;
}

export type ExamineListResponse = ApiResponse<ExamineItem[]>;

// 提交审核
export interface PutExamineRequest {
    schoolCode: string;
    userId: string;
    criterionClassId: string;
    criterionId: string;
    pageNum: number;
    pageCount: number;
    review: boolean;
    isLoading: boolean;
    teacherId: string;
}

export type PutExamineResponse = ApiResponse<any>;

// 提交审核
export interface SearchTeacherRequest {
    schoolCode: string;
    searchText: string;
    searchType: string;
}

export type SearchTeacherResponse = ApiResponse<SearchTeacherItem[]>;

// 学期列表
export type CalendarListResponse = ApiResponse<CalendarItem[]>;

// 文件上传相关接口
export interface UploadData {
    url: string;
    fullurl: string;
}

export interface UploadRequest {
    file: File;
}

export type UploadResponse = ApiResponse<UploadData>;

// 属性相关接口
export interface AttrAddRequest {
    criterionId: string;
    type: number;
    name: string;
    seq?: number;
    options?: string[];
    desc?: string;
    descTitle?: string;
    rowNum?: number;
    associationalWord?: string;
    fileUploadingStatus: number;
    inputType?: number;
    fileList?: any[];
}

export interface AttrData {
    id: string;
    name: string;
    optionsList: { name: string }[];
    fileUploadingStatus: number;
    focusIndex: number;
    inputType: number;
    desc: string;
    descTitle: string;
    rowNum: number;
    associationalWord: string;
    fileList: string[];
}

export interface RecordDetail {
    schoolCode: string;
    criterionId: string;
    subject: string;
    userId: string;
    levelSum: string;
    score: number;
    id: string;
    teacherAttrJsons: {
        criterionAttrId: string;
        fileJsons: {
            fileName: string;
            url: string;
            id: string;
            fileMineType: string;
        }[];
        name: string;
        type: number;
        fileUploadingStatus: number;
    }[];
    teacherScoreJsons: {
        dimensionId: string;
        score: number;
        index: number;
        name: string;
        scoreType: number;
        comment: string;
    }[];
    teacherDimensionDataJsons: any[];
    dataTime: number;
    desc: string;
    isLoading: boolean;
}

export interface EvaluateInfo {
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
    teacherShowType: null;
    dateRange: [Dayjs, Dayjs];
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
    levels: {
        level: string;
        desc: string;
        score: number;
        specialScore: number;
        scoreMap: any[];
        seq: number;
        hide: boolean;
        comment: null;
        oldIndex: number;
        objectId: null;
        syncValue: null;
    }[];
    rankingRules: null;
    showType: null;
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

export type AttrAddResponse = ApiResponse<AttrData>;

export interface AttrUpdateRequest extends AttrAddRequest {
    id: string;
}

export type AttrUpdateResponse = ApiResponse<AttrData>;

export interface AttrListRequest {
    criterionId: string;
}

export type AttrListResponse = ApiResponse<AttrData[]>;

export interface AttrDeleteRequest {
    id: string;
}

export type AttrDeleteResponse = ApiResponse<any>;

export interface GetRecordDetailRequest {
    id: string;
}

export type GetRecordDetailResponse = ApiResponse<RecordDetail>;

export interface GetEvaluateInfoRequest {
    id: string;
}

export type GetEvaluateInfoResponse = ApiResponse<EvaluateInfo>;

export interface GetRecordListRequest {
    // schoolCode: string;
    pageSize: number;
    page: number;
}

export type GetRecordListResponse = ApiResponse<EvaluateInfo>;

export interface AddRecordRequest {
    schoolCode: string;
    criterionId: string;
    subject: string;
    userId: string;
    levelSum: string;
    score: number;
    teacherAttrJsons: {
        criterionAttrId: string;
        fileJsons: {
            fileName: string;
            url: string;
            id: string;
            fileMineType: string;
        }[];
        name: string;
        type: number;
        fileUploadingStatus: number;
    }[];
    teacherScoreJsons: {
        dimensionId: string;
        score: number;
        index: number;
        name: string;
        scoreType: number;
        comment: string;
    }[];
    teacherDimensionDataJsons: any[];
    dataTime: number;
    desc: string;
    isLoading: boolean;
}

export interface TeacherItem {
    grade: string;
    id: number;
    name: string;
    orgNum: number;
    subject_id: number;
    subject_name: string;
}

export type AddRecordResponse = ApiResponse<any>;

// 添加评价接口类型定义
export interface AddEvaluateRequest {
    // 空对象，根据需要可以添加参数
}

export type AddEvaluateResponse = ApiResponse<null>;

export interface UpdateEvaluateRequest extends Partial<EvaluateInfo> {
    id: string; // id is required for update
}

export type UpdateEvaluateResponse = ApiResponse<EvaluateInfo>;

// 删除记录接口
export interface DeleteRecordRequest {
    // 空对象，根据需要可以添加参数
    id: string;
}

export type DeleteRecordResponse = ApiResponse<null>;

export type UpdateRecordRequest = AddRecordRequest;
export type UpdateRecordResponse = ApiResponse<null>;

export interface CosStsData {
    Credentials: {
        TmpSecretId: string;
        TmpSecretKey: string;
        Token: string;
    };
    ExpiredTime: number;
    Expiration: string;
    StartTime: number;
    RequestId: string;
}

export type CosStsResponse = ApiResponse<CosStsData>;

export interface GetTeacherListRequest {
    name?: string;
    only_standard_class?: number;
    filter_headmaster?: number;
}
export type GetTeacherLisResponse = ApiResponse<TeacherItem[]>;

export interface GetSubjectListRequest {}
export type GetSubjectListResponse = ApiResponse<
    {
        name: string;
        id: number;
    }[]
>;

export interface GetGradeListRequest {}
export type GetGradeListResponse = ApiResponse<
    {
        name: string;
    }[]
>;

export interface GetTotalNumRequest {}
export type GetTotalNumResponse = ApiResponse<number[]>;

export interface GetAuditListRequest {
    criterionId: number;
}
export type GetAuditListResponse = ApiResponse<any[]>;

export interface GetAuditDetailRequest {
    id: number;
}
export type GetAuditDetailResponse = ApiResponse<any>;

export interface OtherEvalTeacherListRequest {
    grade?: string;
    subject?: string;
    criterionId: number;
}
export type OtherEvalTeacherListResponse = ApiResponse<any[]>;
