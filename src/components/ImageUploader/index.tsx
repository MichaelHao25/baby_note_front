import { useState, useRef, useEffect } from 'react';
import { compressImage } from '../../utils/compress';
import {
  useUploadFilesMutation,
  useDeleteFilesMutation,
} from '../../store/apiSlice';
import type { UploadFileResult } from '../../types/api';

interface UploadedFile {
  url: string;
  key: string;
}

interface ImageUploaderProps {
  maxCount?: number;
  value?: string[];
  onChange?: (urls: string[]) => void;
  module: string;
  readOnly?: boolean;
}

export const ImageUploader = ({
  maxCount = 9,
  value = [],
  onChange,
  module,
  readOnly = false,
}: ImageUploaderProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    () => value.map((url) => ({ url, key: '' }))
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadFiles] = useUploadFilesMutation();
  const [deleteFiles] = useDeleteFilesMutation();

  // 标记是否为组件内部触发的变更，避免 useEffect 覆盖 key
  const isInternalChange = useRef(false);

  // 外部 value 变化时同步（仅在外部重置如提交成功时生效）
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    setUploadedFiles(value.map((url) => ({ url, key: '' })));
  }, [value]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remaining = maxCount - uploadedFiles.length;
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    try {
      const compressed = await Promise.all(toUpload.map((f) => compressImage(f)));
      const formData = new FormData();
      compressed.forEach((f) => formData.append('files', f));
      const res = await uploadFiles({ module, formData }).unwrap();
      const newFiles = (res as { data: UploadFileResult[] }).data;
      const updated = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updated);
      isInternalChange.current = true;
      onChange?.(updated.map((f) => f.url));
    } catch (err) {
      console.error('上传失败', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (index: number) => {
    const file = uploadedFiles[index];
    if (file.key) {
      try {
        await deleteFiles([file.key]).unwrap();
      } catch (err) {
        console.error('删除 OSS 文件失败', err);
      }
    }
    const updated = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updated);
    isInternalChange.current = true;
    onChange?.(updated.map((f) => f.url));
  };

  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      {uploadedFiles.map((file, index) => (
        <div key={file.url} className="relative aspect-square rounded-lg overflow-hidden">
          <img src={file.url} className="w-full h-full object-cover" alt="" />
          {!readOnly && (
            <button
              className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full text-white text-xs flex items-center justify-center"
              onClick={() => handleRemove(index)}
            >
              ×
            </button>
          )}
        </div>
      ))}
      {!readOnly && uploadedFiles.length < maxCount && (
        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileSelect}
          />
          {uploading ? (
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-3xl text-gray-400">+</span>
          )}
        </label>
      )}
    </div>
  );
};
