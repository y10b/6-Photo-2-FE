// components/ui/card/cardOverview/ExchangeButtons.jsx
import React from 'react';
import clsx from 'clsx';
import Button from '@/components/common/Button';

export default function ExchangeButtons({
  type,
  mobileOrTablet,
  onClick,
  isLoading,
}) {
  if (type === 'exchange_btn1') {
    return (
      <div
        className={clsx(
          mobileOrTablet('mt-[25px]', 'mt-5'),
          'tablet:mt-[25px] pc:mt-10 flex justify-center',
        )}
      >
        <Button
          role="cancel-exchange"
          variant="outline"
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? '취소 중...' : '취소하기'}
        </Button>
      </div>
    );
  }

  if (type === 'exchange_btn2') {
    return (
      <div
        className={clsx(
          mobileOrTablet('mt-[25px]', 'mt-5'),
          'tablet:mt-[25px] pc:mt-10 flex justify-between',
        )}
      >
        <Button
          role="proposal"
          variant="outline"
          onClick={() => onClick?.('reject')}
          disabled={isLoading}
        >
          <span className="tablet:hidden">거절</span>
          <span className="hidden tablet:inline">거절하기</span>
        </Button>
        <Button
          role="proposal"
          onClick={() => onClick?.('accept')}
          disabled={isLoading}
        >
          <span className="tablet:hidden">승인</span>
          <span className="hidden tablet:inline">승인하기</span>
        </Button>
      </div>
    );
  }

  return null;
}
