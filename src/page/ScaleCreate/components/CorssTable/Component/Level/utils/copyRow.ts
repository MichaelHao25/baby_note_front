import { ICellType, IEvaluationMethod, type ICell } from "../../../interface";
import { v4 as uuidv4 } from "uuid";
import { getRowLevel } from "./getRowLevel";
import { getOriginCell } from "./getOriginCell";
import { type IPreservedData } from "./extractPreservedData";

interface ICopyRowProps {
    corssTableData: ICell[][];
    columnIndex: number;
    rowIndex: number;
    /**
     * 并列维度 & 新建子维度
     */
    copyType: "parallel" | "sub";
}
export const copyRow = (
    props: ICopyRowProps,
    preservedData?: IPreservedData,
): ICell[][] => {
    const { corssTableData, rowIndex, copyType } = props;
    const rowLevel = getRowLevel({
        rowIndex: corssTableData.length - 1,
        corssTableData,
    });
    if (copyType === "parallel") {
        const levelKey = uuidv4();
        const observationPointKey = uuidv4();
        return [
            [
                {
                    type: ICellType.Content,
                    _key: levelKey,
                    contentType: "level",
                    placeholder:
                        preservedData?.levelData?.placeholder ||
                        "请输入维度名称",
                    flag: preservedData?.levelData?.flag || "A2",
                    value: preservedData?.levelData?.value || "",
                    hidden: preservedData?.levelData?.hidden,
                },
                ...(rowLevel.length === 1
                    ? []
                    : [
                          {
                              type: ICellType.Default,
                              _key: uuidv4(),
                              parentKey: levelKey,
                          },
                      ]),
                {
                    type: ICellType.Content,
                    _key: observationPointKey,
                    contentType: "observationPoint",
                    placeholder:
                        preservedData?.observationPointData?.placeholder ||
                        "请输入观察点",
                    value: preservedData?.observationPointData?.value || "",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 0,
                    placeholder: "请输入评价标准",
                    value: "A",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 1,
                    placeholder: "请输入积点",
                    value: "4",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 2,
                    placeholder: "请输入说明",
                },
            ],
            [
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: levelKey,
                },
                ...(rowLevel.length === 1
                    ? []
                    : [
                          {
                              type: ICellType.Default,
                              _key: uuidv4(),
                              parentKey: levelKey,
                          },
                      ]),
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: observationPointKey,
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 0,
                    placeholder: "请输入评价标准",
                    value: "B",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 1,
                    placeholder: "请输入积点",
                    value: "3",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 2,
                    placeholder: "请输入说明",
                },
            ],
            [
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: levelKey,
                },
                ...(rowLevel.length === 1
                    ? []
                    : [
                          {
                              type: ICellType.Default,
                              _key: uuidv4(),
                              parentKey: levelKey,
                          },
                      ]),
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: observationPointKey,
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 0,
                    placeholder: "请输入评价标准",
                    value: "C",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 1,
                    placeholder: "请输入积点",
                    value: "2",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 2,
                    placeholder: "请输入说明",
                },
            ],
            [
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: levelKey,
                },
                ...(rowLevel.length === 1
                    ? []
                    : [
                          {
                              type: ICellType.Default,
                              _key: uuidv4(),
                              parentKey: levelKey,
                          },
                      ]),
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: observationPointKey,
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 0,
                    placeholder: "请输入评价标准",
                    value: "D",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 1,
                    placeholder: "请输入积点",
                    value: "1",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 2,
                    placeholder: "请输入说明",
                },
            ],
        ];
    } else {
        const row = corssTableData[rowIndex];
        const defaultList: ICell[] = [];
        const orginCell = getOriginCell({ cell: row[0], corssTableData });
        defaultList.push({
            type: ICellType.Default,
            _key: uuidv4(),
            parentKey: orginCell._key,
        });
        const levelKey = uuidv4();
        const observationPointKey = uuidv4();
        return [
            [
                ...defaultList,
                {
                    type: ICellType.Content,
                    _key: levelKey,
                    contentType: "level",
                    placeholder:
                        preservedData?.levelData?.placeholder ||
                        "请输入维度名称",
                    flag: preservedData?.levelData?.flag || "B1",
                    value: preservedData?.levelData?.value || "",
                    hidden: preservedData?.levelData?.hidden,
                },
                {
                    type: ICellType.Content,
                    _key: observationPointKey,
                    contentType: "observationPoint",
                    placeholder:
                        preservedData?.observationPointData?.placeholder ||
                        "请输入观察点",
                    value: preservedData?.observationPointData?.value || "",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 0,
                    placeholder: "请输入评价标准",
                    value: "A",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 1,
                    placeholder: "请输入积点",
                    value: "4",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 2,
                    placeholder: "请输入说明",
                },
            ],
            [
                ...defaultList.map((item) => {
                    item._key = uuidv4();
                    return { ...item };
                }),
                {
                    type: ICellType.Default,
                    parentKey: levelKey,
                    _key: uuidv4(),
                },
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: observationPointKey,
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 0,
                    placeholder: "请输入评价标准",
                    value: "B",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 1,
                    placeholder: "请输入积点",
                    value: "3",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 2,
                    placeholder: "请输入说明",
                },
            ],
            [
                ...defaultList.map((item) => {
                    item._key = uuidv4();
                    return { ...item };
                }),
                {
                    type: ICellType.Default,
                    parentKey: levelKey,
                    _key: uuidv4(),
                },
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: observationPointKey,
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 0,
                    placeholder: "请输入评价标准",
                    value: "C",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 1,
                    placeholder: "请输入积点",
                    value: "2",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 2,
                    placeholder: "请输入说明",
                },
            ],
            [
                ...defaultList.map((item) => {
                    item._key = uuidv4();
                    return { ...item };
                }),
                {
                    type: ICellType.Default,
                    parentKey: levelKey,
                    _key: uuidv4(),
                },
                {
                    type: ICellType.Default,
                    _key: uuidv4(),
                    parentKey: observationPointKey,
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 0,
                    placeholder: "请输入评价标准",
                    value: "D",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 1,
                    placeholder: "请输入积点",
                    value: "1",
                },
                {
                    type: ICellType.Content,
                    _key: uuidv4(),
                    contentType: IEvaluationMethod.SelectEvaluationStandard,
                    index: 2,
                    placeholder: "请输入说明",
                },
            ],
        ];
    }
};
