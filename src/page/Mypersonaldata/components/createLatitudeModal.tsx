import { memo, useImperativeHandle, useState } from "react";
import { Button, DatePicker, Drawer, Form, Input } from "antd";
import titleIcon from "../../../assets/img/eval-modal-icon.png";
import titleIcon2 from "../../../assets/img/record-icon.png";
import titleIcon3 from "../../../assets/img/progress-icon.png";
import type { FindTreeItem, RecordItem } from "../type.ts";
import { CaretDownOutlined, PlusOutlined } from "@ant-design/icons";
import "../index.css";

const { TextArea } = Input;

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

const CreateLatitudeModal = memo<Props>(({ onRef, callBack }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("标题");

  const [recordList, setRecordList] = useState<RecordItem[]>([]);
  const [curType, setCurType] = useState<RecordItem>();

  const [curTitle, setCurTitle] = useState("");

  const [findTree, setFindTree] = useState<FindTreeItem[]>([]);
  const fetchFindTree = () => {
    const res = [
      {
        id: "659c68574413762a879c3afe",
        createDate: "2024/01/09 05:25:43",
        name: "实践教学",
        aliase: null,
        levelDesc:
          "准备充分，效果令人满意的（督导推荐课/家长开放日）-教研组内展示/专家指导/跟岗听课/督导常态课",
        parentId: null,
        evalMode: null,
        criterionId: "659c68574413762a879c3afd",
        schoolCode: "RBI850",
        seq: 0,
        scoreLevel: {
          id: "658bd6575529c00da15ead1b",
          createDate: "2023/12/27 15:46:31",
          scoreType: 0,
          enterScoreMap: null,
          enterRule: null,
          min: 0,
          max: 0,
          ladderCount: 0,
          schoolCode: "RBI850",
          levels: [
            {
              level: "市",
              desc: "",
              score: 4,
              specialScore: 0,
              scoreMap: {},
              seq: 1,
              hide: false,
              comment: null,
              oldIndex: 0,
              objectId: null,
              syncValue: null,
            },
            {
              level: "外省市",
              desc: "",
              score: 3,
              specialScore: 0,
              scoreMap: {},
              seq: 2,
              hide: false,
              comment: null,
              oldIndex: 0,
              objectId: null,
              syncValue: null,
            },
            {
              level: "学区、集团",
              desc: "",
              score: 2,
              specialScore: 0,
              scoreMap: {},
              seq: 3,
              hide: false,
              comment: null,
              oldIndex: 0,
              objectId: null,
              syncValue: null,
            },
            {
              level: "校级开放",
              desc: "",
              score: 1,
              specialScore: 0,
              scoreMap: {},
              seq: 4,
              hide: false,
              comment: null,
              oldIndex: 0,
              objectId: null,
              syncValue: null,
            },
          ],
          seq: 0,
          defaultIndex: -1,
          defaultTeacherScore: null,
          featureIndex: -1,
          featureTeacherScore: null,
          scoreName: null,
          desc: null,
          row: 1,
          requiredFile: 0,
          inputType: 0,
          indexs: [],
          scoreTypeDesc: "等第标准",
        },
        childs: null,
        editStatus: null,
        dimeFroms: null,
        userTaskScoreJson: null,
        rowIndex: 0,
        indexCount: null,
        orgIndexCount: null,
        orgIndexUsers: null,
        parentName: null,
        newId: null,
        followId: null,
        fieldTickInfos: null,
        coreQualityDocIds: null,
        coreQualityJsons: null,
        rgb: null,
        cell: "A1",
        calculationRules: null,
        type: 0,
        isError: false,
        errorMessages: [],
        commentTip: "请输入文本",
        leafNoteNum: null,
        toScore: null,
        calculateParameter: null,
        fullName: null,
        fromId: null,
        hide: false,
        zero: false,
        sourceDesc: null,
        aboveDimensionId: null,
        max: null,
        note: false,
        noteStr: null,
        copyFromId: null,
        rootId: "659c68574413762a879c3afe",
        levelToNode: false,
        gradeIndex: -1,
        orgIndexMap: null,
        hideType: 0,
        lineType: -1,
        syncInfo: null,
        evalDoc: null,
      },
    ];

    setFindTree(res);
  };

  const showDrawer = (info: RecordItem) => {
    console.log("info", info);
    setTitle(`${info.name}`);
    setCurTitle(`${info.parentName} / ${info.name}`);
    fetchFindTree();
    setOpen(true);
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
      <div className="flex items-center p-[10px] rounded-[8px] bg-[#deeafd] record-title justify-between">
        <div className="flex items-center">
          <img
            src={getTitleIcon(0)}
            alt=""
            className="w-[30px] h-[30px] mr-[10px]"
          />
          <span className="text-[15px]">{curTitle}</span>
        </div>

        <Button type="primary">更改</Button>
      </div>

      <div className="mt-[15px]">
        <Form labelCol={{ span: "3" }}>
          <Form.Item label="记录归属日期">
            <DatePicker />
          </Form.Item>
          <Form.Item label="记录说明">
            <div className="mt-[5px]">
              <div className="">填写说明：简单概述本次记录的内容</div>
              <TextArea rows={3} />
            </div>
          </Form.Item>

          <div className="pt-[10px] border-y border-[#e8eaee]">
            <Form.Item label="附件提交">
              <div className="bg-[#f6f6f6]">
                <div className="p-[10px]">开课证明、教案</div>
                <div className="flex items-center justify-center py-[5px] border-t border-[#d1d1d1] text-[#6ea1ed] cursor-pointer">
                  <span className="mr-[5px]">点击上传</span>
                  <PlusOutlined />
                </div>
              </div>
            </Form.Item>
          </div>
        </Form>
      </div>

      <div className="mt-[15px]">
        {findTree.map((item) => {
          return (
            <div key={item.id} className="mb-[15px]">
              <div className="my-[10px]">
                <span className="pl-[5px] border-l-[3px] border-[#ffaa2e] text-[16px] font-semibold">
                  {item.name}
                </span>
              </div>
              <div className="mt-[15px] w-full bg-[#f8f8f8]">
                <div className="p-[15px] ">
                  <div className="level-desc-title">评价标准参考</div>
                  <div className="flex w-full h-[60px] border-[#d7e3f7] border">
                    <div className="w-[150px] flex items-center justify-center text-[#333] text-[14px]">
                      观察点
                    </div>
                    <div className="flex-1 flex items-center justify-center pr-[15px] text-[#777] text-[14px]">
                      {item.levelDesc}
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#e7e7e7] px-[30px] py-[5px] flex items-center">
                  <div className="text-[#888]">{item.name}</div>
                  {item?.scoreLevel?.levels.map((level) => {
                    return (
                      <Button
                        key={level.desc}
                        className="ml-[10px]"
                        style={{ width: "100px" }}
                      >
                        {level.level}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
});

export default CreateLatitudeModal;
