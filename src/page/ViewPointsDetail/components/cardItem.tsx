import { Card } from "antd";
import { memo, useEffect, useState } from "react";
import cardIcon from "../../../assets/img/examine-card-img.png";

interface Props {
  data: any;
}

const CardItem = memo<Props>(({ data }) => {
  const [score, setScore] = useState<number>();

  useEffect(() => {
    // setScore(data.score)
  }, [data]);

  return (
    <Card className="min-w-40 bg-blue-300" hoverable>
      <div className="flex flex-col">
        <div className="flex justify-center items-center rounded-px relative h-30">
          <img src={cardIcon} alt="" className="h-[44px]" />
          <div className="w-[30px] h-[30px] rounded-[15px] bg-[#4880ff] flex justify-center items-center text-[#fff] absolute top-2 right-2">
            1
          </div>
        </div>
        <div className="font-bold text-sm">专业研修</div>
        <div className="text-xs text-gray-400 flex justify-between items-center">
          <span>2024-11-11</span>
          <span className="flex items-center gap-2">
            <span>积分</span>
            <span className="text-red-500 text-base">1</span>
          </span>
        </div>
      </div>
    </Card>
  );
});

export default CardItem;
