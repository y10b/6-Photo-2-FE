"use client";

import Image from "next/image";
import { useModal } from "@/context/ModalContext";

export default function Modal() {
  const { isOpen, modalContent, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black opacity-80" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="relative bg-gray500 w-[560px] max-h-[375px] rounded-xs text-white pt-20 pb-15 px-10">
          {/* 닫기 버튼 */}
          <button
            onClick={closeModal}
            className="absolute top-[30px] right-[30px]"
            aria-label="닫기"
          >
            <Image
              src="/ic_close.svg"
              width={32}
              height={32}
              alt="닫기 아이콘"
            />
          </button>
          {/* 모달 콘텐츠 */}
          <div className="text-center flex flex-col items-center justify-between h-full">
            {/* 제목 */}
            <h2 className="text-xl font-bold mb-[40px]">
              {modalContent?.title}
            </h2>

            {/* 설명 */}
            <p className="text-gray300 text-base font-normal whitespace-pre-wrap mb-15">
              {modalContent?.description}
            </p>

            {/* 확인 버튼 */}
            {modalContent?.button && (
              <button
                onClick={modalContent.button.onClick || closeModal}
                className="w-[170px] h-[60px] bg-main text-black text-lg font-bold rounded-xs"
              >
                {modalContent.button.label || "확인"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
