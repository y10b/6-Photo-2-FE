'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import ExchangeInfoSection from '@/components/exchange/ExchangeInfoSection';
import {fetchPurchase} from '@/lib/api/purchase';
import {fetchMyCards} from '@/lib/api/shop';
import CardDetailSection from '@/components/common/TransactionSection';

export default function PurchasePage() {
  const {id} = useParams();

  const [photoCard, setPhotoCard] = useState(null);
  const [myCards, setMyCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      loadData(id);
    }
  }, [id]);

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

      // 구매 불가 상태지만 UI는 보여줌
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
    <div>
      <CardDetailSection type="buyer" photoCard={photoCard} error={error} />

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
