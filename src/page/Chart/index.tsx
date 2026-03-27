import Canvas from "@antv/f-react";
import { Axis, Chart, Line, ScrollBar, Tooltip, jsx } from "@antv/f2";
import dayjs from "dayjs";
import { Card } from "konsta/react";
import { useGetChartsQuery } from "../../store/apiSlice";

// 线性插值填充缺失的体重数据
function interpolateWeight(data: any[]) {
  if (data.length === 0) return data;

  // 找到所有有体重值的点索引
  const weightPoints = data
    .map((item, index) => ({ index, weight: item.weight }))
    .filter(
      (item) =>
        item.weight !== null && item.weight !== undefined && item.weight !== "",
    );

  if (weightPoints.length === 0) return data;

  // 只有一个值时，所有缺失点都使用该值
  if (weightPoints.length === 1) {
    return data.map((item) => ({
      ...item,
      weight: weightPoints[0].weight,
    }));
  }

  // 对缺失的点进行线性插值
  return data.map((item, index) => {
    if (
      item.weight !== null &&
      item.weight !== undefined &&
      item.weight !== ""
    ) {
      return item;
    }

    // 找到前后两个有值的点
    const prevPoint = weightPoints.filter((p) => p.index < index).pop();
    const nextPoint = weightPoints.find((p) => p.index > index);

    // 边界情况：取最近的有效值
    if (!prevPoint && nextPoint) {
      // 前面没有值，取后面第一个有值的数据
      return { ...item, weight: nextPoint.weight };
    }
    if (prevPoint && !nextPoint) {
      // 后面没有值，取前面最后一个有值的数据
      return { ...item, weight: prevPoint.weight };
    }
    if (!prevPoint && !nextPoint) {
      // 极端情况：无法插值，保持原值
      return item;
    }

    // 线性插值计算，保留两位小数
    const ratio =
      (index - prevPoint.index) / (nextPoint.index - prevPoint.index);
    const interpolatedWeight = Number(
      (
        prevPoint.weight +
        ratio * (nextPoint.weight - prevPoint.weight)
      ).toFixed(2),
    );

    return { ...item, weight: interpolatedWeight };
  });
}

// 格式化日期：每年第一天显示年份，每月第一天显示月份，其他显示日
function formatDateLabel(date: string) {
  const d = dayjs(date);
  if (d.date() === 1 && d.month() === 0) {
    // 1月1日显示年份
    return d.format("YYYY年");
  }
  if (d.date() === 1) {
    // 每月第一天显示月份
    return d.format("M月");
  }
  // 其他显示日
  return d.format("D日");
}

export async function loader() {
  return {
    title: "教师量表",
  };
}
export const Component = () => {
  const { isFetching, data } = useGetChartsQuery();

  const list = interpolateWeight(data?.data || []);
  if (isFetching || list.length === 0) {
    return "loading...";
  }
  return (
    <>
      <Card header="每天吃奶情况" contentWrapPadding="p-4 pt-0">
        <Canvas height={300} pixelRatio={window.devicePixelRatio}>
          <Chart data={list} style={{ padding: [12, 0, 0, 0] }}>
            <Axis
              field="date"
              type="timeCat"
              tickCount={4}
              formatter={(value) => formatDateLabel(value)}
              style={{
                label: { align: "between" },
              }}
            />
            <Axis
              field="milkAmount"
              formatter={(value) => {
                if (!value) return "";
                return `${value}`;
              }}
              style={{
                label: (text, index, ticks) => {
                  // 在最后一个刻度（顶部）显示单位
                  if (index === ticks.length - 1) {
                    return { text: `ml\n${text}`, fontSize: 8 };
                  }
                  return { fontSize: 8 };
                },
              }}
            />
            <Axis
              field="weight"
              formatter={(value) => {
                if (!value) return "";
                return `${value}`;
              }}
              position="right"
              style={{
                label: (text, index, ticks) => {
                  // 在最后一个刻度（顶部）显示单位
                  if (index === ticks.length - 1) {
                    return { text: `kg\n${text}`, fontSize: 8 };
                  }
                  return { fontSize: 8 };
                },
              }}
            />
            <Line
              x="date"
              y="milkAmount"
              connectNulls={true}
              color={"#1790ff"}
            />
            <Line
              x="date"
              y="weight"
              shape={"smooth"}
              color={"#8444e0"}
              connectNulls={true}
            />
            <Tooltip
              showItemMarker={false}
              customText={(record: any) => {
                const { milkAmount, weight } = record;
                return jsx(
                  "group",
                  {
                    style: {
                      display: "flex",
                      flexDirection: "row",
                    },
                  },
                  jsx("text", {
                    style: {
                      fontSize: "24px",
                      fill: "rgba(255, 255, 255, 0.65)",
                      textAlign: "start",
                      textBaseline: "middle",
                      text: `${record.date}:`,
                    },
                  }),
                  jsx("text", {
                    style: {
                      fontSize: "24px",
                      fill: "#fff",
                      textAlign: "start",
                      textBaseline: "middle",
                      text: `${milkAmount ? `牛奶:${milkAmount}ml` : ""} ${weight ? `体重:${weight}kg` : ""}`,
                    },
                  }),
                );
              }}
            />
            <ScrollBar mode="x" range={[0.8, 1]} minCount={7} />
          </Chart>
        </Canvas>
      </Card>
    </>
  );
};

Component.displayName = "Chart";
