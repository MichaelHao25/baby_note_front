import type { ICell } from "../interface";

export const getRow = (data: ICell[][], cell: ICell) => {
    const { _key: key } = cell;
    const row = data.findIndex((item) =>
        item.find((item) => item._key === key),
    );
    return row;
};
