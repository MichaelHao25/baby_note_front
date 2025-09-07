import Canvas from "@antv/f-react";
import { Axis, Chart, Line, Tooltip } from "@antv/f2";
import { Card } from "konsta/react";
import { useGetMilkAmountListQuery } from "../../store/apiSlice";
export async function loader() {
  return {
    title: "教师量表",
  };
}
export const Component = () => {
  const { isFetching, data } = useGetMilkAmountListQuery();
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
              field="value"
              formatter={(value) => {
                return `${value}ml`;
              }}
            />
            <Line x="date" y="value" shape={"smooth"} />
            <Tooltip />
          </Chart>
        </Canvas>
      </Card>
    </>
  );
};

Component.displayName = "Chart";
