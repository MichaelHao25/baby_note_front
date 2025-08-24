import { memo, useImperativeHandle, useState } from "react";
import { Button, Drawer, Input, Switch, Table } from "antd";
import type { SettingType } from "../type.ts";

interface Props {
  onRef: any;
  callBack: (event: any) => void;
}

const SettingModal = memo<Props>(({ onRef, callBack }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("标题");

  const [data, setData] = useState<SettingType[]>([]);

  const getColumns = (type: "teacher" | "age") => {
    const columns = [
      {
        title: "教龄",
        dataIndex: "year",
        align: "center",
        key: "year",
        render: (_, record) => {
          return (
            <div className="flex items-center justify-center text-[#848586]">
              <Input
                value={record.year[0]}
                style={{ width: "50px" }}
                onChange={(e) => {
                  record.year[0] = e.target.value;
                  record.desc = record.year.join("-");
                  setTeaData([...teaData]);
                }}
              />
              <span className="mx-[5px]">~</span>
              <Input
                value={record.year[1]}
                style={{ width: "50px" }}
                onChange={(e) => {
                  record.year[1] = e.target.value;
                  record.desc = record.year.join("-");
                  setTeaData([...teaData]);
                }}
              />
              <span className="ml-[3px]">年</span>
            </div>
          );
        },
      },
      {
        title: "图标描述",
        dataIndex: "desc",
        align: "center",
        key: "desc",
        render: (_, record, index) => {
          return (
            <div className="flex justify-center">
              <div className="border border-[#eaebef] p-[5px] rounded-[5px] w-[100px]">
                {record?.desc}年
              </div>
              <a
                className="ml-[20px] mt-[5px]"
                onClick={() => {
                  const data = type === "teacher" ? [...teaData] : [...ageData];
                  data.splice(index, 1);
                  if (type === "teacher") {
                    setTeaData(data);
                  } else {
                    setAgeData(data);
                  }
                }}
              >
                删除
              </a>
            </div>
          );
        },
      },
    ];

    return columns;
  };

  const [teaData, setTeaData] = useState([]);
  const [ageData, setAgeData] = useState([]);

  const showDrawer = (info: SettingType) => {
    setTitle("高级设置");
    setData(info);
    setOpen(true);
    handleTeacherData(info);
    handleAgeData(info);
  };

  const handleTeacherData = (info: SettingType) => {
    const years = Object.keys(info.teachChart);
    const descList = Object.keys(info.teachChart);

    const yearList = years.map((item) => item.split("-"));

    const resultData = descList.map((desc, idx) => {
      return {
        year: yearList[idx],
        desc,
      };
    });

    setTeaData(resultData);
  };

  const handleAgeData = (info: SettingType) => {
    const years = Object.keys(info.ageChart);
    const descList = Object.keys(info.ageChart);

    const yearList = years.map((item) => item.split("-"));

    const resultData = descList.map((desc, idx) => {
      return {
        year: yearList[idx],
        desc,
      };
    });

    setAgeData(resultData);
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
      width={700}
      open={open}
      footer={
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={() => {
              callBack?.();
            }}
          >
            确定
          </Button>
        </div>
      }
    >
      <div className="mt-[15px] pb-[20px] border-b border-[#d7dbe2]">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="mr-[10px]">教龄分布设置</div>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                const data = [...teaData];
                data.push({
                  year: [0, 0],
                  desc: "",
                });
                setTeaData(data);
              }}
            >
              新增
            </Button>
          </div>
          <div className="flex items-center">
            <div className="mr-[10px]">是否显示：</div>
            <Switch />
          </div>
        </div>
        <div className="mt-[15px]">
          <Table
            bordered
            size="small"
            columns={getColumns("teacher")}
            dataSource={teaData}
            pagination={false}
          />
        </div>
      </div>

      <div className="mt-[25px] pb-[20px] border-b border-[#d7dbe2]">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="mr-[10px]">年龄分布设置</div>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => {
                const data = [...ageData];
                data.push({
                  year: [0, 0],
                  desc: "",
                });
                setAgeData(data);
              }}
            >
              新增
            </Button>
          </div>
          <div className="flex items-center">
            <div className="mr-[10px]">是否显示：</div>
            <Switch />
          </div>
        </div>
        <div className="mt-[15px]">
          <Table
            bordered
            size="small"
            columns={getColumns("age")}
            dataSource={ageData}
            pagination={false}
          />
        </div>
      </div>

      <div className="mt-[25px]">
        <div className="flex justify-between">
          <div className="flex items-center">
            <div className="mr-[10px] flex items-center">
              <span>近</span>{" "}
              <Input
                style={{ width: "50px", margin: "0 5px" }}
                value={data?.retireCharAge}
              />{" "}
              <span>年退休教师</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-[10px]">是否显示：</div>
            <Switch />
          </div>
        </div>
        <div className="mt-[15px]">
          <div className="flex items-center">
            <div>男教师退休年龄</div>
            <Input
              style={{ width: "50px", margin: "0 5px" }}
              value={data.genderRetireAge?.[0]}
            />
          </div>
          <div className="flex items-center mt-[10px]">
            <div>女教师退休年龄</div>
            <Input
              style={{ width: "50px", margin: "0 5px" }}
              value={data.genderRetireAge?.[1]}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
});

export default SettingModal;
