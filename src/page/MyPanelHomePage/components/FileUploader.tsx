import { DownloadOutlined, PlusOutlined, StarOutlined, UploadOutlined } from "@ant-design/icons";
import {
    Upload,
    type UploadFile,
    type UploadProps,
    Image,
    type GetProp,
    Button,
} from "antd";
import { useEffect, useState } from "react";
import { uploadByOss, type UploadResult } from "../../../utils/oss";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export interface IUploadWrapRef {
    getFileList: () => string[];
    setFileList: (list: string[]) => void;
}

export interface IFileItem extends UploadFile {
    url: string;
}

export interface IUploadWrapProps {
    value?: UploadResult[];
    onChange?: (value: UploadResult[]) => void;
}

export const UploadWrap = (props: IUploadWrapProps) => {
    const { value, onChange } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState<IFileItem[]>([]);
    useEffect(() => {
        if (value) {
            setFileList(
                value.map((item) => {
                    if (item.url) {
                        return {
                            uid: item.url,
                            name: item.fileName,
                            status: "done",
                            url: item.url,
                        };
                    }
                    return item as IFileItem;
                }),
            );
        }
    }, [value]);
    // {uid:'1',name:'1.png',status:'done',url:'http://127.0.0.1:3000/1.png'}

    const handlePreview = async (file: UploadFile) => {
        console.log("file", file);
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList as unknown as IFileItem[]);
        const uploadResults: UploadResult[] = newFileList
            .map((item) => {
                if (item?.response) {
                    return item.response as UploadResult;
                }
                if (item.url) {
                    return {
                        url: item.url,
                        fileName: item.name,
                    };
                }
                return null;
            })
            .filter((item): item is UploadResult => item !== null);

        onChange?.(uploadResults);
    };

    const uploadButton = (
        <Button
            icon={<UploadOutlined />}
            type="primary"
        >
            <div>点击上传</div>
        </Button>
    );
    return (
        <>
            <Upload
                name="file"
                fileList={fileList}
                showUploadList={{
                  showDownloadIcon: true,
                }}
                customRequest={async ({
                    file,
                    onError,
                    onSuccess,
                    onProgress,
                }) => {
                    try {
                        const result = await uploadByOss(
                            file as File,
                            (percent) => {
                                onProgress?.({ percent });
                            },
                        );
                        onSuccess?.(result);
                    } catch (e: any) {
                        onError?.(e);
                    }
                }}
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {uploadButton}
            </Upload>
            {previewImage && (
                <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                            !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                />
            )}
        </>
    );
};
