'use client';

import Image from 'next/image';

export default function DesktopModal({children, onClose}) { 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* 모달 창 */}
        <div
          className="
          relative z-10
          w-[1160px] h-[1000px]
          bg-[#161616] rounded-xs text-white
          pt-15 pb-10 px-15"
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose} 
            className="absolute top-[30px] right-[30px]"
            aria-label="닫기"
          >
            <Image
              src="/icons/ic_close_gray.svg"
              width={32}
              height={32}
              alt="닫기"
            />
          </button>

          {/* 모달 콘텐츠 */}
          <div className="h-full overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}