import { ICellType, type ICell } from "../interface";

/**
 * 查找观察点列的索引
 * @param corssTableData 表格数据
 * @returns 观察点列的索引，如果找不到则返回 -1
 */
function findObservationPointColumnIndex(corssTableData: ICell[][]): number {
    if (corssTableData.length === 0) {
        return -1;
    }
    // 假设标题在第一行或表结构定义中可以找到观察点列
    // 这里我们检查前几行来确定观察点列
    const headerRow = corssTableData[0]; // 通常标题在第一行
    for (let j = 0; j < headerRow.length; j++) {
        // 遍历整个表来查找具有 observationPoint 的单元格
        for (let i = 0; i < corssTableData.length; i++) {
            const cell = corssTableData[i][j];
            if (
                cell &&
                cell.type === ICellType.Content &&
                cell.contentType === "observationPoint"
            ) {
                return j;
            }
        }
    }
    return -1; // 未找到观察点列
}

/**
 * 获取当前行所属观察点的边界范围
 * @param corssTableData 表格数据
 * @param currentRowIndex 当前行索引
 * @returns 返回观察点的开始和结束行索引
 */
export function getObservationPointBounds(
    corssTableData: ICell[][],
    currentRowIndex: number,
): { startIndex: number; endIndex: number } {
    const observationPointColumnIndex =
        findObservationPointColumnIndex(corssTableData);

    if (observationPointColumnIndex === -1) {
        // 如果找不到观察点列，返回当前行作为边界
        return { startIndex: currentRowIndex, endIndex: currentRowIndex };
    }

    // 找到当前行的观察点parent key
    let observationPointKey: string | undefined;

    // 查找观察点列的parent key
    const currentRow = corssTableData[currentRowIndex];
    const observationPointCell = currentRow[observationPointColumnIndex];

    if (
        observationPointCell.type === ICellType.Content &&
        observationPointCell.contentType === "observationPoint"
    ) {
        observationPointKey = observationPointCell._key;
    } else if (
        observationPointCell.type === ICellType.Default &&
        observationPointCell.parentKey
    ) {
        observationPointKey = observationPointCell.parentKey;
    }

    if (!observationPointKey) {
        // 如果找不到观察点key，返回当前行作为边界
        return { startIndex: currentRowIndex, endIndex: currentRowIndex };
    }

    // 从当前行向上查找边界
    let startIndex = currentRowIndex;
    for (let i = currentRowIndex - 1; i >= 2; i--) {
        const row = corssTableData[i];
        const cell = row[observationPointColumnIndex]; // 观察点列

        const belongsToSameObservationPoint =
            (cell.type === ICellType.Content &&
                cell._key === observationPointKey) ||
            (cell.type === ICellType.Default &&
                cell.parentKey === observationPointKey);

        if (belongsToSameObservationPoint) {
            startIndex = i;
        } else {
            break;
        }
    }

    // 从当前行向下查找边界
    let endIndex = currentRowIndex;
    for (let i = currentRowIndex + 1; i < corssTableData.length; i++) {
        const row = corssTableData[i];
        const cell = row[observationPointColumnIndex]; // 观察点列

        const belongsToSameObservationPoint =
            (cell.type === ICellType.Content &&
                cell._key === observationPointKey) ||
            (cell.type === ICellType.Default &&
                cell.parentKey === observationPointKey);

        if (belongsToSameObservationPoint) {
            endIndex = i;
        } else {
            break;
        }
    }

    return { startIndex, endIndex };
}
