'use client';
import {useState, useRef, useEffect} from 'react';

export default function TextboxInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = '',
  ...rest
}) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  //w-[345px] tablet:w-[440px] pc:w-[520px]
  // 텍스트가 변경될 때마다 오버플로우 상태 체크
  useEffect(() => {
    if (textareaRef.current) {
      const hasOverflow =
        textareaRef.current.scrollHeight > textareaRef.current.clientHeight;
      setIsOverflowing(hasOverflow);
    }
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // 배경색 결정
  const getBgColor = () => {
    if (isFocused) return 'bg-gray500 font-[400] pc:font-[500]'; // 포커스 상태
    if (isOverflowing) return 'bg-gray500 font-[400] '; //내용 넘침
    return 'bg-black'; // 기본 상태
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
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full px-5 py-3 border-[1px] border-gray200 ${getBgColor()} text-white rounded-[2px] placeholder:text-gray200 text-[14px] pc:text-[16px] font-[300] resize-none h-[140px] pc:h-[180px] overflow-y-auto ${className}`}
          {...rest}
        />
      </div>
    </div>
  );
}