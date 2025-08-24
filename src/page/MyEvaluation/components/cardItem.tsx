import { memo, useEffect, useState } from "react";
import cardIcon from "../../../assets/img/examine-card-img.png";
import { Card, Image } from "antd";
import "../index.css";
import type { CardItemType } from "../type.ts";
import dayjs from "dayjs";
import { isImageURL } from "../../../utils/file.ts";

interface Props {
  data: CardItemType;
  callback?: (event: any) => void;
}

const CardItem = memo<Props>(({ data, callback }) => {
  const fileAttrs = data?.attributes?.filter(item => item?.type == 6) || [];
  let fileCount = 0;

  const [visible, setVisible] = useState(false);

  const files = fileAttrs.filter(item => item.type == 6)[0];
  const urls = files?.files.map(item => item?.url);
  fileAttrs.forEach((item) => {
    item?.files?.forEach(() => {
      fileCount++;
    });
  });

  return (
    <Card
      className="w-4/17 mr-3 mb-2 card-item"
      style={{ marginRight: "10px", marginBottom: "10px", height: '250px' }}
      hoverable
      onClick={() => {
        callback?.(data);
      }}
    >
      <div className="pb-[15px] border-b border-[#eaeaea] flex">
        <div className="left-img w-[40%] h-40 flex justify-center items-center bg-[#fff3db] rounded-px relative">
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
            {fileCount || 0}
          </div>
        </div>
        <div className="right-info p-[5px] pl-[10px] w-[60%] overflow-hidden h-[160px]">
          <div className="flex justify-between text-[22px] font-semibold">
            <span className='w-23'>{data?.evaluation?.scaleName}</span>
            {/*<span style={{ color: data.status == 20 ? '#58db5c' : '#ffa149' }}>{data.status == 20 ? '已通过' : '待审核'}</span>*/}
          </div>

          <div className="mt-[10px] flex">
            <div className="mr-[5px] w-16">归属日期:</div>
            <div>{data.createTime ? dayjs(data.createTime * 1000).format('YYYY/MM/DD HH:mm:ss') : '-'}</div>
          </div>
          {/*<div className="mt-[10px] flex">*/}
          {/*  <div className="mr-[5px] w-[60px]">记录类别:</div>*/}
          {/*  <div>{data?.scores?.[0]?.name}</div>*/}
          {/*</div>*/}
          {/*<div className="mt-[10px] flex">*/}
          {/*  <div className="mr-[5px] w-[60px]">记录说明:</div>*/}
          {/*  <div className="line-clamp-2 w-[160px]">{data?.description || '-'}</div>*/}
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
        <a
          className="detail-link absolute right-3 bottom-18"
          onClick={() => {
            callback?.(data);
          }}
        >
          {"详情 >"}
        </a>
      </div>
      <div className="pt-[10px] flex justify-between">
        <div className="text-[15px]">
          积分: <span>{data.score}</span>
        </div>
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
