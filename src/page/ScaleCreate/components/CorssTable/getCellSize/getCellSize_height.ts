import { DEFAULT_CELL_HEIGHT } from "../constant";
import { ICellType, type ICell } from "../interface";
import { getColumn } from "../utils/getColumn";
import { getRow } from "../utils/getRow";

export const getCellSize_height = ({
    data,
    cell,
}: {
    data: ICell[][];
    cell: ICell;
}) => {
    const { _key: key } = cell;
    const column = getColumn(data, cell);
    const row = getRow(data, cell);
    const cellChildDefaultCells = data.slice(row).filter((cells) => {
        const cell = cells[column];
        return cell.type === ICellType.Default && cell.parentKey === key;
    });
    const cellHeight =
        cellChildDefaultCells.length * DEFAULT_CELL_HEIGHT +
        DEFAULT_CELL_HEIGHT;
    return cellHeight;
};
