'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useAuth} from '@/providers/AuthProvider';
import {useEffect, useMemo, useRef, useState} from 'react';
import NotificationModal from './NotificationModal';
import ProfileModal from './ProfileModal';
import ProfileMobileModal from './ProfileMobileModal';

const Header = () => {
  // useAuth 훅을 사용하여 로그인 상태 및 사용자 정보 가져오기
  const {user, logout} = useAuth();
  // user 객체의 존재 여부로 로그인 상태 확인
  const isLoggedIn = !!user;
  // 디버깅용 로그
  useEffect(() => {}, [isLoggedIn, user]);
  // 바로 로그아웃
  const handleLogout = () => {
    logout(); // AuthProvider의 logout 함수 호출 (랜딩페이지로 이동)
  };

  // 알림 모달
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  // 프로필 모달
  const [isProfileActive, setIsProfileActive] = useState(false);
  // 신규 알림
  const {data} = useNotificationQuery();

  const hasUnread = useMemo(() => {
    return data?.some(alarm => !alarm.isRead);
  }, [data]);

  // 외부 클릭 시 모달 닫기
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = e => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setIsNotificationActive(false);
      }

      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="relative pc:px-[20px]">
      <nav className="h-[60px] flex items-center justify-between max-w-[744px] m-auto px-[20px] tablet:max-w-[1200px] tablet:px-[20px] pc:max-w-[1479px] pc:px-[0]">
        <Image
          className="tablet:hidden cursor-pointer"
          src={'/icons/ic_menu.svg'}
          width={22}
          height={22}
          alt="메뉴 토글"
          onClick={() => setIsProfileActive(prev => !prev)}
        />
        {isProfileActive && (
          <ProfileMobileModal isActive={setIsProfileActive} />
        )}
        <Link href={'/'}>
          <figure className="relative w-[83px] h-[15px] tablet:w-[111px] tablet:h-[20px] pc:w-[138px] pc:h-[25px]">
            <Image src={'/logo.svg'} fill className="object-cover" alt="로고" />
          </figure>
        </Link>

        {!isLoggedIn ? (
          /* 비회원일 경우 */
          <ul className="flex items-center gap-[30px] text-[14px] font-[500] text-gray200">
            <li className="">
              <Link href={'/auth/login'}>로그인</Link>
            </li>
            <li className="hidden tablet:block">
              <Link href={'/auth/signup'}>회원가입</Link>
            </li>
          </ul>
        ) : (
          /* 회원일 경우 */
          <ul className="flex items-center gap-[30px]">
            <div className="flex items-center gap-[30px]">
              <li className="hidden tablet:block text-[14px] font-[700]">
                {user?.pointBalance?.toLocaleString() || 0} P
              </li>
              <li ref={notificationRef} className="relative">
                <figure
                  className="relative w-[22px] h-[22px] tablet:w-[24px] tablet:h-[24px] cursor-pointer"
                  onClick={() => setIsNotificationActive(prev => !prev)}
                >
                  <Image
                    className="object-cover"
                    src={'/icons/ic_alarm_default.svg'}
                    fill
                    alt="알림"
                  />
                </figure>
                {isNotificationActive && (
                  <NotificationModal isActive={setIsNotificationActive} />
                )}
              </li>
              <li
                ref={profileRef}
                className="hidden tablet:block font-baskin text-[18px] font-[400] relative"
              >
                <p
                  className="cursor-pointer"
                  onClick={() => setIsProfileActive(prev => !prev)}
                >
                  {user?.nickname || ''}
                </p>
                {isProfileActive && <ProfileModal />}
              </li>
            </div>
            <div className="hidden tablet:block w-[1px] h-[20px] bg-[var(--color-gray400)]" />
            <li
              className="hidden tablet:block text-[14px] text-[var(--color-gray400)] cursor-pointer"
              onClick={handleLogout}
            >
              로그아웃
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
