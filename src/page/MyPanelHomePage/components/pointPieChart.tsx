import { memo, useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

interface Props {
  single: boolean;
  seriesData: any[];
  hoverCallback?: () => void;
}

const PointPieChart = memo<Props>((props) => {
  const pieChartRef = useRef(null);
  const myChart = useRef<any>(null);

  const [option, setOption] = useState({
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: [0, "40%"],
        center: ["50%", "50%"],
        label: {
          show: true,
          position: "inner",
          fontSize: 12,
          color: "#fff",
          rotate: "radial",
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          scale: false,
          drag: false,
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        data: [],
      },
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "85%"],
        center: ["50%", "50%"],
        label: {
          position: "inner",
          fontSize: 12,
          color: "#fff",
          rotate: "radial",
        },
        labelLine: {
          length: 10,
        },
        itemStyle: {
          // 设置白线的颜色和宽度
          borderColor: "#fff",
          borderWidth: 1,
        },
        data: [],
      },
    ],
  });

  const splitString = function splitString(str: string) {
    if (str.length > 5) {
      var splitIndex = Math.floor(str.length / 2);
      return ""
        .concat(str.substring(0, splitIndex), "\n")
        .concat(str.substring(splitIndex));
    }

    return str;
  }; // 生成随机字符串的方法

  const configData = () => {
    if (myChart.current) {
      myChart.current.dispose();
    }

    if (props.single || (!props.single && props.seriesData.length == 1)) {
      option.title = [
        {
          text: splitString(props.seriesData[0].name),
          // 主标题
          textStyle: {
            // 主标题样式
            color: "#fff",
            fontSize: 14,
            fontWeight: "400",
          },
          left: "center",
          // 定位到适合的位置
          top: props.seriesData[0].name.length > 5 ? "44%" : "46%", // 定位到适合的位置
        },
      ];

      if (!props.single && props.seriesData.length == 1) {
        option.series[0].label.show = false;
        option.title[0].top = "46%";
      }
    }

    option.series[0].data = props.seriesData.map(function (item) {
      return Object.assign(
        Object.assign({}, item),
        {},
        {
          name: splitString(item.name),
        },
      );
    });
    option.series[1].data = props.seriesData.flatMap(function (item) {
      if (item.children) {
        return item.children.map(function (child) {
          return {
            name: splitString(child.name),
            value: child.value,
            itemStyle: child.itemStyle,
          };
        });
      }
    }); //过滤掉无数据的

    option.series[0].data = option.series[0].data.filter(function (item) {
      return item.value;
    });
    option.series[1].data = option.series[1].data.filter(function (item) {
      return item.value;
    });

    if (pieChartRef.current) {
      myChart.current = echarts.init(pieChartRef.current);
      myChart.current.setOption(option, true);
      myChart.current.on("mouseover", function (params) {
        if (params.seriesType === "pie") {
          let dataTemp = {};

          for (let i = 0; i < props.seriesData.length; i++) {
            if (props.seriesData[i].name == params.name.replace("\n", "")) {
              dataTemp = props.seriesData[i];
            } else {
              for (let j = 0; j < props.seriesData[i].children.length; j++) {
                if (
                  props.seriesData[i].children[j].name ==
                  params.name.replace("\n", "")
                )
                  dataTemp = props.seriesData[i];
              }
            }
          }

          props.hoverCallback?.(dataTemp);
        }
      });
    }
  };

  useEffect(() => {
    setOption({
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: [0, "40%"],
          center: ["50%", "50%"],
          label: {
            show: !props.single,
            position: "inner",
            fontSize: 12,
            color: "#fff",
            rotate: props.single ? "" : "radial",
          },
          labelLine: {
            show: false,
          },
          emphasis: {
            scale: false,
            drag: false,
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 1,
          },
          data: [],
        },
        {
          name: "Access From",
          type: "pie",
          radius: props.single ? ["50%", "70%"] : ["40%", "85%"],
          center: ["50%", "50%"],
          label: {
            position: props.single ? "outside" : "inner",
            fontSize: 12,
            color: props.single ? "#333" : "#fff",
            rotate: props.single ? "" : "radial",
          },
          labelLine: {
            length: 10,
          },
          itemStyle: {
            // 设置白线的颜色和宽度
            borderColor: "#fff",
            borderWidth: 1,
          },
          data: [],
        },
      ],
    });
  }, [props]);

  useEffect(() => {
    configData();
  }, [option, props.seriesData]);

  return <div className="w-full h-full" ref={pieChartRef}></div>;
});

export default PointPieChart;
