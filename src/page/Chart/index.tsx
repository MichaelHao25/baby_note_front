import Canvas from "@antv/f-react";
import { Axis, Chart, Line, Tooltip, jsx } from "@antv/f2";
import { Card } from "konsta/react";
import { useGetChartsQuery } from "../../store/apiSlice";
export async function loader() {
  return {
    title: "教师量表",
  };
}
export const Component = () => {
  const { isFetching, data } = useGetChartsQuery();
  //   const [removeHandler, { isLoading: removeIsLoading }] =
  //     useRemoveEatItemByIdMutation();
  //   const navigate = useNavigate();

  const list = data?.data || [];
  if (isFetching || list.length === 0) {
    return "loading...";
  }
  return (
    <>
      <Card header="每天吃奶情况">
        <Canvas height={300} pixelRatio={window.devicePixelRatio}>
          <Chart data={list}>
            <Axis
              field="date"
              type="timeCat"
              tickCount={4}
              style={{
                label: { align: "between" },
              }}
            />
            <Axis
              field="milkAmount"
              formatter={(value, ...a) => {
                if (!value) {
                  return "";
                }
                debugger;
                return `${value}ml`;
              }}
            />
            <Axis
              field="weight"
              formatter={(value, ...a) => {
                if (!value) {
                  return "";
                }
                debugger;
                return `${value}kg`;
              }}
              position="right"
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
                  })
                );
              }}
            />
          </Chart>
        </Canvas>
      </Card>
    </>
  );
};

Component.displayName = "Chart";
