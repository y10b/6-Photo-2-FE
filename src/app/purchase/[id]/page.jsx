'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import NoHeader from '@/components/layout/NoHeader';
import CardProfile from '@/components/ui/card/cardProfile/CardProfile';
import {fetchPurchase} from '@/lib/api/purchase';

export default function PurchasePage() {
  const {id} = useParams();
  const [photoCard, setPhotoCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCard = async () => {
      if (!id) return;
      try {
        const data = await fetchPurchase(id);
        setPhotoCard(data);
      } catch (error) {
        console.error('카드 정보를 불러오는 데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCard();
  }, [id]);

  if (isLoading) {
    return <div className="text-white text-center mt-10">로딩 중...</div>;
  }

  if (!photoCard) {
    return (
      <div className="text-red-500 text-center mt-10">
        카드를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <NoHeader title="마켓플레이스" />

      <section className="mt-5 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <h3 className="mb-[10px] tablet:mb-5 font-bold text-2xl text-white">
          {photoCard.name}
        </h3>
        <hr className="border-2 border-gray100" />
      </section>

      <section className="flex flex-col tablet:flex-row gap-5 pc:gap-20 mb-30">
        {/* 카드 이미지 */}
        <div className="w-[345px] tablet:w-[342px] pc:w-240 h-[258.75px] tablet:h-[256.5px] pc:h-180 relative">
          <Image
            src={photoCard.imageUrl}
            alt={photoCard.name}
            fill
            className="object-cover"
          />
        </div>

        {/* 카드 상세 컴포넌트 */}
        <div className="w-full tablet:flex-1">
          <CardProfile type="buyer" cards={[photoCard]} />
        </div>
      </section>
    </div>
  );
}
