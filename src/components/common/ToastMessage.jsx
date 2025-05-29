'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';

export default function ToastMessage({message, onClose}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(() => setVisible(false), 1500);
    const removeTimer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-[75px] left-1/2 -translate-x-1/2 z-50 w-max
        transition-opacity duration-500
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="bg-[#535353]/80 backdrop-blur-sm text-white px-[26px] tablet:px-[51.5px] py-[22.5px] tablet:py-[25px] rounded-full flex items-center gap-2 shadow-md">
        <Image src="/icons/ic_alert.svg" width={24} height={24} />
        {message}
      </div>
    </div>
  );
}
