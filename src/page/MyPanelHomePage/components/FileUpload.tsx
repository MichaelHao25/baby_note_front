import React, { useEffect, useState } from "react";
import { useUploadFileMutation } from "../../../store/apiSlice";
import { CloseCircleOutlined, FileDoneOutlined, PlusOutlined } from "@ant-design/icons";

interface FileType {
  url: string;
  fullurl: string;
}

interface Props {
  uploadSuccess: (file: FileType, result: FileType[]) => void;
  fileProps: FileType;
}

const FileUploadExample: React.FC<Props> = ({ uploadSuccess, fileProps }) => {
  const [uploadFile, { isLoading, error }] = useUploadFileMutation();
  const [uploadResult, setUploadResult] = useState<{
    url: string;
    fullurl: string;
  }[] | null>([]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile({ file }).unwrap();
      setUploadResult(() => {
        return [...uploadResult, { url: result.data.fullurl, fullurl: result.data.fullurl }]
      });

      uploadSuccess?.(result.data, [...uploadResult, result.data]);
    } catch (err) {
      console.error("文件上传失败:", err);
    }
  };

  function isImageByExtension(filename) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const ext = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  }

  useEffect(() => {
    if (fileProps) {
      setUploadResult(fileProps);
    }
  }, [fileProps])

  return (
    <div style={{ padding: "20px" }}>

      {isLoading && <p>上传中...</p>}

      {error && (
        <p style={{ color: "red" }}>
          上传失败: {error instanceof Error ? error.message : "未知错误"}
        </p>
      )}

      {uploadResult && uploadResult?.length ? (
        <div className='flex'>
          {
            uploadResult.map((item, i) => (
              <div style={{ margin: "10px", textAlign: "center" }}>
                {/*<h4>上传成功!</h4>*/}
                {/*<p>相对路径: {uploadResult.url}</p>*/}
                {/*<p>完整URL: {uploadResult.fullurl}</p>*/}
                {
                  isImageByExtension(item.url) ? (
                    <img
                      src={item.url}
                      alt="上传的图片"
                      style={{ width: "60px", height: "60px" }}
                    />
                  ) : (
                    <div>
                      <FileDoneOutlined style={{ fontSize: '30px' }} />
                    </div>
                  )
                }
                <CloseCircleOutlined style={{ color: "red", cursor: "pointer" }} onClick={() => {
                  const results = [...uploadResult];
                  results.splice(i, 1);
                  setUploadResult(results)
                }} />
              </div>
            ))
          }
        </div>
      ) : null}

      <div className="bg-[#f6f6f6]">
        <div className="p-[10px]">附件提交</div>

        <div className="flex items-center justify-center py-[5px] border-t border-[#d1d1d1] text-[#6ea1ed] cursor-pointer">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isLoading}
            style={{ marginBottom: "10px" }}
          />
          {/*<PlusOutlined />*/}
        </div>
      </div>

    </div>
  );
};

export default FileUploadExample;
