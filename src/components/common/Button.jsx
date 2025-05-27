'use client';

import React from 'react';
import classNames from 'classnames';
import useMediaQuery from '@/hooks/useMediaQuery';

const Button = ({
  children,
  variant = 'primary',
  size,
  role = 'default',
  font = 'default',
  disabled = false,
  onClick,
  fullWidth = false,
  className = '',
  type = 'button',
}) => {
  const isMobile = useMediaQuery('(max-width: 743px)');
  const isTablet = useMediaQuery('(min-width: 744px) and (max-width: 1199px)');
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const currentSize = isMobile ? 'sm' : isTablet ? 'md' : 'lg';
  const appliedSize = size || currentSize;

  if (appliedSize !== currentSize) return null;

  const baseStyle =
    'font-noto font-bold rounded-[2px] transition-colors duration-200 text-center';

  const fontMap = {
    default: 'text-[16px]',
    bigger: 'text-[18px]',
    strong: 'text-[20px]',
    small: 'text-[14px]',
    tiny: 'text-[12px]',
  };

  const roleFontMap = {
    navigate: {
      lg: 'default',
      md: 'default',
      sm: 'small',
    },
    default: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    product: {
      lg: 'strong',
      md: 'bigger',
      sm: 'bigger',
    },
    modal: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    sell: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    success: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    failed: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    'exchange-confirm': {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    exchange: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    'cancel-exchange': {
      lg: 'bigger',
      md: 'default',
      sm: 'small',
    },
    proposal: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    create: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    random: {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    filter: {
      lg: 'default',
      md: 'default',
      sm: 'default',
    },
    'my-sell': {
      lg: 'bigger',
      md: 'default',
      sm: 'default',
    },
    default: {
      lg: 'default',
      md: 'default',
      sm: 'default',
    },
  };

  const fontSizeKey = appliedSize;
  const appliedFont =
    font !== 'default'
      ? font
      : roleFontMap[role]?.[fontSizeKey] || roleFontMap['default'][fontSizeKey];
  const fontSize = fontMap[appliedFont] || fontMap.default;

  const sizeMap = {
    default: {
      lg: 'w-[520px] h-[60px]',
      md: 'w-[440px] h-[55px]',
      sm: 'w-[345px] h-[55px]',
    },
    sell: {
      lg: 'w-[440px] h-[60px]',
      md: 'w-[342px] h-[55px]',
      sm: 'w-[165px] h-[55px]',
    },
    confirm: {
      lg: 'w-[150px] h-[40px]',
      md: 'w-[150px] h-[40px]',
      sm: 'w-[150px] h-[40px]',
    },
    navigate: {
      lg: 'w-[226px] h-[55px]',
      md: 'w-[226px] h-[55px]',
      sm: 'w-[150px] h-[40px]',
    },
    success: {
      lg: 'w-[440px] h-[60px]',
      md: 'w-[277px] h-[55px]',
      sm: 'w-[277px] h-[55px]',
    },
    failed: {
      lg: 'w-[440px] h-[60px]',
      md: 'w-[226px] h-[55px]',
      sm: 'w-[226px] h-[55px]',
    },
    modal: {
      lg: 'w-[170px] h-[60px]',
      md: 'w-[140px] h-[55px]',
      sm: 'w-[120px] h-[55px]',
    },
    product: {
      lg: 'w-[440px] h-[80px]',
      md: 'w-[342px] h-[75px]',
      sm: 'w-[345px] h-[75px]',
    },
    exchange: {
      lg: 'w-[210px] h-[60px]',
      md: 'w-[161px] h-[55px]',
      sm: 'w-[165px] h-[55px]',
    },
    proposal: {
      lg: 'w-[170px] h-[60px]',
      md: 'w-[141px] h-[55px]',
      sm: 'w-[72.5px] h-[40px]',
    },
    'exchange-confirm': {
      lg: 'w-[440px] h-[60px]',
      md: 'w-[342px] h-[60px]',
      sm: 'w-[345px] h-[55px]',
    },
    'cancel-exchange': {
      lg: 'w-[360px] h-[60px]',
      md: 'w-[302px] h-[55px]',
      sm: 'w-[150px] h-[40px]',
    },
    create: {
      lg: 'w-[440px] h-[60px]',
      md: 'w-[342px] h-[60px]',
      sm: 'w-[345px] h-[55px]',
    },
    random: {
      lg: 'w-[520px] h-[60px]',
      md: 'w-[440px] h-[55px]',
      sm: 'w-[300px] h-[55px]',
    },
    'my-sell': {
      lg: 'w-[440px] h-[60px]',
      md: 'w-[342px] h-[60px]',
      sm: 'w-[345px] h-[55px]',
    },
  };

  const sizeStyles = sizeMap[role]?.[appliedSize] || sizeMap['default']['md'];

  const styles = {
    primary: disabled
      ? classNames(baseStyle, 'bg-gray500 text-gray300 cursor-not-allowed')
      : classNames(
          baseStyle,
          fontSize,
          'bg-main text-black hover:brightness-110 cursor-pointer',
        ),
    outline: disabled
      ? classNames(
          baseStyle,
          'bg-transparent text-gray300 border border-gray300 cursor-not-allowed',
        )
      : classNames(
          baseStyle,
          fontSize,
          'bg-transparent text-white border border-white hover:opacity-80 cursor-pointer',
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
        fullWidth && 'w-full',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
