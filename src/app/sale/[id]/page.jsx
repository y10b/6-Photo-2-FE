'use client';

import {useParams} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import CardDetailSection from '@/components/common/TransactionSection';
import ExchangeSuggest from '@/components/exchange/ExchangeSuggest';
import {fetchShopDetail} from '@/lib/api/shop';
import TransactionSkeleton from '@/components/ui/skeleton/TransactionSkeleton';
import ExchangeInfoSkeleton from '@/components/ui/skeleton/ExchangeInfoSkeleton';

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

  const {
    data: shopData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['shopDetail', id],
    queryFn: () => fetchShopDetail(id),
    enabled: !!id,
  });

  if (isLoading) return <SaleSkeleton />;

  if (isError)
    return (
      <div className="text-center text-red-500 mt-10">
        에러 발생: {error?.message || '알 수 없는 에러'}
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
      description: shop.exchangeDescription ?? '교환 희망 안함',
    },
  ];

  const suggestedCards = [];

  return (
    <div className="mb-30 w-full">
      <CardDetailSection
        type={isSeller ? 'seller' : 'buyer'}
        photoCard={photoCard}
        exchangeCard={exchangeCard}
      />
      <ExchangeSuggest cards={suggestedCards} />
    </div>
  );
}