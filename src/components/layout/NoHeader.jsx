'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function NoHeader({title, fontSize = 'text-xl'}) {
  const router = useRouter();

  return (
    <>
      <div className="tablet:hidden fixed top-0 left-0 z-50 bg-black px-4 w-full h-[60px] flex items-center">
        <button
          onClick={() => router.back()}
          className="relative w-[10.15px] h-[17.7px] cursor-pointer"
          aria-label="이전 페이지로 돌아가기"
        >
          <Image src="/icons/ic_back.png" alt="뒤로가기" fill />
        </button>
        <h3
          className={`font-baskin font-normal text-white flex-1 text-center text-xl`}
        >
          {title}
        </h3>
      </div>

      <div className="hidden tablet:flex my-10 pc:my-15">
        <Link href="/market">
          <h3
            className={`font-baskin font-normal text-gray300 text-left text-base pc:text-2xl`}
          >
            {title}
          </h3>
        </Link>
      </div>
    </>
  );
}
