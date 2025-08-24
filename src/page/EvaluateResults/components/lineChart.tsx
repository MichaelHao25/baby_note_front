import { memo, useEffect, useRef } from "react";
import { init } from "echarts";

interface Props {
  options: any;
  clickCallback?: (e: any) => void;
}

const LineChart = memo<Props>((props) => {
  const myChartRef = useRef<any>(null);
  const lineChartRef = useRef<any>(null);

  useEffect(() => {
    if (props.options && Object.keys(props.options).length) {
      if (lineChartRef.current) {
        lineChartRef.current?.dispose?.();
      }

      if (lineChartRef.current) {
        myChartRef.current = init(lineChartRef.current);
        myChartRef.current?.on("legendselectchanged", function (event) {
          // emits('legendClick', event.selected);
          props.clickCallback?.(event.selected);
          console.log("legendClick");
        });
        myChartRef.current.setOption(props.options, true);
      }
    }
  }, [props.options]);

  return <div className="w-full h-full" ref={lineChartRef}></div>;
});

export default LineChart;
