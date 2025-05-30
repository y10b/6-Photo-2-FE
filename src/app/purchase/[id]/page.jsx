'use client';

import {useState, useEffect} from 'react';
import {useParams} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import ExchangeInfoSection from '@/components/exchange/ExchangeInfoSection';
import CardDetailSection from '@/components/common/TransactionSection';
import ExchangeInfoSkeleton from '@/components/ui/skeleton/ExchangeInfoSkeleton';
import TransactionSkeleton from '@/components/ui/skeleton/TransactionSkeleton';
import {fetchPurchase} from '@/lib/api/purchase';
import {fetchMyCards} from '@/lib/api/shop';
import {useAccessToken} from '@/hooks/useAccessToken';
import MyExchangeList from '@/components/exchange/MyExchangeList';
import {fetchMyExchangeRequests} from '@/lib/api/exchange';

function getErrorMessage(purchaseError, cardError, purchaseData) {
  return (
    purchaseError?.message ||
    cardError?.message ||
    (purchaseData?.remainingQuantity === 0
      ? '잔여 수량이 0인 상품입니다. 구매할 수 없습니다.'
      : null)
  );
}

function PurchaseSkeleton() {
  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <TransactionSkeleton type="buyer" />
      <ExchangeInfoSkeleton />
    </div>
  );
}

export default function PurchasePage() {
  const {id} = useParams();
  const accessToken = useAccessToken();
  const [myProposals, setMyProposals] = useState([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);

  const {
    data: purchaseData,
    isLoading: isLoadingPurchase,
    isError: isErrorPurchase,
    error: purchaseError,
  } = useQuery({
    queryKey: ['purchase', id],
    queryFn: () => fetchPurchase(id, accessToken),
    enabled: !!id && !!accessToken,
  });

  const {
    data: myCardData,
    isLoading: isLoadingCards,
    isError: isErrorCards,
    error: cardError,
  } = useQuery({
    queryKey: ['myCards', id],
    queryFn: () =>
      fetchMyCards({filterType: 'status', filterValue: 'IDLE,LISTED'}),
    enabled: !!accessToken,
  });

  const {data: myExchangeData, isLoading: isLoadingExchanges} = useQuery({
    queryKey: ['myExchangeRequests', id],
    queryFn: () => fetchMyExchangeRequests(id, accessToken),
    enabled: !!id && !!accessToken,
  });

  useEffect(() => {
    const loadExchangeProposals = async () => {
      if (!myExchangeData?.data || !myExchangeData.data.length) return;
      setIsLoadingProposals(true);

      try {
        const exchangeProposals = myExchangeData.data.map(exchange => {
          const requestCard = exchange.requestCard || {};
          const photoCard = requestCard.photoCard || {};

          // ✅ 여기에 추가
          console.log(`📦 교환 요청 ID ${exchange.id}의 photoCard 정보`, {
            photoCard,
            grade: photoCard.grade,
            genre: photoCard.genre,
          });

          return {
            id: exchange.id,
            exchangeId: exchange.id,
            requestCardId: exchange.requestCardId,
            photoCardId: photoCard.id,
            imageUrl: photoCard.imageUrl || '/logo.svg',
            name: photoCard.name || '카드 이름',
            grade: photoCard.grade || 'COMMON',
            genre: photoCard.genre || '장르 없음',
            description:
              exchange.description || photoCard.description || '설명 없음',
            status: exchange.status || 'REQUESTED',
            createdAt: exchange.createdAt || new Date().toISOString(),
          };
        });

        const sortedProposals = exchangeProposals.sort((a, b) => b.id - a.id);
        setMyProposals(sortedProposals);
      } catch (error) {
        console.error('교환 요청 데이터 변환 중 오류:', error);
      } finally {
        setIsLoadingProposals(false);
      }
    };

    loadExchangeProposals();
  }, [myExchangeData, accessToken]);

  const handleCancelExchange = exchangeId => {
    setMyProposals(prev => prev.filter(card => card.exchangeId !== exchangeId));
  };

  const isLoading =
    isLoadingPurchase ||
    isLoadingCards ||
    isLoadingExchanges ||
    isLoadingProposals;
  const isError = isErrorPurchase || isErrorCards;
  const errorMessage = getErrorMessage(purchaseError, cardError, purchaseData);

  if (isLoading) return <PurchaseSkeleton />;

  if (isError || !purchaseData) {
    return (
      <div className="text-white text-center mt-10">
        {errorMessage || '포토카드를 찾을 수 없습니다.'}
      </div>
    );
  }

  const {grade, genre} = purchaseData;

  return (
    <div>
      <CardDetailSection
        type="buyer"
        photoCard={purchaseData}
        error={errorMessage}
      />
      <ExchangeInfoSection
        info={{
          description:
            purchaseData.exchangeDescription || '교환 희망 설명이 없습니다.',
          grade: purchaseData.exchangeGrade || 'COMMON',
          genre: purchaseData.exchangeGenre || '장르 없음',
          myCards: myCardData?.result || [],
          targetCardId: id,
        }}
        onSelect={(requestCardId, description) => {
          const proposedCard = myCardData?.result.find(
            card => card.id === requestCardId,
          );
          if (proposedCard) {
            setMyProposals(prev => [...prev, proposedCard]);
          }
        }}
      />
      <MyExchangeList
        cards={myProposals}
        onCancelExchange={handleCancelExchange}
      />
    </div>
  );
}
