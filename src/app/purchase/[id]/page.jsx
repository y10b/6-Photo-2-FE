'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import NoHeader from '@/components/layout/NoHeader';
import CardProfile from '@/components/ui/card/cardProfile/CardProfile';
import ExchangeInfoSection from '@/components/exchange/ExchangeInfoSection';
import Image from 'next/image';
import {fetchPurchase} from '@/lib/api/purchase';
import {fetchMyCards} from '@/lib/api/shop';

export default function PurchasePage() {
  const {id} = useParams();

  const [photoCard, setPhotoCard] = useState(null);
  const [myCards, setMyCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async shopId => {
    try {
      const [purchaseData, myCardData] = await Promise.all([
        fetchPurchase(shopId),
        fetchMyCards({
          filterType: 'status',
          filterValue: 'IDLE,LISTED',
        }),
      ]);

      setPhotoCard(purchaseData);
      setMyCards(myCardData.result);

      if (purchaseData.remainingQuantity === 0) {
        setError('잔여 수량이 0인 상품입니다. 구매할 수 없습니다.');
      } else {
        setError(null);
      }
    } catch (err) {
      setError(err.message || '데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      loadData(id);
    }
  }, [id]);

  /* 이후 스켈레톤 UI 고려 */
  if (isLoading) {
    return <div>로딩중...</div>;
  }

  if (!photoCard) {
    return (
      <div className="text-white text-center mt-10">
        포토카드를 찾을 수 없습니다.
      </div>
    );
  }

  const {name, imageUrl, grade, genre} = photoCard;

  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <NoHeader title="마켓플레이스" />

      <section className="mt-5 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <h3 className="mb-[10px] tablet:mb-5 font-bold text-2xl text-white">
          {name}
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
