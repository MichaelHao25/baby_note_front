import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
    CategoryResponse,
    SaveMessageRequest,
    SaveMessageResponse,
    CategoryRequest,
    SubjectResponse,
    TeacherSearchRequest,
    TeacherSearchResponse,
    EvaluateListRequest,
    AddCategoryRequest,
    AddCategoryResponse,
    DeleteCategoryResponse,
    DeleteCategoryRequest,
    UpdateCategoryResponse,
    UpdateCategoryRequest,
    EvaluateListResponse,
    EvaluateGetIdResponse,
    MyInfoResponse,
    ExamineListRequest,
    ExamineListResponse,
    PutExamineResponse,
    PutExamineRequest,
    SearchTeacherRequest,
    SearchTeacherResponse,
    CalendarListResponse,
    UploadRequest,
    UploadResponse,
    TokenResponse,
    TokenRequest,
    AttrAddRequest,
    AttrAddResponse,
    AttrUpdateRequest,
    AttrUpdateResponse,
    AttrListRequest,
    AttrListResponse,
    AttrDeleteRequest,
    AttrDeleteResponse,
    GetRecordDetailResponse,
    GetRecordDetailRequest,
    GetEvaluateInfoRequest,
    GetEvaluateInfoResponse,
    GetRecordListRequest,
    GetRecordListResponse,
    AddRecordRequest,
    AddRecordResponse,
    AddEvaluateRequest,
    AddEvaluateResponse,
    DeleteRecordRequest,
    DeleteRecordResponse,
    UpdateRecordRequest,
    UpdateRecordResponse,
    UpdateEvaluateRequest,
    UpdateEvaluateResponse,
    CosStsResponse,
    GetTeacherListRequest,
    GetTeacherLisResponse,
    GetSubjectListRequest,
    GetSubjectListResponse,
    GetGradeListRequest,
    GetGradeListResponse,
    GetTotalNumRequest,
    GetTotalNumResponse,
    GetAuditListRequest,
    GetAuditListResponse,
    GetAuditDetailRequest,
    GetAuditDetailResponse,
    OtherEvalTeacherListRequest,
    OtherEvalTeacherListResponse,
} from "../types/api";

