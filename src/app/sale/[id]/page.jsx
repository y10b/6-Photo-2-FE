import NoHeader from '@/components/layout/NoHeader';
import CardProfile from '@/components/ui/card/cardProfile/CardProfile';
import Image from 'next/image';
import React from 'react';

function SalePage() {
  const cards = [
    {
      name: '우리집 앞마당',
      grade: 'COMMON',
      genre: 'K-POP',
      imageUrl: '/images/image1.png',
      description: '방탄소년단 포토카드',
      sellerNickname: 'seller123',
      price: 5000,
      remainingQuantity: 10,
      initialQuantity: 20,
    },
  ];

  const exchangeCard = [
    {
      grade: 'RARE',
      genre: '환경',
      description: '안녕하세요',
    },
  ];

  const photoCard = cards[0];

  /* 일단 하드 코딩 방식으로 스타일만 지정 */
  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px] mb-30">
      <NoHeader title="마켓플레이스" />

      <section className="mt-5 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <h3 className="mb-[10px] tablet:mb-5 font-bold text-2xl text-white">
          {photoCard.name}
        </h3>
        <hr className="border-2 border-gray100" />
      </section>

      <section className="flex flex-col tablet:flex-row gap-5 pc:gap-20 mb-30">
        <div className="w-[345px] tablet:w-[342px] pc:w-240 h-[258.75px] tablet:h-[256.5px] pc:h-180 relative">
          <Image
            src={photoCard.imageUrl}
            alt={photoCard.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="w-full tablet:flex-1">
          <CardProfile
            type="seller"
            cards={[photoCard]}
            exchangeCard={exchangeCard}
          />
        </div>
      </section>
    </div>
  );
}

export default SalePage;
