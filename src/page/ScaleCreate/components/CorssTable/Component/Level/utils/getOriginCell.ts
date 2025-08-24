import { type ICell, ICellType } from "../../../interface";

/**
 * 找到最原始的 单元格，如果当前单元格是default类型，则找到他的父级单元格
 */
export const getOriginCell = (props: {
    cell: ICell;
    corssTableData: ICell[][];
}): ICell => {
    const { cell, corssTableData } = props;
    if (cell.type !== ICellType.Default) {
        return cell;
    }
    const list = corssTableData.flat(2);
    const originCell = list.find((item) => item._key === cell.parentKey);

    if (originCell) {
        return originCell;
    }
    throw new Error("数据错误,没有找到最原始的单元格");
};
