import { type ICell } from "../../../interface";

/**
 * 保留的数据接口
 */
export interface IPreservedData {
    levelData?: Partial<ICell>;
    observationPointData?: Partial<ICell>;
}

/**
 * 从数据块中提取需要保留的层次和观察点数据
 * @param corssTableData 表格数据
 * @param startIndex 块的开始索引
 * @param endIndex 块的结束索引
 * @returns 提取的保留数据
 */
export const extractPreservedData = (
    corssTableData: ICell[][],
    startIndex: number,
    endIndex: number,
): IPreservedData => {
    const preservedData: IPreservedData = {};

    // 遍历块内的所有行，提取层次和观察点数据
    for (let i = startIndex; i <= endIndex; i++) {
        const row = corssTableData[i];

        // 查找层次数据
        const levelCell = row.find((cell) => cell.contentType === "level");
        if (levelCell && !preservedData.levelData) {
            preservedData.levelData = {
                value: levelCell.value,
                flag: levelCell.flag,
                placeholder: levelCell.placeholder,
                hidden: levelCell.hidden,
            };
        }

        // 查找观察点数据
        const observationPointCell = row.find(
            (cell) => cell.contentType === "observationPoint",
        );
        if (observationPointCell && !preservedData.observationPointData) {
            preservedData.observationPointData = {
                value: observationPointCell.value,
                placeholder: observationPointCell.placeholder,
            };
        }

        // 如果已经找到了层次和观察点数据，可以提前退出
        if (preservedData.levelData && preservedData.observationPointData) {
            break;
        }
    }

    return preservedData;
};
