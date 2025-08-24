import { memo, useEffect, useState } from "react";
import cardIcon from "../../../assets/img/examine-card-img.png";
import { Button, Card, InputNumber } from "antd";
import type { Record } from "../type.ts";
import dayjs from "dayjs";

interface Props {
  data: Record;
}

const CardItem = memo<Props>(({ data }) => {
  const [score, setScore] = useState<number>();

  useEffect(() => {
    // setScore(data.score)
  }, [data]);

  return (
    <Card
      className="w-[30%] mr-3 mb-2 card-item"
      style={{ marginRight: "10px", marginBottom: "10px" }}
      hoverable
    >
      <div className="flex">
        <div className="left-img w-[160px] h-[160px] flex justify-center items-center bg-[#fff3db] rounded-px relative">
          <img src={cardIcon} alt="" className="h-[44px]" />
          <div className="w-[30px] h-[30px] rounded-[15px] bg-[#4880ff] flex justify-center items-center text-[#fff] absolute top-2 right-2">
            {/*{data.levelSum}*/}1
          </div>
        </div>
        <div className="right-info p-[5px] pl-[10px] flex-1">
          <div className="flex justify-between text-[20px]">
            <span>{data.teacherName}</span>
            <span style={{ color: data.status == 20 ? "#ffa149" : "#58db5c" }}>
              {data.levelSum}
            </span>
          </div>

          <div className="mt-[10px] flex">
            <div className="mr-[5px] w-[70px]">归属日期:</div>
            <div>{dayjs(data.dataTime).format("YYYY年M月D日")}</div>
          </div>
          <div className="mt-[10px] flex">
            <div className="mr-[5px] w-[70px]">记录类别:</div>
            <div>{data.name}</div>
          </div>
          <div className="mt-[10px] flex">
            <div className="mr-[5px] w-[70px]">记录说明:</div>
            <div className="line-clamp-2 w-[160px]">{data.desc}</div>
          </div>
        </div>
        <a className="detail-link absolute right-3 bottom-3 hidden">
          {"详情 >"}
        </a>
      </div>
      {/*<div className='pt-[10px] pb-[3px] flex justify-between'>*/}
      {/*    <div>*/}
      {/*        积分: <InputNumber value={score} onChange={value => setScore(value)} />*/}
      {/*    </div>*/}
      {/*    {*/}
      {/*        data.status === 10 ? (*/}
      {/*            <div>*/}
      {/*                <Button*/}
      {/*                    type='primary'*/}
      {/*                    className='mr-[10px]'*/}
      {/*                    onClick={() => {*/}
      {/*                        console.log('通过', data.id)*/}
      {/*                    }}*/}
      {/*                >*/}
      {/*                    通过*/}
      {/*                </Button>*/}
      {/*                <Button*/}
      {/*                    onClick={() => {*/}
      {/*                        console.log('不通过', data.id)*/}
      {/*                    }}*/}
      {/*                >*/}
      {/*                    不通过*/}
      {/*                </Button>*/}
      {/*            </div>*/}
      {/*        ) : (*/}
      {/*            <Button*/}
      {/*                onClick={() => {*/}
      {/*                    console.log('撤回', data.id)*/}
      {/*                }}*/}
      {/*            >*/}
      {/*                撤回*/}
      {/*            </Button>*/}
      {/*        )*/}
      {/*    }*/}
      {/*</div>*/}
    </Card>
  );
});

export default CardItem;
