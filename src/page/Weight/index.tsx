import dayjs from "dayjs";
import { BlockHeader, List, ListButton, ListInput } from "konsta/react";
import { useState } from "react";
import { GlobalNotificationService } from "../../components/GlobalNotification/Notification";
import IconFont from "../../components/IconFont";
import { useAddWeightMutation } from "../../store/apiSlice";

export async function loader() {
  return {
    title: "教师量表",
  };
}
const defaultParams: IWeightRequest = {
  weightTime: dayjs().format("YYYY-MM-DD HH:mm"),
  weight: "",
  note: "",
};
interface IWeightRequest {
  /**
   * 称重时间
   */
  weight: number | string;
  /**
   * 称重记录
   */
  weightTime: string;
  /**
   * 备注
   */
  note: string;
}

export const Component = () => {
  const [params, updateParams] = useState<IWeightRequest>(defaultParams);
  const [handler, { isLoading }] = useAddWeightMutation();
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
        <ListInput
          label="备注"
          type="textarea"
          placeholder="请输入其他的备注信息"
          value={params.note as string}
          onChange={(e) =>
            updateParams((prev) => {
              return { ...prev, note: e.target.value };
            })
          }
          media={<IconFont icon="icon-jishiben" className="text-2xl" />}
          inputClassName="!h-20 resize-none"
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
            if (isLoading) {
              return;
            }

            handler({ ...params, weight: parseWeight }).then((res) => {
              if (res?.data?.success) {
                defaultParams.weightTime = dayjs().format("YYYY-MM-DD HH:mm");
                updateParams(defaultParams);
                GlobalNotificationService.next({
                  opened: true,
                  title: "添加成功",
                  subtitle: "本次记录添加成功,继续加油哦",
                  icon: <IconFont icon="icon-chenggong" className="text-3xl" />,
                  duration: 2000,
                });
              } else {
                GlobalNotificationService.next({
                  opened: true,
                  title: "添加失败",
                  subtitle: "本次记录添加失败，请稍后重试",
                  icon: <IconFont icon="icon-shibai" className="text-3xl" />,
                  duration: 2000,
                });
              }
            });
          }}
        >
          添加
        </ListButton>
      </List>
    </>
  );
};

Component.displayName = "Weight";
