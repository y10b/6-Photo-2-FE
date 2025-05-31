'use client';
import {useState} from 'react';
import {AiOutlineEye, AiOutlineEyeInvisible} from 'react-icons/ai';

//Textarea input 사용시
export default function Input({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  isTextArea = false,
  className = '',
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  // 일반 텍스트일 때 30자 제한 적용
  const maxLength = type === 'text' ? 30 : undefined;
  const currentLength = value ? value.length : 0;
  const isOverLimit = maxLength && currentLength > maxLength;

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="w-full font-noto">
      {label && (
        <label
          htmlFor={name}
          className="text-white block mb-3 text-[16px] font-[400] pc:text-[18px]"
        >
          {label}
        </label>
      )}
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`p-5 border
              ${
                error || isOverLimit
                  ? 'border-red'
                  : isActive
                  ? 'border-gray200'
                  : 'border-gray400'
              }
              ${isActive ? 'bg-gray500' : 'bg-black'}
              text-white rounded-[2px] placeholder:text-white placeholder:font-noto focus:outline-none focus:ring-1 h-[55px] w-full pc:h-[60px] text-[14px] font-[300] pc:text-[16px]
              ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
      ) : (
        <div className="relative w-full">
          <input
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            type={inputType}
            placeholder={placeholder}
            maxLength={maxLength} // 일반 텍스트일 때만 30자 제한
            className={`p-5 border
                ${
                  error || isOverLimit
                    ? 'border-red'
                    : isActive
                    ? 'border-gray200'
                    : 'border-gray400'
                }
                ${isActive ? 'bg-gray500' : 'bg-black'}
                text-white rounded-[2px] placeholder:text-white placeholder:font-noto focus:outline-none focus:ring-1 h-[55px] w-full pc:h-[60px] text-[14px] font-[300] pc:text-[16px]
                ${className}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />

          {isPassword && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-5 tablet:right-[20px] top-1/2 transform -translate-y-1/2 text-white"
            >
              {showPassword ? (
                <AiOutlineEye className="w-5 h-5" />
              ) : (
                <AiOutlineEyeInvisible className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      )}
      {/* 에러 메시지 */}
      {error && <p className="mt-3 text-[16px] font-[300] text-red">{error}</p>}

      {/* 글자수 초과 시 에러 메시지 */}
      {!error && isOverLimit && (
        <p className="mt-3 text-[16px] font-[300] text-red">
          {label}은 최대 {maxLength}자까지 입력 가능합니다.
        </p>
      )}
    </div>
  );
}
