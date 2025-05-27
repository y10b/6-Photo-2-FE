'use client';

import {useAuth} from '@/providers/AuthProvider';
import Link from 'next/link';

const ProfileMobileModal = ({isActive}) => {
  const {user, logout} = useAuth();

  return (
    <section className="fixed inset-0 w-full tablet:hidden z-100">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => isActive(prev => !prev)}
      ></div>

      <div className="relative w-[260px] h-full bg-gray500">
        <div className="h-full flex flex-col justify-between">
          <div>
            <div className="pt-[40px] px-[20px] pb-[20px] border-b border-b-gray400">
              <p className="text-[18px] font-bold mb-[20px]">
                안녕하세요, {user.nickname}님!
              </p>
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-gray300 font-[300]">
                  보유 포인트
                </p>
                <p className="text-[12px] text-main font-[400]">
                  {user?.pointBalance?.toLocaleString()} P
                </p>
              </div>
            </div>
            <ul className="p-[20px] flex flex-col gap-[15px]">
              <li className="cursor-pointer">
                <Link href={'/market'}>마켓플레이스</Link>
              </li>
              <li className="cursor-pointer">
                <Link href={'/my-gallery'}>마켓갤러리</Link>
              </li>
              <li className="cursor-pointer">판매 중인 포토카드</li>
            </ul>
          </div>
          <div className="pl-[20px] pb-[43px]">
            <p
              className="text-[14px] text-gray400 cursor-pointer"
              onClick={() => logout()}
            >
              로그아웃
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileMobileModal;
