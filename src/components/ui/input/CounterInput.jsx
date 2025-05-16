"use client";
import { useState } from "react";

export default function CounterInput({
  initialValue = 1,
  min = 1,
  max = 999,
  onChange,
  maxText,
  width = "w-[176px]", // 기본 너비 조정
  height = "h-[50px]", // 기본 높이 조정
  className = "",
}) {
  const [value, setValue] = useState(initialValue);

  const handleIncrease = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  const handleDecrease = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      if (onChange) onChange(newValue);
    }
  };

  return (
    <div className="font-noto flex items-center">
      <div className={`flex justify-between items-center border-[1px] border-white rounded-[2px] bg-gray500 ${width} ${height} ${className}`}>
        <button
          type="button"
          onClick={handleDecrease}
          className="text-white text-[20px] font-[400] w-12 flex justify-center items-center"
          disabled={value <= min}
        >
          −
        </button>
        
        <span className="text-white text-[20px] font-[400] flex-1 text-center">
          {value}
        </span>
        
        <button
          type="button"
          onClick={handleIncrease}
          className="text-white text-[20px] font-[400] w-12 flex justify-center items-center"
          disabled={value >= max}
        >
          +
        </button>
      </div>
      
      {max && (
        <div className="ml-5 flex flex-col justify-start">
          <div className="flex items-center text-white">
            <span className="text-[20px] font-[700]">/ {max}</span>
          </div>
          {maxText && (
            <div className="text-gray200 text-[14px] font-[300]">
              최대 {maxText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}