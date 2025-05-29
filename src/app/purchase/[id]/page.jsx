'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import ExchangeInfoSection from '@/components/exchange/ExchangeInfoSection';
import {fetchPurchase} from '@/lib/api/purchase';
import {fetchMyCards} from '@/lib/api/shop';
import CardDetailSection from '@/components/common/TransactionSection';
import TransactionSection from '@/components/ui/skeleton/TransactionSkeleton';
import ExchangeInfoSkeleton from '@/components/ui/skeleton/ExchangeInfoSkeleton';
import {getAccessTokenFromStorage} from '@/lib/token';
import {postExchangeProposal} from '@/lib/api/exchange';
import toast from 'react-hot-toast';

export default function PurchasePage() {
  const {id} = useParams();

  const [photoCard, setPhotoCard] = useState(null);
  const [myCards, setMyCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timeoutId;

    if (id) {
      setIsLoading(true);
      setShowSkeleton(false);

      timeoutId = setTimeout(() => {
        setShowSkeleton(true);
      }, 3000);

      loadData(id).then(() => {
        setIsLoading(false);
      });
    }

    return () => clearTimeout(timeoutId);
  }, [id]);

  const loadData = async shopId => {
    try {
      const accessToken = getAccessTokenFromStorage();
      if (!accessToken) throw new Error('로그인이 필요합니다.');

      const [purchaseData, myCardData] = await Promise.all([
        fetchPurchase(shopId, accessToken),
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

  const handleExchange = async (requestCardId, description) => {
    try {
      const accessToken = getAccessTokenFromStorage();
      console.log('✅ 서버로 전송할 requestCardId:', requestCardId);
      console.log('✅ 서버로 전송할 targetCardId:', photoCard.id);
      console.log('✅ 서버로 전송할 description:', description);

      await postExchangeProposal({
        targetCardId: photoCard.id,
        requestCardId,
        description,
        accessToken,
      });
      toast.success('교환 제안을 보냈습니다.');
      return true;
    } catch (err) {
      console.error('❌ 교환 제안 실패:', err);
      toast.error('교환 제안에 실패했습니다.');
      return false;
    }
  };

  if (isLoading && showSkeleton) {
    return (
      <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
        <TransactionSection type="buyer" />
        <ExchangeInfoSkeleton />
      </div>
    );
  }

  if (!photoCard && isLoading) {
    return (
      <div className="text-white text-center mt-10">
        포토카드를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div>
      <CardDetailSection type="buyer" photoCard={photoCard} error={error} />
      <ExchangeInfoSection
        info={{
          targetCardId: photoCard.id,
          description: photoCard.exchangeDescription,
          grade: photoCard.exchangeGrade,
          genre: photoCard.exchangeGenre,
          myCards,
        }}
        onSelect={handleExchange}
      />
    </div>
  );
}
