import type { ICell } from "../interface";

export const transposeTable = (data: ICell[][]): ICell[][] => {
    if (data.length === 0) return [];

    return data[0].map((_, colIndex) => data.map((row) => row[colIndex]));
};
