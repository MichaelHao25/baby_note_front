import { memo, useImperativeHandle, useState } from "react";
import { Button, Drawer } from "antd";
import titleIcon from "../../../assets/img/eval-modal-icon.png";
import titleIcon2 from "../../../assets/img/record-icon.png";
import titleIcon3 from "../../../assets/img/progress-icon.png";
import type { RecordItem } from "../type.ts";
import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons";
import "../index.css";

interface Props {
  onRef: any;
  callBack: (event: any) => void;
}

const iconMaps = {
  "0": titleIcon,
  "1": titleIcon2,
  "2": titleIcon3,
};
const getTitleIcon = (index: number) => {
  return iconMaps?.[index] || titleIcon;
};

const AddRecordModal = memo<Props>(({ onRef, callBack }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("标题");

  const [recordList, setRecordList] = useState<RecordItem[]>([]);
  const [curType, setCurType] = useState<RecordItem>();

  const showDrawer = (list: RecordItem[]) => {
    setTitle(`添加记录`);
    setOpen(true);
    console.log("list", list);
    setRecordList(list);
    setCurType(list[0]);
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
      <div className="pb-[15px] border-b border-[#e8eaee] flex">
        {recordList?.length
          ? recordList.map((item) => {
              return (
                <div
                  className={`p-[5px] text-[#000] rounded-[4px] mr-[10px] cursor-pointer${curType?.id === item.id ? " bg-[#e6f0fe] text-[#0066f8]" : ""}`}
                  key={item.id}
                  onClick={() => setCurType(item)}
                >
                  {item.name}
                </div>
              );
            })
          : null}
      </div>

      <div className="mt-[15px]">
        {curType?.childs?.map((item, idx) => {
          return (
            <div
              key={item.id}
              className="border border-[#b6d4fd] rounded-[5px] w-full bg-[#f5f9fe] p-[15px] mb-[15px]"
            >
              <div className="p-[10px] rounded-[8px] items-center bg-[#d0e3fa] w-[140px] flex">
                <img
                  src={getTitleIcon(idx)}
                  className="w-[24px] h-[24px] mr-[10px]"
                />
                <span className="text-[15px] w-[100px]">{item.name}</span>
                <CaretDownOutlined style={{ color: "#4085ea" }} />
              </div>
              <div className="mt-[15px] flex">
                {item.datas?.map((iten) => {
                  return (
                    <div
                      key={iten.type}
                      className="px-[15px] mr-[15px] bg-white w-[258px] h-[50px] flex justify-between items-center cursor-pointer border border-[#efefef] rounded-[8px] type-item"
                      onClick={() => {
                        console.log(curType);
                        callBack?.({
                          ...iten,
                          parentName: curType?.name,
                        });
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-[8px] h-[8px] rounded-[4px] bg-[#ffd987] border border-[#333] relative top-[1px] tip"></div>
                        <div className="ml-[8px] text-[16px]">{iten.name}</div>
                      </div>
                      <div className="times-icon">
                        <span className="text-[#518df1] text-[20px]">
                          {iten.evlaueCount}
                        </span>
                        <span>次</span>
                      </div>
                      <div className="hidden add-icon">
                        <PlusOutlined />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
});

export default AddRecordModal;
