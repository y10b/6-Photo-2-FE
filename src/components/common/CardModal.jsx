'use client';

import Image from 'next/image';
import {useModal} from '../modal/ModalContext';
import Button from './Button';
import NoHeader from '../layout/NoHeader';

export default function Modal() {
  const {isOpen, modalContent, closeModal} = useModal();

  if (!isOpen) return null;

  const isSuccess = modalContent?.type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <NoHeader />
      <div className="absolute inset-0" />
      <div className="relative flex items-center justify-center h-full">
        <div
          className="
          relative z-10
          w-[238px] tablet:w-[384px] pc:w-[560px]
          h-53 tablet:h-[215px] pc:h-[352px]
          bg-transparent text-white 
        "
        >
          {/* 닫기 버튼 */}
          <button
            onClick={closeModal}
            className="cursor-pointer hidden tablet:block absolute top-[-63px] right-[-64px] pc:top-[-96px] pc:right-[-338px]"
            aria-label="닫기"
          >
            <Image
              src="/icons/ic_close.svg"
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
              mb-[30px] tablet:mb-10 font-baskin font-normal text-[30px] tablet:text-4xl pc:text-[46px]
            "
            >
              {modalContent?.title}
              <span className={`${isSuccess ? 'text-main' : 'text-gray300'}`}>
                {' '}
                {modalContent?.result}
              </span>
            </h2>

            {/* 설명 */}
            <p
              className={`mb-[50px] tablet:mb-12 font-bold text-base pc:text-xl text-white`}
            >
              {modalContent?.description}
            </p>

            {/* 버튼 */}
            {modalContent?.button && (
              <Button
                role="failed"
                variant="outline"
                onClick={modalContent.button.onClick || closeModal}
              >
                {modalContent.button.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
