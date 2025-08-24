import {memo, useImperativeHandle, useState} from "react";
import { Button, Drawer, type GetProp, message, Table, Upload, type UploadProps } from "antd";
import type {DataType} from "../index.tsx";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

interface Props {
    onRef: any,
    callBack: (event: any) => void
}

const EvaluateModal = memo<Props>(({onRef, callBack}) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('标题');

    const [data, setData] = useState<DataType[]>([]);

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();


    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const uploadButton = (
      <button style={{ border: 0, background: 'none' }} type="button">
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    );

    const columns = [
        {
            title: '导入时间',
            dataIndex: 'time',
            align: 'center',
            key: 'time',
        },
        {
            title: '操作人',
            dataIndex: 'operator',
            align: 'center',
            key: 'operator',
        },
        {
            title: '导入文件',
            dataIndex: 'importFile',
            align: 'center',
            key: 'importFile',
        },
        {
            title: '导入文件',
            dataIndex: 'importFile',
            align: 'center',
            key: 'importFile',
        },
        {
            title: '错误信息',
            dataIndex: 'errInfo',
            align: 'center',
            key: 'errInfo',
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            key: 'action',
        }
    ];

    const showDrawer = (info: DataType) => {
        // setTitle(info.name);
        // setData(list);
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    //用useImperativeHandle暴露一些外部ref能访问的属性
    useImperativeHandle(onRef, () => {
        // 需要将暴露的接口返回出去
        return {
            open: showDrawer,
            close: onClose
        };
    });

    return (
        <Drawer
            title={title}
            closable={{'aria-label': 'Close Button'}}
            onClose={onClose}
            width={700}
            open={open}
        >
            <div className='flex justify-between pb-[15px] border-b border-[#edeff2]'>
                <Button>下载量表导入模板</Button>
                <Button>确定导入</Button>
            </div>

            <div className='flex my-[15px] items-center'>
                <div className='w-[100px]'>
                    导入Excel文件
                </div>
                <div>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </div>
            </div>

            <Table
                size='small'
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
            />
        </Drawer>
    )
});

export default EvaluateModal;