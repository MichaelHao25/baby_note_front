import dayjs from "dayjs";
import {
  BlockHeader,
  BlockTitle,
  List,
  ListButton,
  ListInput,
  ListItem,
} from "konsta/react";
import { useState } from "react";
import IconFont from "../../components/IconFont";

export async function loader() {
  return {
    title: "教师量表",
  };
}
const defaultParams = {
  /**
   * 日记时间
   */
  noteTime: dayjs().format("YYYY-MM-DD HH:mm"),
  /**
   * 称重记录
   */
  note: "",
};
interface IWeightRequest {
  noteTime: string;
  note: string;
}

export const Component = () => {
  const [params, updateParams] = useState<IWeightRequest>(defaultParams);
  return (
    <>
      <BlockHeader>时间线</BlockHeader>
      <List strong inset>
        <ListInput
          label="想要记点什么呢？"
          type="textarea"
          placeholder="请输入想要记录的内容"
          value={params.note as string}
          onChange={(e) =>
            updateParams((prev) => {
              return { ...prev, note: e.target.value };
            })
          }
          media={<IconFont icon="icon-jishiben" className="text-2xl" />}
          inputClassName="!h-20 resize-none"
        />

        <ListInput
          label={`时间`}
          type="datetime-local"
          value={params.noteTime}
          onChange={(e) => {
            const value = e.target.value;
            updateParams((prev) => {
              return {
                ...prev,
                noteTime: value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "",
              };
            });
          }}
          media={<IconFont icon="icon-shijianrili" />}
        />
      </List>
      <List strong inset>
        <ListButton
          onClick={() => {
            const { note, noteTime } = params;
            if (!note) {
              alert("记录的内容不能为空");
              return;
            }
            if (!noteTime) {
              alert("日期不能为空");
              return;
            }
            // if (isLoading) {
            //   return;
            // }
            // const parseMilkAmount = Number(params.milkAmount);
            // if (isNaN(parseMilkAmount)) {
            //   alert("请输入合法的奶量数字");
            //   return;
            // }
            // handler({ ...params, milkAmount: parseMilkAmount }).then((res) => {
            //   if (res?.data?.success) {
            //     defaultParams.milkTime = dayjs().format("YYYY-MM-DD HH:mm");
            //     updateParams(defaultParams);
            //     GlobalNotificationService.next({
            //       opened: true,
            //       title: "添加成功",
            //       subtitle: "本次记录添加成功,继续加油哦",
            //       icon: <IconFont icon="icon-chenggong" className="text-3xl" />,
            //       duration: 2000,
            //     });
            //   } else {
            //     GlobalNotificationService.next({
            //       opened: true,
            //       title: "添加失败",
            //       subtitle: "本次记录添加失败，请稍后重试",
            //       icon: <IconFont icon="icon-shibai" className="text-3xl" />,
            //       duration: 2000,
            //     });
            //   }
            // });
          }}
        >
          添加
        </ListButton>
      </List>
      <BlockTitle>最近的事件</BlockTitle>
      <List strong>
        <ListItem title="去打了疫苗" after="2025-09-17" />
        <ListItem title="宝宝出生了🐣" after="2025-07-1" />
        <ListItem
          title="测试很多文字测试很多文字测试很多文字测试很多文字测试很多文字测试很多文字测试很多文字"
          after="2025-07-21"
        />
      </List>
    </>
  );
};

Component.displayName = "Timeline";
