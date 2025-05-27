'use client';

import Image from 'next/image';

export default function FullScreenModal({children, onClose}) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex justify-center items-center">
      <div className="w-full h-full bg-black text-white relative overflow-auto">
        {/* 상단 뒤로가기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 text-white"
        >
          <Image src="/icons/ic_back.svg" width={24} height={24} />
        </button>

        {/* 콘텐츠 */}
        <div className="p-4 pt-12">{children}</div>
      </div>
    </div>
  );
}
