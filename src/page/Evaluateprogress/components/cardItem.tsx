import {memo, useEffect, useState} from "react";
import cardIcon from "../../../assets/img/examine-card-img.png";
import {Button, Card, InputNumber} from "antd";
import type { CardItemType } from "../type.ts";

interface Props {
    data: CardItemType
}

const CardItem = memo<Props>(({ data }) =>  {
    const [score, setScore] = useState<number>();

    useEffect(() => {
        setScore(data.score)
    }, [data]);

    return (
        <Card
            className='w-[24.2%] mr-3 mb-2 card-item'
            key={data.criterionId}
            style={{ marginRight: '10px', marginBottom: '10px' }}
            hoverable
        >
            <div className='pb-[15px] border-b border-[#eaeaea] flex'>
                <div
                    className="left-img w-[160px] h-[160px] flex justify-center items-center bg-[#fff3db] rounded-px relative"
                >
                    <img src={cardIcon} alt="" className='h-[44px]' />
                    <div
                        className='w-[30px] h-[30px] rounded-[15px] bg-[#4880ff] flex justify-center items-center text-[#fff] absolute top-2 right-2'
                    >
                        {data.dimensionSize}
                    </div>
                </div>
                <div className="right-info p-[5px] pl-[10px] flex-1">
                    <div className='flex justify-between text-[20px]'>
                        <span>{data.userName}</span>
                        <span style={{ color: data.status == 20 ? '#58db5c' : '#ffa149' }}>{data.status == 20 ? '已通过' : '待审核'}</span>
                    </div>

                    <div className='mt-[10px] flex'>
                        <div className='mr-[5px]'>归属日期:</div>
                        <div>{data.time}</div>
                    </div>
                    <div className='mt-[10px] flex'>
                        <div className='mr-[5px]'>记录类别:</div>
                        <div>{data.criterionName}</div>
                    </div>
                    <div className='mt-[10px] flex'>
                        <div className='mr-[5px]'>记录说明:</div>
                        <div className='line-clamp-2 w-[160px]'>{data.desc}</div>
                    </div>
                </div>
                <a className='detail-link absolute right-3 bottom-15 hidden'>{'详情 >'}</a>
            </div>
            <div className='pt-[10px] pb-[3px] flex justify-between'>
                <div>
                    积分: <InputNumber value={score} onChange={value => setScore(value)} />
                </div>
                {
                    data.status === 10 ? (
                        <div>
                            <Button
                                type='primary'
                                className='mr-[10px]'
                                onClick={() => {
                                    console.log('通过', data.id)
                                }}
                            >
                                通过
                            </Button>
                            <Button
                                onClick={() => {
                                    console.log('不通过', data.id)
                                }}
                            >
                                不通过
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={() => {
                                console.log('撤回', data.id)
                            }}
                        >
                            撤回
                        </Button>
                    )
                }
            </div>
        </Card>
    )
});

export default CardItem;