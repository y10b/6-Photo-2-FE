import React from 'react';

const ProfileModal = () => {
  return (
    <div className="absolute top-[22px] right-[0] w-[280px]  bg-gray500 font-noto z-10 mobile:hidden tablet:block">
      <div className="p-[20px] border-b border-b-gray400">
        <p className="font-bold mb-[20px]">안녕하세요, 유디님!</p>
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-[300] text-gray300">보유 포인트</p>
          <p className="text-[12px] font-[400] text-main">300 P</p>
        </div>
      </div>
      <ul className="p-[20px] flex flex-col justify-center gap-[15px]">
        <li className="cursor-pointer">마켓플레이스</li>
        <li className="cursor-pointer">마이갤러리</li>
        <li className="cursor-pointer">판매 중인 포토카트</li>
      </ul>
    </div>
  );
};

export default ProfileModal;
