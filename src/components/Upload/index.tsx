import { PlusOutlined } from "@ant-design/icons";
import {
    Upload,
    type UploadFile,
    type UploadProps,
    Image,
    type GetProp,
} from "antd";
import { useEffect, useState } from "react";
import { uploadByOss, type UploadResult } from "../../utils/oss";
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
    const { value = [], onChange } = props;
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [fileList, setFileList] = useState<IFileItem[]>([]);

    useEffect(() => {
        // Create a string representation of the URLs for comparison.
        const valueUrls = value.map((v) => v.url).join(",");
        const fileListDoneUrls = fileList
            .filter((f) => f.status === "done")
            .map((f) => f.url)
            .join(",");

        // Only update the internal fileList if the parent's value has changed.
        // This prevents wiping out the "uploading" status from the UI.
        if (valueUrls !== fileListDoneUrls) {
            setFileList(
                value.map((item) => ({
                    uid: item.url,
                    name: item.fileName,
                    status: "done",
                    url: item.url,
                    response: item,
                })),
            );
        }
    }, [value, fileList]);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        // Update the internal state immediately for UI responsiveness.
        setFileList(newFileList as IFileItem[]);

        // Notify the parent component with the list of "done" files.
        const uploadResults: UploadResult[] = newFileList
            .map((item) => {
                if (item.status === "done" && item.response) {
                    return item.response as UploadResult;
                }
                return null;
            })
            .filter((item): item is UploadResult => !!item);

        onChange?.(uploadResults);
    };

    const uploadButton = (
        <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>点击上传</div>
        </button>
    );
    return (
        <>
            <Upload
                name="file"
                listType="picture-card"
                fileList={fileList}
                showUploadList={true}
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
