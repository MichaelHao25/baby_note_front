export const focusIndexList = [
    {
        type: 0,
        name: "单选",
    },
    {
        type: 1,
        name: "多选",
    },
    {
        type: 2,
        name: "填空",
    },
    {
        type: 3,
        name: "记录说明",
    },
    {
        type: 5,
        name: "地点",
    },
    {
        type: 6,
        name: "附件提交",
    },
];

export interface ListItem {
    name: string;
}

export interface ListObjectType {
    [key: string]: ListItem[];
}

export const listObject: ListObjectType = {
    "0": [
        {
            name: "必须",
        },
        {
            name: "可选",
        },
    ],
    "1": [
        {
            name: "必须",
        },
        {
            name: "可选",
        },
    ],
    "2": [
        {
            name: "必填",
        },
        {
            name: "选填",
        },
    ],
    "3": [
        {
            name: "必填",
        },
        {
            name: "选填",
        },
    ],
    "5": [
        {
            name: "必填",
        },
        {
            name: "选填",
        },
    ],
    "6": [
        {
            name: "必须",
        },
        {
            name: "可选",
        },
    ],
};

export interface TitleObjectType {
    [key: string]: string;
}

export const titleObject: TitleObjectType = {
    "0": "必须选择",
    "1": "必须选择",
    "2": "必须填写",
    "3": "必须填写",
    "5": "必须填写",
    "6": "必须提交",
};

export const inputType = [
    {
        name: "输入框填写",
    },
    {
        name: "下拉选择",
    },
];
