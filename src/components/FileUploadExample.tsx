import React, { useState } from "react";
import { useUploadFileMutation } from "../store/apiSlice";

const FileUploadExample: React.FC = () => {
  const [uploadFile, { isLoading, error }] = useUploadFileMutation();
  const [uploadResult, setUploadResult] = useState<{
    url: string;
    fullurl: string;
  } | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile({ file }).unwrap();
      setUploadResult(result.data);
      console.log("文件上传成功:", result.data);
    } catch (err) {
      console.error("文件上传失败:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>文件上传示例</h3>

      <input
        type="file"
        onChange={handleFileChange}
        disabled={isLoading}
        style={{ marginBottom: "10px" }}
      />

      {isLoading && <p>上传中...</p>}

      {error && (
        <p style={{ color: "red" }}>
          上传失败: {error instanceof Error ? error.message : "未知错误"}
        </p>
      )}

      {uploadResult && (
        <div style={{ marginTop: "10px" }}>
          <h4>上传成功!</h4>
          <p>相对路径: {uploadResult.url}</p>
          <p>完整URL: {uploadResult.fullurl}</p>
          <img
            src={uploadResult.fullurl}
            alt="上传的图片"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUploadExample;
