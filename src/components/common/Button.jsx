// src/components/common/Button.jsx
"use client";

import React from "react";
import classNames from "classnames";

const Button = ({
  children,
  variant = "primary", // "primary" | "outline"
  size = "md", // "sm" | "md" | "lg"
  role = "default", // 버튼 기능 역할
  font = "default", // 폰트 크기: "default" | "strong" | "small" | "tiny"
  disabled = false,
  onClick,
  fullWidth = false,
  className = "",
  type = "button", 
}) => {
  const baseStyle =
    "font-noto font-bold rounded-[2px] transition-colors duration-200 text-center";

  // ✅ 폰트 크기 분리
  const fontMap = {
    default: "text-[16px]",
    bigger: "text-[18px]",
    strong: "text-[20px]",
    small: "text-[14px]",
    tiny: "text-[12px]",
  };
  const fontSize = fontMap[font] || fontMap.default;

  // ✅ 박스 크기 역할 정의 
  const sizeMap = {
    default: {
      lg: "w-[520px] h-[60px]",
      md: "w-[440px] h-[55px]",
      sm: "w-[345px] h-[55px]",
    },
    sell: {
      lg: "w-[440px] h-[60px]",
      md: "w-[342px] h-[55px]",
      sm: "w-[165px] h-[55px]",
    },
    confirm: {
      lg: "w-[150px] h-[40px]",
      md: "w-[150px] h-[40px]",
      sm: "w-[150px] h-[40px]",
    },
    navigate: {
      lg: "w-[226px] h-[55px]",
      md: "w-[226px] h-[55px]",
      sm: "w-[150px] h-[40px]",
    },
    success: {
      lg: "w-[440px] h-[60px]",
      md: "w-[277px] h-[55px]",
      sm: "w-[277px] h-[55px]",
    },
    failed: {
      lg: "w-[440px] h-[60px]",
      md: "w-[226px] h-[55px]",
      sm: "w-[226px] h-[55px]",
    },
    modal: {
      lg: "w-[170px] h-[60px]",
      md: "w-[140px] h-[55px]",
      sm: "w-[120px] h-[55px]",
    },
    product: {
      lg: "w-[440px] h-[80px]",
      md: "w-[342px] h-[75px]",
      sm: "w-[345px] h-[75px]",
    },
    exchange: {
      lg: "w-[210px] h-[60px]",
      md: "w-[161px] h-[55px]",
      sm: "w-[165px] h-[55px]",
    },
    proposal: {
      lg: "w-[170px] h-[60px]",
      md: "w-[141px] h-[55px]",
      sm: "w-[72.5px] h-[40px]",
    },
    "exchange-confirm": {
      lg: "w-[440px] h-[60px]",
      md: "w-[342px] h-[60px]",
      sm: "w-[345px] h-[55px]",
    },
    "cancel-exchange": {
      lg: "w-[360px] h-[60px]",
      md: "w-[302px] h-[55px]",
      sm: "w-[150px] h-[40px]",
    },
    create: {
      lg: "w-[440px] h-[60px]",
      md: "w-[342px] h-[60px]",
      sm: "w-[345px] h-[55px]",
    },
    random: {
      lg: "w-[520px] h-[60px]",
      md: "w-[440px] h-[55px]",
      sm: "w-[300px] h-[55px]",
    },
  };

  const sizeStyles = sizeMap[role]?.[size] || sizeMap["default"]["md"];

  const styles = {
    primary: disabled
      ? classNames(baseStyle, "bg-gray500 text-gray300 cursor-not-allowed")
      : classNames(
          baseStyle,
          fontSize,
          "bg-main text-black hover:brightness-110 cursor-pointer"
        ),
    outline: disabled
      ? classNames(
          baseStyle,
          "bg-transparent text-gray300 border border-gray300 cursor-not-allowed"
        )
      : classNames(
          baseStyle,
          fontSize,
          "bg-gray500 text-white border border-white hover:opacity-80 cursor-pointer"
        ),
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        styles[variant],
        sizeStyles,
        fullWidth && "w-full",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
