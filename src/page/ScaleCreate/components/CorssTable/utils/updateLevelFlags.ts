import { ICellType, type ICell } from "../interface";

/**
 * 更新表格中所有层次单元格的角标
 * 层次1：A1, A2, A3...
 * 层次2：每开始新的A级别时，B重新从1开始 (A1.B1, A1.B2, A2.B1, A2.B2...)
 * @param data 表格数据
 * @returns 更新后的表格数据
 */
export function updateLevelFlags(data: ICell[][]): ICell[][] {
    // 创建计数器，层次1全局递增，层次2在每个新的层次1下重置
    let level1Counter = 0;
    let level2Counter = 0;

    const updatedData = data.map((row) => {
        // 检查当前行第一列是否是新的层次1
        const firstCell = row[0];
        const isNewLevel1 =
            firstCell.type === ICellType.Content &&
            firstCell.contentType === "level";

        // 如果遇到新的层次1，重置层次2计数器
        if (isNewLevel1) {
            level2Counter = 0;
        }

        return row.map((cell, columnIndex) => {
            // 只处理层次1（第1列）和层次2（第2列）
            if (columnIndex > 1) {
                return cell;
            }

            // 只处理content类型且contentType为level的单元格
            if (
                cell.type === ICellType.Content &&
                cell.contentType === "level"
            ) {
                let newFlag: string;

                if (columnIndex === 0) {
                    // 层次1：全局递增
                    level1Counter++;
                    newFlag = `A${level1Counter}`;
                } else {
                    // 层次2：在当前层次1下递增
                    level2Counter++;
                    newFlag = `B${level2Counter}`;
                }

                return {
                    ...cell,
                    flag: newFlag,
                };
            }

            return cell;
        });
    });

    return updatedData;
}
