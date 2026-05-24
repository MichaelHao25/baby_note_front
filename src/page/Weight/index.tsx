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
  height: "",
  note: "",
};
interface IWeightRequest {
  weight: number | string;
  height: number | string;
  weightTime: string;
  note: string;
}

export const Component = () => {
  const [params, updateParams] = useState<IWeightRequest>(defaultParams);
  const [handler, { isLoading }] = useAddWeightMutation();
  return (
    <>
      <BlockHeader>体重/身高记录</BlockHeader>
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
          label="本次的身高?(单位cm)"
          type="number"
          accept={"number"}
          value={params.height}
          onChange={(e) => {
            const value = e.target.value;
            updateParams((prev) => {
              return { ...prev, height: value };
            });
          }}
          pattern="[0-9.]*"
          placeholder="请输入本次的身高单位cm"
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
            const { weight, height, weightTime } = params;
            const parseWeight = weight !== "" ? Number(weight) : undefined;
            const parseHeight = height !== "" ? Number(height) : undefined;

            if (parseWeight !== undefined && isNaN(parseWeight)) {
              alert("请输入合格的体重数据");
              return;
            }
            if (parseHeight !== undefined && isNaN(parseHeight)) {
              alert("请输入合格的身高数据");
              return;
            }
            if (parseWeight === undefined && parseHeight === undefined) {
              alert("体重和身高至少填写一项");
              return;
            }
            if (!weightTime) {
              alert("日期不能为空");
              return;
            }
            if (isLoading) {
              return;
            }

            const submitData: Record<string, unknown> = { weightTime, note: params.note };
            if (parseWeight !== undefined) submitData.weight = parseWeight;
            if (parseHeight !== undefined) submitData.height = parseHeight;

            handler(submitData).then((res) => {
              if (res?.data?.success) {
                defaultParams.weightTime = dayjs().format("YYYY-MM-DD HH:mm");
                updateParams({ ...defaultParams });
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
