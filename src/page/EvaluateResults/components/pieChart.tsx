import { memo, useEffect, useRef } from "react";
import { init } from "echarts";

interface Props {
  options: any;
}
const PieChart = memo<Props>((props) => {
  const pieChartRef = useRef<any>(null);
  const myChart = useRef<any>(null);

  useEffect(() => {
    console.log(props.options);
    if (props.options && Object.keys(props.options).length) {
      if (pieChartRef.current) {
        pieChartRef.current?.dispose?.();
      }

      if (pieChartRef.current) {
        myChart.current = init(pieChartRef.current);
        myChart.current.setOption(props.options, true);
      }
    }
  }, [props.options]);

  return <div ref={pieChartRef} className="w-full h-full"></div>;
});

export default PieChart;
