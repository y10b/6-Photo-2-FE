'use client';

import NoHeader from '@/components/layout/NoHeader';
import Image from 'next/image';

export default function FullScreenModal({children, onClose, title}) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* 상단 헤더 */}
      <div className="relative z-10">
        <NoHeader title={title} />
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-white"
          aria-label="닫기 버튼"
        >
          <Image
            src="/icons/ic_back.svg"
            alt="뒤로가기 아이콘"
            width={24}
            height={24}
          />
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-[15px] pt-5 text-white">
        <div className="font-baskin text-5 text-center mb-4">{title}</div>
        {children}
      </div>
    </div>
  );
}
