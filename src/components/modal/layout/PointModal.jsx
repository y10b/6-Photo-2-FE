'use client';

import Image from 'next/image';

export default function PointModal({children, onClose}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" />

      {/* 모달 영역 */}
      <div className="relative z-10 flex items-center justify-center p-4 max-h-[90vh]">
        <div
          className="
            relative w-[90vw] max-w-[1034px]
            bg-[#161616] rounded-xs text-white
            px-4 py-6 sm:px-8 sm:py-10
            overflow-y-auto max-h-[90vh]
          "
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6"
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
          {children}
        </div>
      </div>
    </div>
  );
}
