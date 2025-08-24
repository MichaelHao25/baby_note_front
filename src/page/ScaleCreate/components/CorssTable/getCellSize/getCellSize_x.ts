import { DEFAULT_CELL_WIDTH } from "../constant";
import { type ICell } from "../interface";
import { getColumn } from "../utils/getColumn";

export const getCellSize_x = ({
    data,
    cell,
}: {
    data: ICell[][];
    cell: ICell;
}) => {
    const column = getColumn(data, cell);
    return column * DEFAULT_CELL_WIDTH;
};
