/**
 * 生长曲线图表组件
 * 基于 @antv/f2 实现，支持 WS/T 423-2022 标准曲线展示
 */

import Canvas from "@antv/f-react";
import { Axis, Chart, jsx, Legend, Line, Tooltip } from "@antv/f2";
import { Card } from "konsta/react";
import { memo, useMemo } from "react";
import type { GrowthChartConfig } from "../../types/growth";
import { getGrowthChartData, getMetricInfo, separateDataByType } from "./utils";

// 标准曲线颜色
const STD_COLORS: Record<string, string> = {
  p3: "#ff4d4f",
  p10: "#ff7a45",
  p25: "#ffc53d",
  p50: "#52c41a",
  p75: "#ffc53d",
  p90: "#ff7a45",
  p97: "#ff4d4f",
};

const ACTUAL_COLOR = "#1890ff";

interface GrowthChartProps {
  config: GrowthChartConfig;
  height?: number;
  className?: string;
}

export const GrowthChart = memo<GrowthChartProps>(
  ({ config, height = 300, className = "" }) => {
    const { metric, gender, curveType, babyData = [], babyInfo } = config;

    const metricInfo = useMemo(() => getMetricInfo(metric), [metric]);

    // 准备各条标准曲线数据和实际数据
    const { standardLines, actualPoints } = useMemo(() => {
      const allData = getGrowthChartData(
        metric,
        gender,
        curveType,
        babyData,
        babyInfo,
      );
      const { standard, actual } = separateDataByType(allData);

      // 按百分位分组
      const lines: Record<string, typeof standard> = {};
      for (const point of standard) {
        if (!lines[point.type]) lines[point.type] = [];
        lines[point.type].push(point);
      }

      return { standardLines: lines, actualPoints: actual };
    }, [metric, gender, curveType, babyData, babyInfo]);

    // 计算坐标轴范围
    const allValues = useMemo(() => {
      const vals: number[] = [];
      Object.values(standardLines)
        .flat()
        .forEach((d) => vals.push(d.value));
      actualPoints.forEach((d) => vals.push(d.value));
      return vals;
    }, [standardLines, actualPoints]);

    const allAges = useMemo(() => {
      const ages: number[] = [];
      Object.values(standardLines)
        .flat()
        .forEach((d) => ages.push(d.age));
      actualPoints.forEach((d) => ages.push(d.age));
      return ages;
    }, [standardLines, actualPoints]);

    if (allValues.length === 0) {
      return (
        <Card className={className}>
          <div className="p-4 text-center text-gray-400">暂无数据</div>
        </Card>
      );
    }

    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const maxAge = Math.max(...allAges);

    const data = Object.values(standardLines).flat().concat(actualPoints);
    console.log(data);

    return (
      <>
        <Canvas height={height} pixelRatio={window.devicePixelRatio}>
          <Chart
            data={data}
            scale={{
              age: {
                type: "linear",
                min: 0,
                max: maxAge * 1.05,
                tickCount: 6,
              },
              value: {
                min: minVal * 0.95,
                max: maxVal * 1.05,
                tickCount: 5,
              },
            }}
          >
            <Axis
              field="age"
              style={{
                label: (text: string) => {
                  //   const num = Number(text);
                  return {
                    text: text,
                    fontSize: 10,
                  };
                },
              }}
            />
            <Axis
              field="value"
              style={{
                label: (text: string, index: number, ticks: string[]) => {
                  if (index === ticks.length - 1) {
                    return {
                      text: `${metricInfo.unit}\n${text}`,
                      fontSize: 10,
                    };
                  }
                  return { fontSize: 10 };
                },
              }}
            />
            <Line
              x="age"
              y="value"
              color="type"
              // color={STD_COLORS.p50}
              data={standardLines.p50}
            />
            <Legend
              itemFormatter={(_: string, tickValue: string) => {
                const labels: Record<string, string> = {
                  actual: "实际测量",
                  p3: "下限(P3)",
                  p10: "偏低(P10)",
                  p25: "中下(P25)",
                  p50: "中位线(P50)",
                  p75: "中上(P75)",
                  p90: "偏高(P90)",
                  p97: "上限(P97)",
                };
                return labels[tickValue] ?? tickValue;
              }}
            />
            <Tooltip
              showItemMarker={false}
              customContent
              customText={(record: any) => {
                const { value, type } = record;
                const unit = metricInfo.unit;
                const typeLabels: Record<string, string> = {
                  actual: "实际测量",
                  p3: "下限",
                  //   (P3)
                  p10: "偏低",
                  //   (P10)
                  p25: "中下",
                  //   (P25)
                  p50: "中位线",
                  //   (P50)
                  p75: "中上",
                  //   (P75)
                  p90: "偏高",
                  //   (P90)
                  p97: "上限",
                  //   (P97)
                };
                const label = typeLabels[type] ?? type;

                return jsx(
                  "group",
                  { style: { display: "flex", flexDirection: "column" } },
                  jsx("text", {
                    style: {
                      fontSize: "22px",
                      fill: "#fff",
                      textAlign: "start",
                      textBaseline: "middle",
                      text: `${label}: ${value}${metricInfo.unit}`,
                    },
                  }),
                  //   unit
                  //     ? jsx("text", {
                  //         style: {
                  //           fontSize: "18px",
                  //           fill: "rgba(255,255,255,0.75)",
                  //           textAlign: "start",
                  //           textBaseline: "middle",
                  //           text: unit,
                  //         },
                  //       })
                  //     : null,
                );
              }}
            />
          </Chart>
        </Canvas>
      </>
    );
  },
);

GrowthChart.displayName = "GrowthChart";

export default GrowthChart;
