import { ICellType, type ICell } from "../../../interface";
import { getOriginCell } from "./getOriginCell";

/**
 * 获取当前选中行的起点和终点(包含非default的行)
 */
export const getRowStartAndEndIndex = (props: {
    rowIndex: number;
    columnIndex: number;
    corssTableData: ICell[][];
}): {
    startIndex: number;
    endIndex: number;
} => {
    const { rowIndex, columnIndex, corssTableData } = props;
    const startKey = getOriginCell({
        cell: corssTableData[rowIndex][columnIndex],
        corssTableData,
    })._key;
    const rows = corssTableData.map((row) => row[columnIndex]);
    // const startIndex = rows.findIndex(
    //     (item) =>
    //         item.type === ICellType.Default && item.parentKey === startKey,
    // );
    const endItem = [...rows]
        .reverse()
        .find(
            (item) =>
                item.type === ICellType.Default && item.parentKey === startKey,
        );
    const endIndex = rows.findIndex((item) => item === endItem);
    return {
        startIndex: rowIndex,
        endIndex: endIndex === -1 ? rowIndex : endIndex,
    };
};
