import { ICellType } from "./interface";

export const DEFAULT_CELL_HEIGHT = 40;

export const list1 = [
    [
        {
            type: ICellType.Header,
            _key: "1",
            title: "层次1",
        },
        // {
        //     type: ICellType.Header,
        //     _key: "2",
        //     title: "层次2",
        // },
        {
            type: ICellType.Header,
            _key: "3",
            title: "观察点",
        },
        {
            type: ICellType.Header,
            _key: "4",
            title: "评价方式",
        },
        {
            type: ICellType.Default,
            _key: "5",
            parentKey: "4",
        },
        {
            type: ICellType.Default,
            _key: "6",
            parentKey: "4",
        },
    ],
    [
        {
            type: ICellType.Default,
            _key: "7",
            parentKey: "1",
        },
        // {
        //     type: ICellType.Default,
        //     _key: "8",
        //     parentKey: "2",
        // },
        {
            type: ICellType.Default,
            _key: "9",
            parentKey: "3",
        },
        {
            type: ICellType.Header,
            _key: "10",
            title: "评价标准",
        },
        {
            type: ICellType.Header,
            _key: "12",
            title: "积点",
        },
        {
            type: ICellType.Header,
            _key: "13",
            title: "说明",
        },
    ],
    [
        {
            type: ICellType.Content,
            _key: "23e21dae-d769-4118-8c2e-2af3343e90f4",
            contentType: "level",
            placeholder: "请输入维度名称",
            flag: "A1",
            value: "",
        },
        // {
        //     type: ICellType.Content,
        //     _key: "7a558fb1-45c9-450c-9979-8cb01a9ef3bb",
        //     contentType: "level",
        //     placeholder: "请输入维度名称",
        //     flag: "B1",
        //     value: "",
        // },
        {
            type: ICellType.Content,
            _key: "8ffb859f-646e-4a5b-abe9-6041815d901d",
            contentType: "observationPoint",
            placeholder: "请输入观察点",
            value: "",
        },
        {
            type: ICellType.Content,
            _key: "3c101cd9-a502-4154-b13d-31a15c2f2d70",
            contentType: "selectEvaluationStandard",
            index: 0,
            placeholder: "请输入评价标准",
            value: "A",
        },
        {
            type: ICellType.Content,
            _key: "fcfa6c30-11e5-4cd7-b4e8-a6a304dd1dd6",
            contentType: "selectEvaluationStandard",
            index: 1,
            placeholder: "请输入积点",
            value: "4",
        },
        {
            type: ICellType.Content,
            _key: "52f094df-6080-490a-a3e9-ba12a8ba5450",
            contentType: "selectEvaluationStandard",
            index: 2,
            placeholder: "请输入说明",
        },
    ],
    [
        {
            type: ICellType.Default,
            _key: "a81dc46e-2fc2-4d83-8fe5-649cad931d75",
            parentKey: "23e21dae-d769-4118-8c2e-2af3343e90f4",
        },
        // {
        //     type: ICellType.Default,
        //     parentKey: "7a558fb1-45c9-450c-9979-8cb01a9ef3bb",
        //     _key: "03740d68-4be3-437a-b718-9ab165b4c9bb",
        // },
        {
            type: ICellType.Default,
            _key: "a63772f8-4924-4371-9d6e-056b089e6f21",
            parentKey: "8ffb859f-646e-4a5b-abe9-6041815d901d",
        },
        {
            type: ICellType.Content,
            _key: "51828f78-6419-4ae6-acbc-498052f55b60",
            contentType: "selectEvaluationStandard",
            index: 0,
            placeholder: "请输入评价标准",
            value: "B",
        },
        {
            type: ICellType.Content,
            _key: "da52d6ac-3594-4932-964a-b2f75a04efa7",
            contentType: "selectEvaluationStandard",
            index: 1,
            placeholder: "请输入积点",
            value: "3",
        },
        {
            type: ICellType.Content,
            _key: "73322c3c-97c3-41b3-a23c-14646911085d",
            contentType: "selectEvaluationStandard",
            index: 2,
            placeholder: "请输入说明",
        },
    ],
    [
        {
            type: ICellType.Default,
            _key: "273e1b22-dc68-4294-9c48-6b4a86de70ad",
            parentKey: "23e21dae-d769-4118-8c2e-2af3343e90f4",
        },
        // {
        //     type: ICellType.Default,
        //     parentKey: "7a558fb1-45c9-450c-9979-8cb01a9ef3bb",
        //     _key: "0c10ceb8-eea4-443f-be4c-85d75881c117",
        // },
        {
            type: ICellType.Default,
            _key: "27f8e1c6-10ca-49c6-8536-6b2ba7379b07",
            parentKey: "8ffb859f-646e-4a5b-abe9-6041815d901d",
        },
        {
            type: ICellType.Content,
            _key: "25b54aa1-24fc-47e8-bd13-28f1da3eadfc",
            contentType: "selectEvaluationStandard",
            index: 0,
            placeholder: "请输入评价标准",
            value: "C",
        },
        {
            type: ICellType.Content,
            _key: "5d3912f7-31cc-45da-8bdb-a2c5882107be",
            contentType: "selectEvaluationStandard",
            index: 1,
            placeholder: "请输入积点",
            value: "2",
        },
        {
            type: ICellType.Content,
            _key: "d3e92899-e0d2-4180-927e-4aec02a53e00",
            contentType: "selectEvaluationStandard",
            index: 2,
            placeholder: "请输入说明",
        },
    ],
    [
        {
            type: ICellType.Default,
            _key: "091e52ef-c803-4632-a80a-f1f991fd98c1",
            parentKey: "23e21dae-d769-4118-8c2e-2af3343e90f4",
        },
        // {
        //     type: ICellType.Default,
        //     parentKey: "7a558fb1-45c9-450c-9979-8cb01a9ef3bb",
        //     _key: "9cc9b7e9-4628-447c-930c-3c521c8997e2",
        // },
        {
            type: ICellType.Default,
            _key: "1ba26e3d-a977-40a5-86bf-632f7275a749",
            parentKey: "8ffb859f-646e-4a5b-abe9-6041815d901d",
        },
        {
            type: ICellType.Content,
            _key: "39921b97-e5bc-488f-8732-c9a9b6432876",
            contentType: "selectEvaluationStandard",
            index: 0,
            placeholder: "请输入评价标准",
            value: "D",
        },
        {
            type: ICellType.Content,
            _key: "982774b4-f532-4f6e-8994-9814b13fed52",
            contentType: "selectEvaluationStandard",
            index: 1,
            placeholder: "请输入积点",
            value: "1",
        },
        {
            type: ICellType.Content,
            _key: "bbc87afe-e893-458d-bc6f-432a697c17d3",
            contentType: "selectEvaluationStandard",
            index: 2,
            placeholder: "请输入说明",
        },
    ],
];
