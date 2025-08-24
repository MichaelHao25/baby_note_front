import { ICellType, type ICorssTableState } from "../../../interface";
import { getDefaultParents } from "./getDefaultParents";

interface IGetRowLevelProps {
    rowIndex: number;
    corssTableData: ICorssTableState["data"];
    /**
     * 是否过滤相同的key
     */
    isFilterKey?: boolean;
}
/**
 * 获取行中所有的层级
 */
export const getRowLevel = (
    props: IGetRowLevelProps,
): ICorssTableState["data"][number] => {
    const { rowIndex, corssTableData, isFilterKey } = props;
    const row = corssTableData[rowIndex];
    const defaultList = row.filter((cell) => cell.type === ICellType.Default);
    const parentCells = getDefaultParents({ defaultList, corssTableData });
    const rowLevel = [...row, ...parentCells].filter(
        (cell) => cell.contentType === "level",
    );
    if (isFilterKey) {
        const set = new Set(rowLevel.map((item) => item._key));
        const filterRowLevel: ICorssTableState["data"][number][number][] = [];
        set.forEach((key) => {
            const item = rowLevel.find((item) => item._key === key);
            if (item) {
                filterRowLevel.push(item);
            }
        });
        return filterRowLevel;
    } else {
        return rowLevel;
    }
};
