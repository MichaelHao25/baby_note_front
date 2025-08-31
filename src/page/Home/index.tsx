import dayjs from "dayjs";
import {
  BlockHeader,
  Button,
  Checkbox,
  Chip,
  Link,
  List,
  ListButton,
  ListInput,
  ListItem,
} from "konsta/react";
import { useEffect, useState } from "react";
import { GlobalToastService } from "../../components/GlobalToast/Toast";
import IconFont from "../../components/IconFont";

export async function loader() {
  return {
    title: "教师量表",
  };
}
interface IParams {
  /**
   * 奶量单位ml
   */
  milkAmount: number;
  /**
   * 吃奶时间
   */
  milkTime: string;
  /**
   * 小便
   */
  pee: boolean;
  /**
   * 大便
   */
  poo: boolean;
}
export const Component = () => {
  const [params, updateParams] = useState<IParams>({
    milkAmount: 0,
    milkTime: dayjs().format("YYYY-MM-DD HH:mm"),
    pee: false,
    poo: false,
  });
  const milkAmountList = [50, 80, 100];
  useEffect(() => {
    setTimeout(() => {
      GlobalToastService.next({
        opened: true,
        position: "center",
        children: "1111",
        button: (
          <Button
            rounded
            clear
            small
            inline
            onClick={() => {
              GlobalToastService.next(null);
            }}
          >
            关闭
          </Button>
        ),
      });
    }, 1000 * 10);
  }, []);
  return (
    <>
      <BlockHeader>
        <span className="flex gap-2 items-center justify-between w-full">
          <span>喝奶情况</span>
          <span className="flex gap-2">
            <Link
              onClick={() => {
                console.log("333");
              }}
            >
              <IconFont icon="icon-iconfontup" className="text-2xl" />
            </Link>
            <Link
              onClick={() => {
                console.log("333");
              }}
            >
              <IconFont icon="icon-iconfontdown" className="text-2xl" />
            </Link>
          </span>
        </span>
      </BlockHeader>
      <List strong inset>
        <ListInput
          label="这次喝奶多少ml?"
          type="number"
          accept={"number"}
          value={params.milkAmount}
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
      <BlockHeader>大小便情况</BlockHeader>
      <List strong inset>
        {[
          { key: "pee", value: params.pee, title: "小便 💦" },
          { key: "poo", value: params.poo, title: "大便 💩" },
        ].map((item) => {
          return (
            <ListItem
              key={item.key}
              label
              title={item.title}
              media={
                <Checkbox
                  checked={item.value}
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
          );
        })}
      </List>
      <List strong inset>
        <ListButton>添加</ListButton>
      </List>
    </>
  );
};

Component.displayName = "Home";
