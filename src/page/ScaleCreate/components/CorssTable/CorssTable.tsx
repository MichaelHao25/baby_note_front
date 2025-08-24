import React from "react";
import {
    ICellType,
    type ICell,
    type ICorssTableProps,
    type ICorssTableState,
    type IRenderContentProps,
} from "./interface";
import { DEFAULT_CELL_HEIGHT } from "./constant";

export class CorssTable extends React.PureComponent<
    ICorssTableProps,
    ICorssTableState
> {
    constructor(props: ICorssTableProps) {
        super(props);
        const { data, value } = props;
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.state = {
            hoverKeys: [],
            data: (data || value) as ICell[][],
        };
    }
    getAreaName(cell: ICell) {
        if (cell.type === ICellType.Default) {
            return `area-${cell.parentKey}`;
        }
        return `area-${cell._key}`;
    }
    static getDerivedStateFromProps(
        props: ICorssTableProps,
        state: ICorssTableState,
    ) {
        const { data, value } = props;
        return {
            ...state,
            data: (data || value) as ICell[][],
        };
    }
    getGridTemplateAreas() {
        const { data } = this.state;

        const gridTemplateAreas = data
            .map(
                (row) =>
                    `"${row
                        .map((cell) => {
                            return this.getAreaName(cell);
                        })
                        .join(" ")}" auto`,
            )
            .join(" \n ");

        return `${gridTemplateAreas} / ${"1fr ".repeat(data[0].length)}`;
    }

    onMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
        const { keys } = e.currentTarget.dataset;
        const rowKeys = keys?.split(" ");
        if (rowKeys && rowKeys.length > 0) {
            // 获取当前hover的单元格key
            const gridArea = e.currentTarget.style.gridArea;
            const currentCellKey = gridArea?.replace("area-", "");

            // 收集所有相关的keys：当前行 + 所有子行
            const allRelatedKeys = new Set(rowKeys);

            // 只有当currentCellKey存在时才查找子行
            if (currentCellKey) {
                // 查找所有以当前单元格为parent的子单元格所在的行
                const { data } = this.state;
                data.forEach((row) => {
                    const hasChildCell = row.some(
                        (cell) => cell.parentKey === currentCellKey,
                    );
                    if (hasChildCell) {
                        // 找到包含子单元格的行，收集其所有keys
                        const childRowKeys = row
                            .map((cell) => {
                                if (cell.type === ICellType.Default) {
                                    return cell.parentKey;
                                }
                                return cell._key;
                            })
                            .filter((key) => key); // 过滤掉undefined

                        childRowKeys.forEach(
                            (key) => key && allRelatedKeys.add(key),
                        );
                    }
                });
            }

            this.setState({
                hoverKeys: Array.from(allRelatedKeys),
            });
        }
    }
    onMouseLeave() {
        this.setState({
            hoverKeys: [],
        });
    }
    getCorssTableData() {
        const { data } = this.state;
        return data;
    }
    setStateWithChange(state: ICorssTableState) {
        // this.setState(state);
        if (state.data) {
            this.props.onChange?.(state.data);
        }
    }
    renderContent(props: IRenderContentProps) {
        const { cell, type, contentType, rowIndex, columnIndex } = props;
        if (type === ICellType.Header) {
            const { title = "" } = cell;
            return (
                <div
                    className={`w-full h-full min-h-10 flex items-center justify-center bg-[#f6f8fe]`}
                >
                    {String(title)}
                </div>
            );
        }
        if (type === ICellType.Default) {
            return null;
        }
        if (type === ICellType.Content) {
            const { contentRender } = this.props;
            if (contentType && contentRender[contentType]) {
                return React.createElement(contentRender[contentType], {
                    ...cell,
                    rowIndex,
                    columnIndex,
                    getCorssTableData: this.getCorssTableData.bind(this),
                    setState: this.setStateWithChange.bind(this),
                });
            }
        }
    }
    render() {
        const { hoverKeys = [] } = this.state;
        const { data } = this.state;
        const gridTemplateAreas = this.getGridTemplateAreas();
        return (
            <div
                className="border-t border-l border-blue-100 grid"
                style={{ gridTemplate: gridTemplateAreas }}
            >
                {data.map((row, rowIndex) =>
                    row.map((cell, columnIndex) => {
                        const { _key, contentType, type } = cell;
                        const gridArea = this.getAreaName(cell);
                        const rowKeys = row
                            .map((cell) => {
                                if (cell.type === ICellType.Default) {
                                    return cell.parentKey;
                                }
                                return cell._key;
                            })
                            .join(" ");
                        const isHover = hoverKeys.includes(_key);
                        if (cell.type === ICellType.Default) {
                            return null;
                        }

                        return (
                            <div
                                onMouseEnter={this.onMouseEnter}
                                onMouseLeave={this.onMouseLeave}
                                key={_key}
                                data-keys={rowKeys}
                                style={{ gridArea }}
                                className={`border-b border-r border-blue-100 ${gridArea} ${isHover ? "bg-gray-50" : ""}`}
                            >
                                {this.renderContent({
                                    cell,
                                    type,
                                    contentType,
                                    rowIndex,
                                    columnIndex,
                                })}
                            </div>
                        );
                    }),
                )}
            </div>
        );
    }
}
