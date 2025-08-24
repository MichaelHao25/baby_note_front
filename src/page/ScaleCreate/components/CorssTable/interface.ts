export enum ICellType {
    /**
     * 表头
     */
    Header = "header",
    /**
     * 隐藏的格子
     */
    Default = "default",
    /**
     * 内容
     */
    Content = "content",
}
export interface ICell {
    /**
     * 类型
     */
    type: ICellType;
    /**
     * 唯一标识
     */
    _key: string;
    /**
     * 父级标识
     */
    parentKey?: string;
    /**
     * 内容类型
     */
    contentType?: string;
    /**
     * 标题 (用于表头)
     */
    title?: string;
    /**
     * 是否隐藏/停用
     */
    hidden?: boolean;
    /**
     *  最小值
     */
    minValue?: number;
    /**
     * 最大值
     */
    maxValue?: number;
    /**
     * 输入规则 整数 小数
     */
    inputRule?: number;
    /**
     * 输入行数
     */
    inputLine?: number;
    /**
     * 内容
     */
    [key: string]: unknown;
}
export interface ICorssTableProps {
    data?: ICell[][];
    value?: ICell[][];
    onChange?: (data: ICell[][]) => void;
    contentRender: Record<string, unknown>;
}

export enum IEvaluationMethod {
    /**
     * 选择评价标准
     */
    SelectEvaluationStandard = "selectEvaluationStandard",
    /**
     * 输入数值
     */
    InputValue = "inputValue",
    /**
     * 输入文本
     */
    InputText = "inputText",
}
export interface ICorssTableState
    extends Pick<Required<ICorssTableProps>, "data"> {
    hoverKeys: string[];
}
export interface IRenderContentProps {
    cell: ICell;
    type: ICellType;
    contentType?: string;
    rowIndex: number;
    columnIndex: number;
}
export interface IChildComponentProps
    extends ICell,
        Omit<IRenderContentProps, "cell" | "type" | "contentType"> {
    setState: React.Component["setState"];
    getCorssTableData: () => ICorssTableState["data"];
}
