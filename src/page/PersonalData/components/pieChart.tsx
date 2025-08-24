import { memo, useEffect, useRef } from "react";
import { init } from "echarts";
import * as echarts from 'echarts';

interface Props {
  options: any;
  list: any[];
  clickItem: (e: any) => void;
}
const PieChart = memo<Props>((props) => {
  const pieChartRef = useRef<any>(null);
  const myChart = useRef<any>(null);

  const initeCharts = function initeCharts() {
    var keys = Object.keys(props.list);
    var values = Object.values(props.list);

    var data = [];

    for (var i = 0; i < keys.length; i++) {
      data.push({
        name: keys[i],
        value: Number(values[i])
      });
    }

    props.options.series[0].data = data;
    myChart.current = echarts.init(pieChartRef.current);

    myChart.current.on('click', function (params) {
      // 获取被点击项的名称和数值
      var name = params.name; // var value = params.value;

      props.clickItem?.(name);
      // emits('clickItem', name); // 在控制台输出被点击项的信息
      // console.log(name + ' 被点击了，数值为：' + value);
    }); // 绘制图表

    myChart.current.setOption(props.options);
  };

  useEffect(() => {
    if (props.options && Object.keys(props.options).length) {
      if (pieChartRef.current) {
        pieChartRef.current?.dispose?.();
      }

      if (pieChartRef.current) {
        myChart.current = init(pieChartRef.current);
        myChart.current.setOption(props.options, true);
      }

      initeCharts();
    }
  }, [props.options]);

  return <div ref={pieChartRef} className="w-full h-full"></div>;
});

export default PieChart;
