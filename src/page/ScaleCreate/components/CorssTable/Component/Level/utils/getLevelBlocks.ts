import { ICellType, type ICell } from "../../../interface";

interface ILevelBlock {
    startIndex: number;
    endIndex: number;
    levelKey: string;
}

/**
 * 获取表格中所有的维度块信息
 */
export const getLevelBlocks = (corssTableData: ICell[][]): ILevelBlock[] => {
    const blocks: ILevelBlock[] = [];
    let currentBlock: ILevelBlock | null = null;

    // 从第3行开始（跳过表头）
    for (let i = 2; i < corssTableData.length; i++) {
        const firstCell = corssTableData[i][0];

        // 如果是一个level类型的Content单元格，说明开始了一个新的维度块
        if (
            firstCell.contentType === "level" &&
            firstCell.type === ICellType.Content
        ) {
            // 如果之前有未完成的块，先结束它
            if (currentBlock) {
                currentBlock.endIndex = i - 1;
                blocks.push(currentBlock);
            }

            // 开始新的块
            currentBlock = {
                startIndex: i,
                endIndex: i, // 临时设置，会在后面更新
                levelKey: firstCell._key,
            };
        }
    }

    // 结束最后一个块
    if (currentBlock) {
        currentBlock.endIndex = corssTableData.length - 1;
        blocks.push(currentBlock);
    }

    return blocks;
};

/**
 * 根据rowIndex找到对应的维度块
 */
export const findBlockByRowIndex = (
    blocks: ILevelBlock[],
    rowIndex: number,
): ILevelBlock | null => {
    return (
        blocks.find(
            (block) =>
                rowIndex >= block.startIndex && rowIndex <= block.endIndex,
        ) || null
    );
};
