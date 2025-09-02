import dayjs from "dayjs";
import {
  BlockHeader,
  Checkbox,
  Chip,
  List,
  ListButton,
  ListInput,
  ListItem,
} from "konsta/react";
import { useState } from "react";
import { GlobalNotificationService } from "../../components/GlobalNotification/Notification";
import IconFont from "../../components/IconFont";
import { useAddEatMutation } from "../../store/apiSlice";
import type { EatRequest } from "../../types/api";

export async function loader() {
  return {
    title: "教师量表",
  };
}

const defaultParams = {
  milkAmount: import.meta.env.DEV ? "1000" : "",
  milkTime: dayjs().format("YYYY-MM-DD HH:mm"),
  pee: false,
  poo: false,
  breastMilk: false,
  drinkWater: false,
  note: "",
};
const milkAmountList = [50, 80, 100];
export const Component = () => {
  const [params, updateParams] = useState<EatRequest>(defaultParams);
  const [handler, { isLoading }] = useAddEatMutation();
  return (
    <>
      <BlockHeader>喝奶情况</BlockHeader>
      <List strong inset>
        <ListInput
          label="这次喝奶多少ml?"
          type="number"
          accept={"number"}
          value={params.milkAmount}
          onChange={(e) => {
            const value = e.target.value;
            updateParams((prev) => {
              return { ...prev, milkAmount: Number(value) };
            });
          }}
          pattern="[0-9]*"
          placeholder="请输入本次喝奶量"
          media={<IconFont icon="icon-daichanfuwu" />}
        />

        <ListItem
          title={
            <div className="flex gap-2 w-full items-center">
              <span className=" text-nowrap text-xs">常用奶量:</span>
              {milkAmountList.map((limit) => (
                <Chip
                  key={limit}
                  outline
                  onClick={() => {
                    updateParams((prev) => {
                      return { ...prev, milkAmount: limit };
                    });
                  }}
                >
                  {limit}ml
                </Chip>
              ))}
            </div>
          }
        />
        <ListInput
          label={`喝奶时间`}
          type="datetime-local"
          value={params.milkTime}
          onChange={(e) => {
            const value = e.target.value;
            updateParams((prev) => {
              return {
                ...prev,
                milkTime: value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "",
              };
            });
          }}
          media={<IconFont icon="icon-shijianrili" />}
        />
      </List>
      <BlockHeader>其他事项</BlockHeader>
      <List strong inset>
        {[
          {
            key: "breastMilk",
            value: params.breastMilk,
            title: "母乳",
            type: "checkbox",
          },
          { key: "pee", value: params.pee, title: "小便 💦", type: "checkbox" },
          { key: "poo", value: params.poo, title: "大便 💩", type: "checkbox" },
          {
            key: "drinkWater",
            value: params.drinkWater,
            title: "喝水",
            type: "checkbox",
          },
          {
            key: "note",
            value: params.note,
            title: "喝水",
            type: "area",
          },
        ].map((item) => {
          const map = {
            checkbox: (
              <ListItem
                key={item.key}
                label
                title={item.title}
                media={
                  <Checkbox
                    checked={item.value as boolean}
                    component="div"
                    name="my-checkbox"
                    onChange={(e) =>
                      updateParams((prev) => {
                        return { ...prev, [item.key]: e.target.checked };
                      })
                    }
                  />
                }
              />
            ),
            area: (
              <ListInput
                label="备注"
                type="textarea"
                placeholder="请输入其他的备注信息"
                value={item.value as string}
                onChange={(e) =>
                  updateParams((prev) => {
                    return { ...prev, [item.key]: e.target.value };
                  })
                }
                media={<IconFont icon="icon-jishiben" className="text-2xl" />}
                inputClassName="!h-20 resize-none"
              />
            ),
          };
          return map[item.type as keyof typeof map];
        })}
      </List>
      <List strong inset>
        <ListButton
          onClick={() => {
            if (isLoading) {
              return;
            }
            const parseMilkAmount = Number(params.milkAmount);
            if (isNaN(parseMilkAmount)) {
              alert("请输入合法的奶量数字");
              return;
            }
            handler({ ...params, milkAmount: parseMilkAmount }).then((res) => {
              if (res?.data?.success) {
                defaultParams.milkTime = dayjs().format("YYYY-MM-DD HH:mm");
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

Component.displayName = "Home";
