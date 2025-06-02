'use client';

import {useAuth} from '@/providers/AuthProvider';
import Link from 'next/link';

const ProfileModal = () => {
  const {user} = useAuth();

  return (
    <div className="absolute top-[22px] right-[0] w-[280px]  bg-gray500 font-noto z-10 mobile:hidden tablet:block">
      <div className="p-[20px] border-b border-b-gray400">
        <p className="font-bold mb-[20px]">안녕하세요, {user.nickname}님!</p>
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-[300] text-gray300">보유 포인트</p>
          <p className="text-[12px] font-[400] text-main">
            {user.pointBalance.toLocaleString()} P
          </p>
        </div>
      </div>
      <ul className="p-[20px] flex flex-col justify-center gap-[15px]">
        <li className="cursor-pointer">
          <Link href={'/market'}>마켓플레이스</Link>
        </li>
        <li className="cursor-pointer">
          <Link href={'/my-gallery'}>마이갤러리</Link>
        </li>
        <li className="cursor-pointer">
          <Link href={'/sale'}>판매중인 포토카드</Link>
        </li>
      </ul>
    </div>
  );
};

export default ProfileModal;
