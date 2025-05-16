"use client";
import { useState, useRef } from "react";
import { FiX } from "react-icons/fi";

export default function UploadInput({
  label,
  name,
  onChange,
  accept = "image/*", // 기본적으로 이미지 파일 허용
  multiple = false,
  maxSize = 10 * 1024 * 1024, // (기본값: 10MB)
  className = "",
  ...rest
}) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = multiple ? [...files] : [];
    const fileArray = Array.from(fileList);
    
    fileArray.forEach(file => {
      // 파일 크기 체크
      if (file.size > maxSize) {
        alert(`파일 크기가 너무 큽니다. ${Math.round(maxSize / 1024 / 1024)}MB 이하 파일만 업로드 가능합니다.`);
        return;
      }
      
      // 이미 추가된 파일인지 체크 (이름으로 비교)
      if (!newFiles.some(f => f.name === file.name)) {
        newFiles.push(file);
      }
    });
    
    setFiles(newFiles);
    
    // 상위 컴포넌트로 변경 이벤트 전달
    const event = {
      target: {
        name,
        value: multiple ? newFiles : newFiles[0] || null
      }
    };
    onChange(event);
  };

  const removeFile = () => {
    setFiles([]);
    
    // 상위 컴포넌트로 변경 이벤트 전달
    const event = {
      target: {
        name,
        value: null
      }
    };
    onChange(event);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full font-noto">
      {label && (
        <label
          htmlFor={name}
          className="block mb-3 text-[16px] pc:text-[20px] font-[700] text-white"
        >
          {label}
        </label>
      )}
      
      <div className="flex gap-3">
        <div className="relative w-full">
          <input
            ref={fileInputRef}
            type="file"
            id={name}
            name={name}
            onChange={handleChange}
            accept={accept}
            multiple={multiple}
            className="hidden"
            {...rest}
          />
          <div className="flex items-center w-full px-5 py-4 border-[1px] border-gray-200 bg-black text-gray200 rounded-[2px] h-[55px] pc:h-[60px] text-[14px] pc:text-[16px] font-[300]">
            {files.length > 0 ? (
              <div className="flex justify-between w-full items-center">
                <span className="truncate text-white font-[400]">{files[0].name}</span>
                <button
                  type="button"
                  onClick={removeFile}
                  className="text-white"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <span className="text-gray200">사진 업로드</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={openFileDialog}
          className="w-[105px] tablet:w-[120px] bg-black border-[1px] border-main text-main h-[55px] pc:h-[60px] rounded-[2px] text-[14px] pc:text-[16px] font-[400]"
        >
          파일 선택
        </button>
      </div>
    </div>
  );
}