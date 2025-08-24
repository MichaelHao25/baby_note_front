import { DEFAULT_CELL_HEIGHT } from "../constant";
import { type ICell } from "../interface";
import { getRow } from "../utils/getRow";

export const getCellSize_y = ({
    data,
    cell,
}: {
    data: ICell[][];
    cell: ICell;
}) => {
    const row = getRow(data, cell);
    return row * DEFAULT_CELL_HEIGHT;
};
