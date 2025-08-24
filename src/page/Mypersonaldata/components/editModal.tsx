import { memo, useImperativeHandle, useState } from "react";
import dayjs from "dayjs";
import { Button, Checkbox, DatePicker, Drawer, Form, Radio, Table } from "antd";
import type { UserInfoType } from "../type.ts";
import Avatar from "../../../assets/img/user-avatar.png";
import adjustData from "./adjustData.json";
import "../index.css";

interface Props {
  onRef: any;
  callBack: (event: any) => void;
}

const { RangePicker } = DatePicker;

const EditModal = memo<Props>(({ onRef, callBack }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("标题");
  const [isAdjust, setIsAdjust] = useState(false);

  const [info, setInfo] = useState<UserInfoType>(null);

  const [adjustMap, setAdjustMap] = useState({});
  const [curSubject, setCurSubject] = useState("科技");

  const formatTeachNumber = (teachNumber: number) => {
    const year = Math.floor(teachNumber / 12).toFixed(0);
    const month = teachNumber % 12;

    return `${year}年${month}月`;
  };

  const columns = [
    {
      title: "教龄",
      dataIndex: "teachNumber",
      key: "teachNumber",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            {record?.teachNumber ? formatTeachNumber(record?.teachNumber) : "-"}
          </div>
        );
      },
    },
    {
      title: "教学时间经历",
      dataIndex: "teachAges",
      key: "teachAges",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <RangePicker format={"YYYY年"} />
          </div>
        );
      },
    },
  ];
  const [dataSource, setDataSource] = useState([]);

  const fetchAdjustData = () => {
    const res = adjustData;
    setAdjustMap(res);
  };

  const showDrawer = (info: UserInfoType) => {
    console.log("info", info);
    setTitle(`修改信息`);
    setDataSource([
      { teachNumber: info.teachNumber, teachAges: info.teachAges },
    ]);
    setOpen(true);
    setInfo(info);
    fetchAdjustData();
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
      <div className="flex rounded-[12px] border mb-[15px] border-b border-[#eeeeee]">
        <div className="border-r border-[#d6e0f4] py-[20px] w-[140px] flex flex-col justify-center items-center">
          <img src={Avatar} className="w-[100px]" />
          <div className="text-center mt-[15px] text-[18px] font-semibold">
            {info?.userName}
          </div>
        </div>
        <div className="p-[20px]">
          <Form>
            <Form.Item label="性别">
              <Radio.Group
                value={info?.gender}
                options={[
                  { value: "男", label: "男" },
                  { value: "女", label: "女" },
                ]}
              />
            </Form.Item>
            <Form.Item label="出生日期">
              <DatePicker
                value={dayjs(info?.teachAges?.[0]?.startDate) || dayjs()}
                picker="year"
                format={"YYYY年"}
              />
            </Form.Item>
            <Form.Item label="学历">
              <Radio.Group
                value={"本科"}
                options={[
                  { value: "大专", label: "大专" },
                  { value: "本科", label: "本科" },
                  { value: "硕士研究生", label: "硕士研究生" },
                  { value: "博士研究生", label: "博士研究生" },
                ]}
              />
            </Form.Item>
          </Form>
        </div>
      </div>

      <div className="pt-[15px]">
        <div className="flex items-center text-[18px]">
          <span className="pl-[10px] border-l-[3px] border-[#ffaa2e] font-semibold">
            教师信息
          </span>
        </div>
        <div className="mt-[10px] text-[16px]">深瞳带班学科：</div>
        <div className="my-[10px] text-[16px]">额外学科标识：</div>
        <div className="flex justify-between">
          <Button type="primary" onClick={() => setIsAdjust(!isAdjust)}>
            调整
          </Button>

          {isAdjust && (
            <Button type="primary" onClick={() => setIsAdjust(!isAdjust)}>
              取消
            </Button>
          )}
        </div>

        {isAdjust ? (
          <>
            <div className="flex items-center">
              <div className="w-[70px] mx-[20px]">学科</div>
              <div>
                <Radio.Group
                  value={curSubject}
                  onChange={(e) => setCurSubject(e.target.value)}
                  options={Object.keys(adjustMap).map((item) => {
                    return {
                      value: item,
                      label: item,
                    };
                  })}
                />
              </div>
            </div>

            <div className="flex items-center mt-[15px]">
              <div className="w-[35px] mx-[20px]">学科</div>
              <div>
                <Checkbox.Group
                  options={
                    adjustMap?.[curSubject] ||
                    [].map((item) => {
                      return {
                        value: item,
                        label: item,
                      };
                    })
                  }
                />
              </div>
            </div>
          </>
        ) : null}

        <div className="mt-[15px]">
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            size="small"
            pagination={false}
          />
        </div>
      </div>
    </Drawer>
  );
});

export default EditModal;
