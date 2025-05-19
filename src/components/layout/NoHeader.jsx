"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NoHeader({ title }) {
  const router = useRouter();

  return (
    <div className="absolute top-0 left-0 z-10 bg-black px-4 w-full h-[60px] flex items-center">
      <button
        onClick={() => router.back()}
        className="relative w-[10.15px] h-[17.7px]"
        aria-label="이전 페이지로 돌아가기"
      >
        <Image src="/icons/ic_back.png" alt="뒤로가기" fill />
      </button>

      <h3 className="font-baskin font-normal text-xl text-white flex-1 text-center">
        {title}
      </h3>
    </div>
  );
}
