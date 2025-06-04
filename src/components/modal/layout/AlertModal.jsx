'use client';

import Image from 'next/image';
import Button from '@/components/common/Button';

export default function AlertModal({title, description, button, onClose}) {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative z-10 flex items-center justify-center h-full">
        {/* 모달 콘텐츠 */}
        <div
          className="
          relative z-10
          w-[345px] tablet:w-[400px] pc:w-[560px]
          h-[291px] tablet:h-[291px] pc:h-[352px]
          bg-[#161616] rounded-xs text-white 
          pt-15 pb-10 px-10
          pc:pt-20 pc:pb-15
        "
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-[15px] right-[15px] pc:top-[30px] pc:right-[30px]"
            aria-label="닫기"
          >
            <Image
              src="/icons/ic_close_gray.svg"
              width={28}
              height={28}
              alt="닫기"
            />
          </button>

          {/* 내용 */}
          <div className="flex flex-col items-center text-center">
            {/* 타이틀 */}
            <h2
              className="
              font-bold text-lg pc:text-xl
              mb-[30px] pc:mb-10
            "
            >
              {title}
            </h2>

            {/* 설명 */}
            <p
              className="
              text-gray300 whitespace-pre-wrap
              text-sm pc:text-base
              mb-10 pc:mb-15
            "
            >
              {description}
            </p>

            {/* 버튼 */}
            {button && (
              <Button
                role="modal"
                onClick={() => {
                  button.onClick?.();
                  onClose();
                }}
              >
                {button.label || '확인'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
