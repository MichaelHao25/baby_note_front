import type { ICell } from "../interface";
import { getRow } from "./getRow";

export const getColumn = (data: ICell[][], cell: ICell) => {
    const { _key: key } = cell;
    const row = getRow(data, cell);
    const column = data[row].findIndex((item) => item._key === key);
    return column;
};
