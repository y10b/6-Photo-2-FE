'use client';

import React, {useRef, useState} from 'react';

export default function BottomSheetModal({children, onClose}) {
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const [translateY, setTranslateY] = useState(0);

  const handleTouchStart = e => {
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = e => {
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;
    if (deltaY > 0) setTranslateY(deltaY);
  };

  const handleTouchEnd = () => {
    if (translateY > 150) {
      onClose?.();
    } else {
      setTranslateY(0);
    }
  };

  return (
    <>
      {/* 배경 */}
      <div className="fixed inset-0 flex justify-center items-end bg-black/80 z-50">
        {/* 바텀시트 창 */}
        <div
          ref={sheetRef}
          className="bg-gray500 w-full p-[15px] flex flex-col transition-transform duration-200"
          style={{
            transform: `translateY(${translateY}px)`,
            touchAction: 'none',
            maxHeight: 'calc(100vh - 60px)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 스크롤 바 */}
          <div className="flex flex-col items-center">
            <div className="w-[48px] h-[6px] bg-gray400 rounded-[50px] mb-[30px]" />
          </div>
          {/* 바텀시트 콘텐츠 */}
          {children}
        </div>
      </div>
    </>
  );
}
