'use client';

import Image from 'next/image';
import { useModal } from '../ModalContext';
import Button from '../../common/Button';
import NoHeader from '../../layout/NoHeader';

export default function CardModal() {
  const { isOpen, modalContent, closeModal } = useModal();

  if (!isOpen) return null;

  const { type, title, result, description, button } = modalContent || {};
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <NoHeader />

      {/* 배경 클릭 시 모달 닫기 */}
      <div
        className="absolute inset-0 bg-black opacity-80"
        onClick={closeModal}
      />

      <div
        className="relative z-10 flex items-center justify-center h-full"
        // 클릭 이벤트 버블링 방지
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-[238px] tablet:w-[384px] pc:w-[560px]
                     h-53 tablet:h-[215px] pc:h-[352px]
                     text-white bg-transparent relative"
        >
          {/* 닫기 버튼 (태블릿 이상에서만 표시) */}
          <button
            onClick={closeModal}
            aria-label="닫기"
            className="hidden tablet:block absolute top-[-63px] right-[-64px] pc:top-[-96px] pc:right-[-338px]"
          >
            <Image
              src="/icons/ic_close.svg"
              width={28}
              height={28}
              alt="닫기"
            />
          </button>

          {/* 모달 내용 */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-baskin font-normal text-[30px] tablet:text-4xl pc:text-[46px] mb-[30px] tablet:mb-10">
              {title}
              <span className={isSuccess ? 'text-main' : 'text-gray300'}>
                {' '}
                {result}
              </span>
            </h2>

            {description && (
              <p className="font-bold text-base pc:text-xl text-white mb-[50px] tablet:mb-12 break-words">
                {description}
              </p>
            )}

            {button && (
              <Button
                role="failed"
                variant="outline"
                onClick={button.onClick || closeModal}
              >
                {button.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