export const apiSlice = createApi({
    reducerPath: "api",
    tagTypes: ["Attributes", "Categories", "Evaluate", "Examine"],
    baseQuery: fetchBaseQuery({
        baseUrl: "https://teapi.ourschool.cc/api",
        prepareHeaders: (headers, { arg }) => {
            // 从localStorage获取token
            const token = localStorage.getItem("token");

            // 如果token存在，添加到请求头
            if (token) {
                headers.set("token", token);
            }
            // @ts-ignore
            if (!(arg?.body instanceof FormData)) {
                // 添加其他必要的请求头
                headers.set("Content-Type", "application/json");
            }
            headers.set("Accept", "application/json");

            return headers;
        },
    }),
    endpoints: (builder) => ({
        // 更新获取token的接口
        getToken: builder.query<TokenResponse, TokenRequest>({
            query: (params) => ({
                url: "/user/gettoken",
                method: "POST",
                body: params,
            }),
        }),
        getCategories: builder.query<CategoryResponse, CategoryRequest>({
            query: (params) => ({
                url: "/category/lists",
                method: "POST",
                body: params,
            }),
        }),
        addCategories: builder.mutation<
            AddCategoryResponse,
            AddCategoryRequest
        >({
            query: (body) => ({
                url: "/category/add",
                method: "POST",
                body,
            }),
        }),
        deleteCategories: builder.mutation<
            DeleteCategoryResponse,
            DeleteCategoryRequest
        >({
            query: (body) => ({
                url: "/category/delete",
                method: "POST",
                body,
            }),
        }),
        modifyCategories: builder.mutation<
            UpdateCategoryResponse,
            UpdateCategoryRequest
        >({
            query: (body) => ({
                url: "/category/update",
                method: "POST",
                body,
            }),
        }),
        // 添加获取学科列表的接口
        getSubjects: builder.query<SubjectResponse, void>({
            query: () => ({
                url: "/school/list_subject",
                method: "POST",
            }),
        }),
        // 添加保存消息的mutation
        saveMessage: builder.mutation<SaveMessageResponse, SaveMessageRequest>({
            query: (body) => ({
                url: "/savemessgae",
                method: "POST",
                body,
            }),
        }),
        // 添加教师搜索接口
        searchTeachers: builder.query<
            TeacherSearchResponse,
            TeacherSearchRequest
        >({
            query: (params) => ({
                url: "/search/teacher",
                method: "POST",
                body: params,
            }),
        }),
        // 添加量表列表的接口
        getEvaluateList: builder.query<
            EvaluateListResponse,
            EvaluateListRequest
        >({
            query: (body) => ({
                url: "/evaluate/lists",
                method: "POST",
                body,
            }),
        }),
        // 添加获取评价ID的接口
        getEvaluateId: builder.query<EvaluateGetIdResponse, void>({
            query: () => ({
                url: "/evaluate/getid",
                method: "GET",
            }),
        }),
        // 新增获取自己的信息接口
        getMyInfo: builder.query<MyInfoResponse, void>({
            query: () => ({
                url: "/school/get_my_info",
                method: "POST",
            }),
        }),
        // 新增获取自己的信息接口
        getExamineList: builder.query<ExamineListResponse, ExamineListRequest>({
            query: (body) => ({
                url: "/examine/lists",
                method: "POST",
                body,
            }),
        }),
        // 提交审核相关接口
        putExamine: builder.mutation<PutExamineResponse, PutExamineRequest>({
            query: (body) => ({
                url: "/examine/add",
                method: "POST",
                body,
            }),
        }),
        // 获取腾讯云oss上传凭证
        getCosSts: builder.mutation<CosStsResponse, void>({
            query: () => ({
                url: "/school/get_cos_sts",
                method: "POST",
            }),
        }),
        // 搜索老师相关接口
        searchTeacher: builder.query<
            SearchTeacherResponse,
            SearchTeacherRequest
        >({
            query: (body) => ({
                url: "/search/teacher",
                method: "POST",
                body,
            }),
        }),
        // 学期列表接口
        calendarList: builder.query<CalendarListResponse, void>({
            query: () => ({
                url: "/school/list_calendar",
                method: "POST",
            }),
        }),
        // 文件上传接口
        uploadFile: builder.mutation<UploadResponse, UploadRequest>({
            query: (params) => {
                const formData = new FormData();
                formData.append("file", params.file);

                return {
                    url: "/common/upload",
                    method: "POST",
                    body: formData,
                    // 不设置Content-Type，让浏览器自动设置multipart/form-data
                };
            },
        }),
        // 属性相关API
        addAttr: builder.mutation<AttrAddResponse, AttrAddRequest>({
            query: (body) => ({
                url: "/attr/add",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Attributes", id: arg.criterionId },
            ],
        }),
        updateAttr: builder.mutation<AttrUpdateResponse, AttrUpdateRequest>({
            query: (body) => ({
                url: "/attr/update",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "Attributes", id: arg.criterionId },
            ],
        }),
        getAttrList: builder.query<AttrListResponse, AttrListRequest>({
            query: (body) => ({
                url: "/attr/lists",
                method: "POST",
                body,
            }),
            providesTags: (result, error, arg) =>
                result?.data
                    ? [
                          ...result.data.map(({ id }) => ({
                              type: "Attributes" as const,
                              id,
                          })),
                          { type: "Attributes", id: arg.criterionId },
                      ]
                    : [{ type: "Attributes", id: arg.criterionId }],
        }),
        deleteAttr: builder.mutation<AttrDeleteResponse, AttrDeleteRequest>({
            query: (body) => ({
                url: "/attr/delete",
                method: "POST",
                body,
            }),
            // 由于删除操作时我们只有id，无法获取criterionId
            // 所以使用一个通配符来使所有Attributes缓存失效
            invalidatesTags: () => [{ type: "Attributes", id: "LIST" }],
        }),
        // 记录详情
        getRecordDetail: builder.query<
            GetRecordDetailResponse,
            GetRecordDetailRequest
        >({
            query: (body) => ({
                url: "/myevaluate/info",
                method: "POST",
                body,
            }),
        }),
        // 更新记录
        updateRecord: builder.mutation<
            UpdateRecordResponse,
            UpdateRecordRequest
        >({
            query: (body) => ({
                url: "myevaluate/update",
                method: "POST",
                body,
            }),
        }),
        // 删除记录
        deleteRecord: builder.mutation<
            DeleteRecordResponse,
            DeleteRecordRequest
        >({
            query: (body) => ({
                url: "/myevaluate/delete",
                method: "POST",
                body,
            }),
        }),
        // 添加记录
        addRecord: builder.mutation<AddRecordResponse, AddRecordRequest>({
            query: (body) => ({
                url: "/myevaluate/add",
                method: "POST",
                body,
            }),
        }),
        // 记录列表
        getRecordList: builder.query<
            GetRecordListResponse,
            GetRecordListRequest
        >({
            query: (body) => ({
                url: "/myevaluate/lists",
                method: "POST",
                body,
            }),
        }),
        // 获取量表信息
        getEvaluateInfo: builder.query<
            GetEvaluateInfoResponse,
            GetEvaluateInfoRequest
        >({
            query: (body) => ({
                url: "/evaluate/info",
                method: "POST",
                body,
            }),
        }),
        // 添加评价接口
        addEvaluate: builder.mutation<AddEvaluateResponse, AddEvaluateRequest>({
            query: (body) => ({
                url: "/evaluate/add",
                method: "POST",
                body,
            }),
        }),
        // 更新评价接口
        updateEvaluate: builder.mutation<
            UpdateEvaluateResponse,
            UpdateEvaluateRequest
        >({
            query: (body) => ({
                url: "/evaluate/update",
                method: "POST",
                body,
            }),
        }),
        // 所有老师
        getTeacherList: builder.query<
            GetTeacherLisResponse,
            GetTeacherListRequest
        >({
            query: (body) => ({
                url: "/search/list_teacher",
                method: "POST",
                body,
            }),
        }),
        // 学科列表
        getTeacherSubjectList: builder.query<
            GetSubjectListResponse,
            GetSubjectListRequest
        >({
            query: (body) => ({
                url: "/school/list_teacher_subject",
                method: "POST",
                body,
            }),
        }),
        // 年级列表
        getGradeList: builder.query<
            GetGradeListResponse,
            GetGradeListRequest
        >({
            query: (body) => ({
                url: "/search/list_grade",
                method: "POST",
                body,
            }),
        }),
        // 统计数据 1、自评 2、审核 3、被评 4、待评
        getTotalNum: builder.query<
            GetTotalNumResponse,
            GetTotalNumRequest
        >({
            query: (body) => ({
                url: "/myevaluate/gettotal",
                method: "POST",
                body,
            }),
        }),
        // 审核列表2
        getAuditList: builder.query<
          GetAuditListResponse,
          GetAuditListRequest
        >({
            query: (body) => ({
                url: "/examine/lists2",
                method: "POST",
                body,
            }),
        }),
        // 审核详情
        getAuditDetail: builder.query<
          GetAuditDetailResponse,
          GetAuditDetailRequest
        >({
            query: (body) => ({
                url: "/examine/info",
                method: "POST",
                body,
            }),
        }),
        // 获取他评老师列表
        getOtherEvalTeacherList: builder.query<
            OtherEvalTeacherListResponse,
            OtherEvalTeacherListRequest
        >({
            query: (body) => ({
                url: "/examine/teachers",
                method: "POST",
                body,
            }),
        }),
    }),
});
export const {
    useGetCategoriesQuery,
    useGetSubjectsQuery,
    useLazyGetSubjectsQuery,
    useSaveMessageMutation,
    useSearchTeachersQuery,
    useLazySearchTeachersQuery,
    useAddCategoriesMutation,
    useDeleteCategoriesMutation,
    useModifyCategoriesMutation,
    useGetEvaluateListQuery,
    useGetEvaluateIdQuery,
    useGetMyInfoQuery,
    useGetExamineListQuery,
    usePutExamineMutation,
    useGetCosStsMutation,
    useSearchTeacherQuery,
    useCalendarListQuery,
    useUploadFileMutation,
    useAddAttrMutation,
    useUpdateAttrMutation,
    useGetAttrListQuery,
    useLazyGetAttrListQuery,
    useDeleteAttrMutation,
    useGetRecordDetailQuery,
    useGetEvaluateInfoQuery,
    useLazyGetEvaluateInfoQuery,
    useGetRecordListQuery,
    useAddRecordMutation,
    useAddEvaluateMutation,
    useDeleteRecordMutation,
    useUpdateRecordMutation,
    useUpdateEvaluateMutation,
    useGetTeacherListQuery,
    useGetTeacherSubjectListQuery,
    useGetGradeListQuery,
    useGetTotalNumQuery,
    useGetAuditListQuery,
    useGetAuditDetailQuery,
    useGetOtherEvalTeacherListQuery,
} = apiSlice;
