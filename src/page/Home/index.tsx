import dayjs from "dayjs";
import {
  BlockHeader,
  Chip,
  List,
  ListButton,
  ListInput,
  ListItem,
} from "konsta/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { GlobalNotificationService } from "../../components/GlobalNotification/Notification";
import IconFont from "../../components/IconFont";
import { useAddEatMutation, useGetBabyQuery } from "../../store/apiSlice";
import type { EatRequest } from "../../types/api";
import { getAge, getCorrectedAge, getCorrectedDaysSinceBirth, getDaysSinceBirth, getZodiac, getZodiacEmoji } from "../../utils/baby";

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
  solidFoods: [] as string[],
  note: "",
};

const milkAmountList = [50, 80, 100];

const solidFoodPresets = [
  "米糊",
  "菜泥",
  "肉泥",
  "水果泥",
  "蛋黄",
  "米粉",
  "粥",
  "面条",
];

export const Component = () => {
  const [params, updateParams] = useState<EatRequest>(defaultParams);
  const [handler, { isLoading }] = useAddEatMutation();
  const { data: babyData } = useGetBabyQuery();
  const navigate = useNavigate();
  const baby = babyData?.data;

  const toggleSolidFood = (food: string) => {
    updateParams((prev) => {
      const foods = prev.solidFoods ?? [];
      const next = foods.includes(food)
        ? foods.filter((f) => f !== food)
        : [...foods, food];
      return { ...prev, solidFoods: next };
    });
  };

  const [customFood, setCustomFood] = useState("");

  const addCustomFood = () => {
    const food = customFood.trim();
    if (!food) return;
    updateParams((prev) => {
      const foods = prev.solidFoods ?? [];
      if (foods.includes(food)) return prev;
      return { ...prev, solidFoods: [...foods, food] };
    });
    setCustomFood("");
  };

  return (
    <>
      {/* 宝宝信息卡片 */}
      {baby && (
        <>
          <BlockHeader>宝宝信息</BlockHeader>
          <List strong inset>
            <ListItem
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-lg">
                    {getZodiacEmoji(baby.birthDate)} {baby.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {baby.prematureDays > 0
                      ? `出生${getDaysSinceBirth(baby.birthDate)}天，纠正后${getCorrectedDaysSinceBirth(baby.birthDate, baby.prematureDays)}天`
                      : `出生${getDaysSinceBirth(baby.birthDate)}天`}
                  </span>
                </div>
              }
              subtitle={
                baby.prematureDays > 0
                  ? `${getZodiac(baby.birthDate)} | ${getAge(baby.birthDate)} | 纠正：${getCorrectedAge(baby.birthDate, baby.prematureDays)}`
                  : `${getZodiac(baby.birthDate)} | ${getAge(baby.birthDate)}`
              }
              link
              onClick={() => navigate("/baby")}
            />
          </List>
        </>
      )}

      {/* 喝奶情况 */}
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
              <span className="text-nowrap text-xs">常用奶量:</span>
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

      {/* 这次辅食 */}
      <BlockHeader>这次辅食</BlockHeader>
      <List strong inset>
        <ListItem
          title={
            <div className="flex flex-wrap gap-2 items-center">
              {solidFoodPresets.map((food) => (
                <Chip
                  key={food}
                  outline
                  onClick={() => toggleSolidFood(food)}
                  className={
                    (params.solidFoods ?? []).includes(food)
                      ? "!bg-blue-500 !text-white"
                      : ""
                  }
                >
                  {food}
                </Chip>
              ))}
            </div>
          }
        />
        <ListItem
          title={
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="自定义辅食"
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 h-8"
              />
              <Chip onClick={addCustomFood}>添加</Chip>
            </div>
          }
        />
        {(params.solidFoods ?? []).length > 0 && (
          <ListItem
            title={
              <div className="flex flex-wrap gap-2">
                {(params.solidFoods ?? []).map((food) => (
                  <Chip
                    key={food}
                    className="!bg-blue-100"
                    deleteButton
                    onDelete={() => toggleSolidFood(food)}
                  >
                    {food}
                  </Chip>
                ))}
              </div>
            }
          />
        )}
      </List>

      {/* 其他事项 */}
      <BlockHeader>其他事项</BlockHeader>
      <List strong inset>
        {[
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
            title: "备注",
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
                  <input
                    type="checkbox"
                    checked={item.value as boolean}
                    onChange={(e) =>
                      updateParams((prev) => {
                        return { ...prev, [item.key]: e.target.checked };
                      })
                    }
                    className="w-5 h-5"
                  />
                }
              />
            ),
            area: (
              <ListInput
                key={item.key}
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