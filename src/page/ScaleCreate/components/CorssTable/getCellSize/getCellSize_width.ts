import { DEFAULT_CELL_WIDTH } from "../constant";
import { ICellType, type ICell } from "../interface";
import { getColumn } from "../utils/getColumn";
import { getRow } from "../utils/getRow";

export const getCellSize_width = ({
    data,
    cell,
}: {
    data: ICell[][];
    cell: ICell;
}) => {
    const { _key: key } = cell;
    const column = getColumn(data, cell);
    const row = getRow(data, cell);
    const cellChildDefaultCells = data[row]
        .slice(column)
        .filter(
            (cell) => cell.type === ICellType.Default && cell.parentKey === key,
        );
    const cellWidth =
        cellChildDefaultCells.length * DEFAULT_CELL_WIDTH + DEFAULT_CELL_WIDTH;
    return cellWidth;
};
