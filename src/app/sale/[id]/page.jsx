'use client';

import {useParams, useRouter} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import CardDetailSection from '@/components/common/TransactionSection';
import ExchangeSuggest from '@/components/exchange/ExchangeSuggest';
import {fetchShopDetail} from '@/lib/api/shop';
import {fetchExchangeProposals} from '@/lib/api/exchange';
import TransactionSkeleton from '@/components/ui/skeleton/TransactionSkeleton';
import ExchangeInfoSkeleton from '@/components/ui/skeleton/ExchangeInfoSkeleton';
import {useEffect} from 'react';

function SaleSkeleton() {
  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <TransactionSkeleton type="seller" />
      <ExchangeInfoSkeleton />
    </div>
  );
}

export default function SalePage() {
  const {id} = useParams();
  const router = useRouter();

  const {
    data: shopData,
    isLoading: isLoadingShop,
    isError: isErrorShop,
    error: shopError,
  } = useQuery({
    queryKey: ['shopDetail', id],
    queryFn: () => fetchShopDetail(id),
    enabled: !!id,
  });

  const {
    data: exchangeProposals,
    isLoading: isLoadingProposals,
    isError: isErrorProposals,
    error: proposalsError,
  } = useQuery({
    queryKey: ['exchangeProposals', id],
    queryFn: () => fetchExchangeProposals(id),
    enabled: !!id && !!shopData?.isSeller,
  });

  // 교환 제안 목록 데이터 처리
  const proposals = exchangeProposals?.data || [];

  useEffect(() => {
    if (!isLoadingShop && shopData && !shopData.isSeller) {
      router.push(`/purchase/${id}`);
    }
  }, [isLoadingShop, shopData, router, id]);

  if (isLoadingShop) return <SaleSkeleton />;

  if (isErrorShop)
    return (
      <div className="text-center text-red-500 mt-10">
        에러 발생: {shopError?.message || '알 수 없는 에러'}
      </div>
    );

  if (!shopData)
    return <div className="text-center mt-10">데이터가 없습니다.</div>;

  const {shop, isSeller} = shopData;

  const photoCard = {
    name: shop.photoCard.name,
    grade: shop.photoCard.grade,
    genre: shop.photoCard.genre,
    imageUrl: shop.photoCard.imageUrl,
    description: shop.photoCard.description,
    sellerNickname: shop.seller.nickname,
    price: shop.price,
    remainingQuantity: shop.remainingQuantity,
    initialQuantity: shop.initialQuantity,
  };

  const exchangeCard = [
    {
      grade: shop.exchangeGrade ?? '',
      genre: shop.exchangeGenre ?? '',
      description: shop.exchangeDescription ?? '',
    },
  ];

  return (
    <div className="mb-30 w-full">
      <CardDetailSection
        type="seller"
        photoCard={photoCard}
        exchangeCard={exchangeCard}
      />
      {shopData?.isSeller && (
        <ExchangeSuggest
          proposals={proposals}
          isLoading={isLoadingProposals}
          error={isErrorProposals ? proposalsError?.message : null}
        />
      )}
    </div>
  );
}
