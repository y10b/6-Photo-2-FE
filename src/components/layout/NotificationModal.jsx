import React from 'react';

const NotificationModal = ({isActive}) => {
  return (
    <>
      <div className="absolute top-[22px] right-0 w-[300px] bg-gray500 z-[10] mobile:hidden tablet:block">
        <div className="p-[20px] border-b border-b-gray400 bg-[#212121]">
          <p className="text-[14px]">
            기며누님이 [RARE | 우리집 앞마당]을 1장 구매했습니다.
          </p>
          <p className="text-[12px] text-gray300 mt-[10px]">1시간 전</p>
        </div>
        <div className="p-[20px] border-b border-b-gray400 bg-[#212121]">
          <p className="text-[14px]">
            기며누님이 [RARE | 우리집 앞마당]을 1장 구매했습니다.
          </p>
          <p className="text-[12px] text-gray300 mt-[10px]">1시간 전</p>
        </div>
        <div className="p-[20px] border-b border-b-gray400">
          <p className="text-[14px]">
            [LEGENDARY | 우리집 앞마당]이 품절되었습니다.
          </p>
          <p className="text-[12px] text-gray300 mt-[10px]">1시간 전</p>
        </div>
        <div className="p-[20px] border-b border-b-gray400">
          <p className="text-[14px]">
            기며누님이 [RARE | 우리집 앞마당]을 1장 구매했습니다.
          </p>
          <p className="text-[12px] text-gray300 mt-[10px]">1시간 전</p>
        </div>
        <div className="p-[20px] border-b border-b-gray400">
          <p className="text-[14px]">
            기며누님이 [RARE | 우리집 앞마당]을 1장 구매했습니다.
          </p>
          <p className="text-[12px] text-gray300 mt-[10px]">1시간 전</p>
        </div>
      </div>
      <div className="fixed inset-0 w-full bg-gray500 z-[20] tablet:hidden">
        <div className="flex items-center justify-between h-[60px] px-[20px]">
          <img
            src="/icons/ic_m_close.svg"
            alt="뒤로가기"
            className="cursor-pointer"
            onClick={() => isActive(prev => !prev)}
          />
          <p className="text-[20px] font-baskin">알림</p>
          <p></p>
        </div>
        <section>
          <div className="p-[20px] border-b border-b-gray400 bg-[#212121]">
            <p className="text-[14px]">
              기며누님이 [RARE | 우리집 앞마당]을 1장 구매했습니다.
            </p>
            <p className="text-[12px] text-gray300 mt-[10px]">1시간 전</p>
          </div>
          <div className="p-[20px] border-b border-b-gray400">
            <p className="text-[14px]">
              [LEGENDARY | 우리집 앞마당]이 품절되었습니다.
            </p>
            <p className="text-[12px] text-gray300 mt-[10px]">1시간 전</p>
          </div>
        </section>
      </div>
    </>
  );
};

export default NotificationModal;
