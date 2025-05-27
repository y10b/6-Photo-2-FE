import NoHeader from '@/components/layout/NoHeader';
import React from 'react';

function salePage() {
  const {} = card;
  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <NoHeader title="마켓플레이스" />

      <section className="mt-5 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <h3 className="mb-[10px] tablet:mb-5 font-bold text-2xl text-white">
          우리집 앞마당
        </h3>
        <hr className="border-2 border-gray100" />
      </section>

      <section className="flex flex-col tablet:flex-row gap-5 pc:gap-20 mb-30">
        <div className="w-[345px] tablet:w-[342px] pc:w-240 h-[258.75px] tablet:h-[256.5px] pc:h-180 relative">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>

        <div className="w-full tablet:flex-1">
          <CardProfile type="buyer" cards={[photoCard]} error={error} />
        </div>
      </section>

      <ExchangeInfoSection
        info={{
          description:
            '푸릇푸릇한 여름 풍경, 눈 많이 내린 겨울 풍경 사진에 관심이 많습니다.',
          grade: grade || 'COMMON',
          genre: genre || '장르 없음',
          myCards,
        }}
      />
    </div>
  );
}

export default salePage;
