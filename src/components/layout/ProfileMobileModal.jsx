import React from 'react';

const ProfileMobileModal = () => {
  return (
    <div className="fixed inset-0 w-[260px] tablet:hidden bg-gray500 z-100">
      <div>
        <div>
          <div className="pt-[40px] px-[20px] pb-[20px] border-b border-b-gray400">
            <p className="text-[18px] font-bold mb-[20px]">
              안녕하세요, 유다님!
            </p>
            <div className="flex items-center justify-between">
              <p className="text-[12px] text-gray300 font-[300]">보유 포인트</p>
              <p className="text-[12px] text-main font-[400]">1,540 P</p>
            </div>
          </div>
          <ul className="p-[20px] flex flex-col gap-[15px]">
            <li className="cursor-pointer">마켓플레이스</li>
            <li className="cursor-pointer">마켓갤러리</li>
            <li className="cursor-pointer">판매 중인 포토카드</li>
          </ul>
        </div>
        <p>로그아웃</p>
      </div>
    </div>
  );
};

export default ProfileMobileModal;
