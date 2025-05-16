"use client";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Input({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  isTextArea = false,
  className = "",
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="w-full font-noto">
      {label && (
        <label htmlFor={name} className="block mb-3 text-[18px] font-[400]">
          {label}
        </label>
      )}
      {isTextArea ? (
        <>
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`p-5 border
              ${
                error
                  ? "border-red"
                  : isActive
                  ? "border-gray200"
                  : "border-gray400"
              }
              ${isActive ? "bg-gray500" : "bg-black"}
              text-white rounded-[2px] placeholder:text-white focus:outline-none focus:ring-1 h-[55px] w-full pc:h-[60px] text-[14px] pc:text-[16px]
              ${className}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
        </>
      ) : (
        <>
          <div className="relative w-full">
            <input
              id={name}
              name={name}
              value={value}
              onChange={onChange}
              type={inputType}
              placeholder={placeholder}
              className={`p-5 border
                ${
                  error
                    ? "border-red"
                    : isActive
                    ? "border-gray200"
                    : "border-gray400"
                }
                ${isActive ? "bg-gray500" : "bg-black"}
                text-white rounded-[2px] placeholder:text-white focus:outline-none
focus:ring-1 h-[55px] w-full pc:h-[60px] text-[14px] pc:text-[16px]
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
        </>
      )}
      {error && <p className="mt-3 text-[16px] font-[300] text-red">{error}</p>}
    </div>
  );
}
