import { memo, useEffect, useState } from "react";
import cardIcon from "../../../assets/img/examine-card-img.png";
import { Button, Card, Image, InputNumber } from "antd";
import type { CardItemType } from "../type.ts";
import { isImageURL } from "../../../utils/file.ts";
import dayjs from "dayjs";

interface Props {
  data: CardItemType;
  callback: (type: string, data: { id: number; score: number; type: string }) => void;
}

const CardItem = memo<Props>(({ data, callback }) => {
  const [score, setScore] = useState<number>();
  const fileAttrs = data?.attributes?.filter(item => item?.type == 6) || [];
  let fileCount = 0;

  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('0');

  const files = fileAttrs.filter(item => item.type == 6)[0];
  const urls = files?.files.map(item => item?.url);
  fileAttrs.forEach((item) => {
    item?.files?.forEach(() => {
      fileCount++;
    });
  });

  useEffect(() => {
    setScore(data.score);
    const checkResult = data?.checkResult;
    if (checkResult) {
      const curStatus = Object.values(checkResult)[0]?.status || '2';
      setStatus(curStatus);
    }
  }, [data]);

  return (
    <Card
      className="w-[24.2%] mr-3 mb-2 card-item"
      key={data.criterionId}
      style={{ marginRight: "10px", marginBottom: "10px" }}
      onClick={() => callback?.('detail', data)}
      hoverable
    >
      <div className="pb-[15px] border-b border-[#eaeaea] flex">
        <div className="left-img w-[160px] h-[160px] flex justify-center items-center bg-[#fff3db] rounded-px relative">
          {
            isImageURL(urls?.[0]) ? (
                <img
                    className='w-40 h-40 '
                    src={urls[0]}
                    onClick={() => setVisible(true)}
                />
            ) : (
                <img src={cardIcon} alt="" className="h-[44px]" />
            )
          }
          <div className="w-[30px] h-[30px] rounded-[15px] bg-[#4880ff] flex justify-center items-center text-[#fff] absolute top-2 right-2">
            {data.dimensionSize}
          </div>
        </div>
        <div className="right-info p-[5px] pl-[10px] flex-1 overflow-hidden h-[160px]">
          <div className="flex justify-between text-[20px]">
            <span>{data.userName}</span>
            <span style={{ color: data.status == 20 ? "#58db5c" : "#ffa149" }}>
              {status == '0' ? "待审核" : status == '1' ? "已通过" : '未通过'}
            </span>
          </div>

          <div className="mt-[10px] flex">
            <div className="mr-[5px] w-16">归属日期:</div>
            <div>{data.dataTime}</div>
          </div>
          {/*<div className="mt-[10px] flex">*/}
          {/*  <div className="mr-[5px]">记录类别:</div>*/}
          {/*  <div>{data.dimensionJsons?.[0]?.name}</div>*/}
          {/*</div>*/}
          {
            data?.attributes?.map(item => {
              return (
                <div className="mt-[10px] flex">
                  <div className="mr-[5px] w-16">{item.name}:</div>
                  <div className="line-clamp-2 flex-1">{item?.value.join('、') || '-'}</div>
                </div>
              )
            })
          }
        </div>
        <a className="detail-link absolute right-3 bottom-15 hidden" onClick={() => callback?.('detail', data)}>
          {"详情 >"}
        </a>
      </div>
      <div className="pt-[10px] pb-[3px] flex justify-between">
        <div>
          积分:{" "}
          <InputNumber value={score} onChange={(value) => setScore(value)} />
        </div>
        {status == '0' ? (
          <div>
            <Button
              type="primary"
              className="mr-[10px]"
              onClick={() => {
                console.log("通过", data.id);
                callback?.('audit', {
                  id: data.id,
                  score,
                  type: 1,
                  ...data
                });
              }}
            >
              通过
            </Button>
            <Button
              onClick={() => {
                console.log("不通过", data.id);
                callback?.('audit', {
                    id: data.id,
                    score,
                    type: 2,
                  ...data
                });
              }}
            >
              不通过
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => {
              console.log("撤回", data.id);
            }}
          >
            撤回
          </Button>
        )}
      </div>

      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
          {
            urls?.map(item => <Image src={item} />)
          }
        </Image.PreviewGroup>
      </div>
    </Card>
  );
});

export default CardItem;
