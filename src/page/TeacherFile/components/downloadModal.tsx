import { memo, useImperativeHandle, useState } from "react";
import { Button, Drawer, Table } from "antd";
import downloadData from "./downloadData.json";
import "../index.css";

interface Props {
  onRef: any;
  callBack: (event: any) => void;
}

const DownloadModal = memo<Props>(({ onRef, callBack }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("文件下载管理");
  const [pagination, setPagination] = useState({
    current: 1,
    size: 10,
    total: 0,
  });

  const fetchTableData = async () => {
    const res = downloadData;

    setPagination((page) => ({
      ...page,
      total: res.pages,
    }));
    setDataSource(res.datas);
  };

  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: "生成时间",
      dataIndex: "createDate",
      key: "createDate",
      align: "center",
      render: (text) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "文件",
      dataIndex: "zipName",
      align: "center",
      key: "zipName",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => {
        return (
          <span className="text-center">
            {text == "0" ? "生成失败" : "已过期"}
          </span>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <div className="flex justify-center">
            {record.status == "0" ? <Button type="primary">重试</Button> : ""}
          </div>
        );
      },
    },
  ];

  const showDrawer = () => {
    setOpen(true);
    fetchTableData();
  };

  const onClose = () => {
    setOpen(false);
  };

  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      open: showDrawer,
      close: onClose,
    };
  });

  return (
    <Drawer
      title={title}
      closable={{ "aria-label": "Close Button" }}
      onClose={onClose}
      width={1000}
      open={open}
      footer={
        <div className="flex justify-end">
          <div>
            <Button
              onClick={() => {
                callBack?.(null);
              }}
            >
              取消
            </Button>
            <Button
              type="primary"
              className="ml-[15px]"
              onClick={() => {
                callBack?.(null);
              }}
            >
              确认
            </Button>
          </div>
        </div>
      }
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={pagination}
      />
    </Drawer>
  );
});

export default DownloadModal;
