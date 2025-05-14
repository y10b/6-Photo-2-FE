"use client";

// 사용법 예시
// import { useModal } from "@/context/ModalContext";
// const { openModal } = useModal();
// openModal({
//   title: "로그인이 필요합니다",
//   description: "이 기능은 로그인 후 사용할 수 있습니다.",
//   button: {
//     label: "로그인하러 가기",
//     onClick: () => {
//       // 원하는 동작 후 모달 닫기
//       closeModal();
//     },
//   },
// });

import Image from "next/image";
import { useModal } from "@/context/ModalContext";

export default function Modal() {
  const { isOpen, modalContent, closeModal } = useModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black opacity-80" />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="relative bg-[#161616] w-[560px] max-h-[375px] rounded-xs text-white pt-[80px] pb-[60px] px-10">
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
            <p className="text-[#A4A4A4] text-base font-normal whitespace-pre-wrap mb-[60px]">
              {modalContent?.description}
            </p>

            {/* 확인 버튼 */}
            {modalContent?.button && (
              <button
                onClick={modalContent.button.onClick || closeModal}
                className="w-[170px] h-[60px] bg-[#EFFF04] text-black text-lg font-bold rounded-xs"
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
