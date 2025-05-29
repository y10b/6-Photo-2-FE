'use client'

import React from 'react';
import CardList from '../ui/card/cardOverview/CardList';

function ExchangeSuggest({cards}) {
  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <h3 className="mb-[10px] tablet:mb-5 font-bold text-2xl tablet:text-[32px] pc:text-[40px] ">
        교환 제시 목록
      </h3>
      <hr className="mb-[46px] tablet:mb-[48px] pc:mb-[70px] border-2 border-gray100" />
      <CardList cards={cards} />
    </div>
  );
}

export default ExchangeSuggest;
