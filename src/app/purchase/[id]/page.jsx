'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
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
import {Router} from 'next/router';

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

  // 판매자인 경우 판매 상세 페이지로 리다이렉트
  useEffect(() => {
    if (purchaseData && purchaseData.isSeller) {
      Router.replace(`/sale/${id}`);
    }
  }, [purchaseData, id, Router]);

  const isLoading = isLoadingPurchase || isLoadingCards;

  const isError = isErrorPurchase || isErrorCards;
  const errorMessage = getErrorMessage(purchaseError, cardError, purchaseData);

  if (isLoading) return <PurchaseSkeleton />;

  // 판매자인 경우 로딩 상태 유지 (리다이렉트 될 것이므로)
  if (purchaseData && purchaseData.isSeller) {
    return <PurchaseSkeleton />;
  }

  if (isError || !purchaseData) {
    return (
      <div className="text-white text-center mt-10">
        {errorMessage || '포토카드를 찾을 수 없습니다.'}
      </div>
    );
  }

  console.log('구매 데이터 전체 구조:', JSON.stringify(purchaseData, null, 2));
  console.log('교환 관련 정보:', {
    exchangeGrade: purchaseData.exchangeGrade,
    exchangeGenre: purchaseData.exchangeGenre,
    exchangeDescription: purchaseData.exchangeDescription,
    listingType: purchaseData.listingType,
  });

  return (
    <div>
      <CardDetailSection
        type="buyer"
        photoCard={purchaseData}
        error={errorMessage}
      />

      <ExchangeInfoSection
        info={{
          cardId: purchaseData.photoCard?.id,
          shopListingId: purchaseData.id,
          myCards: myCardData?.result || [],
          targetCardId: id,
          exchangeGrade: purchaseData.exchangeGrade,
          exchangeGenre: purchaseData.exchangeGenre,
          exchangeDescription: purchaseData.exchangeDescription,
          listingType: purchaseData.listingType,
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

      {/* 교환 요청 목록이 있을 때만 MyExchangeList 표시 */}
      {myProposals.length > 0 && (
        <MyExchangeList
          cards={myProposals}
          onCancelExchange={handleCancelExchange}
        />
      )}
    </div>
  );
}
