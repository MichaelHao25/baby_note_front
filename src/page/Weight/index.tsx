import dayjs from "dayjs";
import { BlockHeader, List, ListButton, ListInput } from "konsta/react";
import { useState } from "react";
import IconFont from "../../components/IconFont";

export async function loader() {
  return {
    title: "教师量表",
  };
}
const defaultParams = {
  /**
   * 称重时间
   */
  weightTime: dayjs().format("YYYY-MM-DD HH:mm"),
  /**
   * 称重记录
   */
  weight: "",
};
interface IWeightRequest {
  weight: number | string;
  weightTime: string;
}

export const Component = () => {
  const [params, updateParams] = useState<IWeightRequest>(defaultParams);
  return (
    <>
      <BlockHeader>体重记录</BlockHeader>
      <List strong inset>
        <ListInput
          label="本次的体重?(单位kg)"
          type="number"
          accept={"number"}
          value={params.weight}
          onChange={(e) => {
            const value = e.target.value;
            updateParams((prev) => {
              return { ...prev, weight: value };
            });
          }}
          pattern="[0-9.]*"
          placeholder="请输入本次的体重单位kg"
          media={<IconFont icon="icon-yinger" />}
        />

        <ListInput
          label={`称重时间`}
          type="datetime-local"
          value={params.weightTime}
          onChange={(e) => {
            const value = e.target.value;
            updateParams((prev) => {
              return {
                ...prev,
                weightTime: value
                  ? dayjs(value).format("YYYY-MM-DD HH:mm")
                  : "",
              };
            });
          }}
          media={<IconFont icon="icon-shijianrili" />}
        />
      </List>
      <List strong inset>
        <ListButton
          onClick={() => {
            const { weight, weightTime } = params;
            const parseWeight = Number(weight);
            if (isNaN(parseWeight)) {
              alert("请输入合格的体重数据");
              return;
            }
            if (!weightTime) {
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
    </>
  );
};

Component.displayName = "Weight";
