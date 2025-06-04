"use client";
import { useState } from "react";

export default function TokenInput({
  initialValue = "",
  onChange,
  placeholder = "숫자만 입력",
  tokenSymbol = "P",
  width = "w-[245px]", // 기본 너비 조정
  height = "h-[50px]", // 기본 높이 조정
  className = "",
}) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    // 숫자만 입력 허용
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    setValue(inputValue);
    if (onChange) onChange(inputValue);
  };

  // 입력값 유무에 따라 스타일 변경
  const inputStyle = value
    ? "text-white font-[400]"
    : "text-gray200 font-[300]";

  return (
    <div className={`font-noto ${width}`}>
      <div className={`relative ${height} ${className}`}>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full h-full px-5 py-3 border-[1px] border-gray200 rounded-[2px] ${inputStyle} bg-gray500 text-[16px] font-[300] placeholder:text-gray200`}
        />

        <div className="absolute top-0 right-0 h-full flex items-center px-3 text-white text-[20px] font-[700]">
          {tokenSymbol}
        </div>
      </div>
    </div>
  );
}
