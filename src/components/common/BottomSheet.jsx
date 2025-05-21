"use client";

import React, { useRef, useState } from "react";

const BottomSheet = ({ children, onClose }) => {
  const sheetRef = useRef(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const [translateY, setTranslateY] = useState(0);

  const handleTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    currentYRef.current = e.touches[0].clientY;
    const deltaY = currentYRef.current - startYRef.current;

    if (deltaY > 0) {
      setTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 150) {
      onClose();
    } else {
      setTranslateY(0);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-end bg-black/80 z-50">
      <div
        ref={sheetRef}
        className="bg-[#161616] w-full rounded-t-[2px] p-[15px] max-h-[calc(100vh-60px)] tablet:max-h-[calc(100vh-40px)] overflow-y-auto  flex flex-col transition-transform duration-200"
        style={{
          transform: `translateY(${translateY}px)`,
          touchAction: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col items-center ">
          <div className="w-[48px] h-[6px] bg-[#5A5A5A] rounded-[50px] mb-[30px]"></div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
