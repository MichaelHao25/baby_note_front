import { Table, type TableColumnsType } from "antd";
import CryptoJS from "crypto-js";
// 深度优先
const treeToListDepth = (
    tree: Partial<DataType>[],
    data: Partial<DataType> = {},
    depth: number = 0,
): Partial<DataType>[] => {
    let result: Partial<DataType>[] = [];
    tree.forEach((item, index) => {
        const { children = [], ...attr } = item;
        if (children.length) {
            const append = { ...data, ...attr };
            const md5 = CryptoJS.MD5(
                JSON.stringify({ ...append, index }),
            ).toString();
            append[`md5_${depth}`] = md5;
            result = result.concat(
                treeToListDepth(children, append, 1 + depth),
            );
        } else {
            result.push({ ...data, ...attr });
        }
    });
    return result;
};
interface DataType {
    key: React.Key;
    level1: string;
    level2: string;
    point: string;
    standard: string;
    score: string;
    desc: string;
    md5_0?: string;
    md5_1?: string;
    md5_2?: string;
    children: Partial<DataType>[];
}
export const TableWrap = () => {
    const columns: TableColumnsType<Partial<DataType>> = [
        {
            title: "层次1",
            dataIndex: "level1",
            key: "level1",

            onCell(record: Partial<DataType>, index) {
                const { md5_0 } = record;
                if (
                    (list.findIndex((item) => item.md5_0 === md5_0) ===
                        index) ===
                    false
                ) {
                    return { rowSpan: 0 };
                }
                return {
                    rowSpan: list.filter((item) => item.md5_0 === md5_0).length,
                };
            },
        },
        {
            title: "层次2",
            dataIndex: "level2",
            key: "level2",
            onCell(record: Partial<DataType>, index) {
                const { md5_1 } = record;
                if (
                    (list.findIndex((item) => item.md5_1 === md5_1) ===
                        index) ===
                    false
                ) {
                    return { rowSpan: 0 };
                }
                return {
                    rowSpan: list.filter((item) => item.md5_1 === md5_1).length,
                };
            },
        },
        {
            title: "观察点",
            dataIndex: "point",
            key: "point",
        },
        {
            title: "评价方式",
            children: [
                {
                    title: "评价标准",
                    dataIndex: "standard",
                    key: "standard",
                },
                {
                    title: "积点",
                    dataIndex: "score",
                    key: "score",
                },
                {
                    title: "说明",
                    dataIndex: "desc",
                    key: "desc",
                },
            ],
        },
    ];
    const tree: Partial<DataType>[] = [
        {
            key: 1,
            level1: "1",
            children: [
                {
                    level2: "1",
                    point: "1",
                    children: [
                        {
                            standard: "1",
                            score: "1",
                            desc: "1",
                        },
                        {
                            standard: "1",
                            score: "1",
                            desc: "1",
                        },
                    ],
                },
                {
                    level2: "1",
                    point: "1",
                    children: [
                        {
                            standard: "1",
                            score: "1",
                            desc: "1",
                        },
                    ],
                },
            ],
        },
        {
            key: 2,
            level1: "请输入维度名称",
            // level2: "请输入维度名称",
            point: "请输入观察点",
            standard: "请输入评价标准",
            score: "请输入积点",
            desc: "请输入说明",
        },
    ];
    const list = treeToListDepth(tree);

    return <Table columns={columns} bordered dataSource={list} />;
};
