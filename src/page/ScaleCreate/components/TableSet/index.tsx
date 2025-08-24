import { HolderOutlined } from "@ant-design/icons";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Button, Drawer, Switch, Table } from "antd";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { TableSort } from "./TableSort";
import {
    useAddEexcelMutation,
    useGetEexcelListQuery,
} from "../../../../store/eexcelApiSlice";
import { dataset } from "./config";

interface ITableSetProps {}

export const TableSet = (props: ITableSetProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Drawer open={open} onClose={() => setOpen(false)} width={800}>
                <div className="text-sm text-gray-500 pb-2">
                    显示设置（拖拽进行排序）
                </div>
                <TableSort />
            </Drawer>
            <Button onClick={() => setOpen(true)}>报表设置</Button>
        </div>
    );
};
