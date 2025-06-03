'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useAuth} from '@/providers/AuthProvider';
import {useEffect, useMemo, useRef, useState} from 'react';
import NotificationModal from './NotificationModal';
import ProfileModal from './ProfileModal';
import ProfileMobileModal from './ProfileMobileModal';
import {useNotificationQuery} from '@/hooks/useNotificationQuery';

const Header = () => {
  const {user, logout} = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {}, [isLoggedIn, user]);

  const handleLogout = () => {
    logout();
  };

  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const {data} = useNotificationQuery();

  const hasUnread = useMemo(() => {
    return data?.some(alarm => !alarm.isRead);
  }, [data]);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    // 모바일 모달이 열려있을 때는 body 스크롤 방지
    if (isProfileActive && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleClickOutside = e => {
      // 모바일 모달은 자체적으로 외부 클릭을 처리하므로 여기서는 처리하지 않음
      if (isProfileActive && window.innerWidth < 768) {
        return;
      }

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
      document.body.style.overflow = '';
    };
  }, [isProfileActive]);

  // 모바일 메뉴 토글 핸들러
  const toggleMobileMenu = e => {
    e.stopPropagation(); // 이벤트 전파 중지
    setIsProfileActive(prev => !prev);
  };

  return (
    <header className="relative pc:px-[20px]">
      <nav className="h-[60px] flex items-center justify-between max-w-[744px] m-auto px-[20px] tablet:max-w-[1200px] tablet:px-[20px] pc:max-w-[1479px] pc:px-[0]">
        <Image
          className="tablet:hidden cursor-pointer"
          src={'/icons/ic_menu.svg'}
          width={22}
          height={22}
          alt="메뉴 토글"
          onClick={toggleMobileMenu}
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
          <ul className="flex items-center gap-[30px] text-[14px] font-[500] text-gray200">
            <li className="">
              <Link href={'/auth/login'}>로그인</Link>
            </li>
            <li className="hidden tablet:block">
              <Link href={'/auth/signup'}>회원가입</Link>
            </li>
          </ul>
        ) : (
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
                  {hasUnread ? (
                    <Image
                      className="object-cover"
                      src={'/icons/ic_alarm.png'}
                      fill
                      alt="알림"
                    />
                  ) : (
                    <Image
                      className="object-cover"
                      src={'/icons/ic_alarm_default.svg'}
                      fill
                      alt="알림"
                    />
                  )}
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
                  {user?.nickname?.includes('_')
                    ? `${user.nickname.slice(
                        0,
                        user.nickname.lastIndexOf('_'),
                      )}_google`
                    : user?.nickname}
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
