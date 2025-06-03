'use client';

import {useEffect} from 'react';
import {useRouter, useParams} from 'next/navigation';
import {useQuery} from '@tanstack/react-query';
import ExchangeInfoSection from '@/components/exchange/ExchangeInfoSection';
import CardDetailSection from '@/components/common/TransactionSection';
import ExchangeInfoSkeleton from '@/components/ui/skeleton/ExchangeInfoSkeleton';
import TransactionSkeleton from '@/components/ui/skeleton/TransactionSkeleton';
import {fetchPurchase} from '@/lib/api/purchase';
import {fetchShopDetail} from '@/lib/api/shop';
import {useAccessToken} from '@/hooks/useAccessToken';

function getErrorMessage(error, _unused, purchaseData) {
  return (
    error?.message ||
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
  const router = useRouter();

  // 구매 정보 API
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

  // 판매글 상세 API
  const {
    data: shopDetail,
    isLoading: isLoadingShopDetail,
    isError: isErrorShopDetail,
    error: shopDetailError,
  } = useQuery({
    queryKey: ['shopDetail', id],
    queryFn: () => fetchShopDetail(id),
    enabled: !!id,
  });

  // 판매자인 경우 판매 상세 페이지로 리다이렉트
  useEffect(() => {
    if (purchaseData && purchaseData.isSeller) {
      router.replace(`/sale/${id}`);
    }
  }, [purchaseData, id, router]);

  const isLoading = isLoadingPurchase || isLoadingShopDetail;
  const isError = isErrorPurchase || isErrorShopDetail;

  const errorMessage = getErrorMessage(
    purchaseError || shopDetailError,
    null,
    purchaseData,
  );

  const is410Error =
    purchaseError?.response?.status === 410 ||
    purchaseData?.isSoldOut === true ||
    purchaseData?.remainingQuantity === 0;

  if (isLoading) return <PurchaseSkeleton />;

  // 판매자인 경우 로딩 유지 (리다이렉트 처리)
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
  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <CardDetailSection
        type="buyer"
        photoCard={purchaseData}
        error={errorMessage}
        isDisabled={is410Error}
      />
      <ExchangeInfoSection
        exchangeGrade={shopDetail?.shop?.exchangeGrade}
        exchangeGenre={shopDetail?.shop?.exchangeGenre}
        exchangeDescription={shopDetail?.shop?.exchangeDescription}
        onExchangeClick={() => handleExchangeClick(id)}
      />
    </div>
  );
}

// 이 함수는 상단에서 정의되지 않았으므로 필요 시 다음과 같이 추가해주세요:
function handleExchangeClick(id) {
  // 예: 교환 요청 모달 오픈 혹은 라우팅
  console.log(`교환 요청 버튼 클릭 - shopId: ${id}`);
}
