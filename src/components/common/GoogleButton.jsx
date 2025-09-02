'use client';

import React from 'react';
import {FcGoogle} from 'react-icons/fc';
import classNames from 'classnames';
import useMediaQuery from '@/hooks/useMediaQuery';

const GoogleButton = ({onClick, disabled = false}) => {
  const isMobile = useMediaQuery('(max-width: 743px)');
  const isTablet = useMediaQuery('(min-width: 744px) and (max-width: 1199px)');
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  const currentSize = isMobile ? 'sm' : isTablet ? 'md' : 'lg';

  //버튼 크기 + 폰트 사이즈
  const sizeMap = {
    lg: 'w-[520px] h-[60px] text-[18px]',
    md: 'w-[441px] h-[55px] text-[16px]',
    sm: 'w-[345px] h-[55px] text-[16px]',
  };

  const appliedStyle =
    'cursor-pointer font-noto font-bold rounded-[2px] transition-colors duration-200 text-center border border-gray300 bg-white text-black flex items-center justify-center gap-2';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        appliedStyle,
        sizeMap[currentSize],
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <FcGoogle size={22} />
      Google로 시작하기
    </button>
  );
};

export default GoogleButton;
