import { ICellType, type ICorssTableState } from "../../../interface";

export const getDefaultParents = (props: {
    defaultList: ICorssTableState["data"][number];
    corssTableData: ICorssTableState["data"];
}): ICorssTableState["data"][number] => {
    const { defaultList, corssTableData } = props;
    const parentCells = defaultList.map((cell) => {
        if (cell.type !== ICellType.Default) {
            return cell;
        }
        const parentKey = cell.parentKey;
        const parentCell = corssTableData
            .flat(2)
            .find((row) => row._key === parentKey);
        return parentCell;
    });
    return parentCells.filter(
        (item): item is ICorssTableState["data"][number][number] => {
            return item !== undefined;
        },
    );
};
