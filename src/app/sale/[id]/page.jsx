'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {fetchShopDetail} from '@/lib/api/shop';
import {fetchShopExchangeRequests} from '@/lib/api/exchange';
import {useAccessToken} from '@/hooks/useAccessToken';
import CardDetailSection from '@/components/common/TransactionSection';
import ExchangeSuggest from '@/components/exchange/ExchangeSuggest';
import TransactionSkeleton from '@/components/ui/skeleton/TransactionSkeleton';
import ExchangeInfoSkeleton from '@/components/ui/skeleton/ExchangeInfoSkeleton';

function SalePageSkeleton() {
  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <TransactionSkeleton type="seller" />
      <ExchangeInfoSkeleton />
    </div>
  );
}

function SalePage() {
  const {id} = useParams();
  const accessToken = useAccessToken();
  const [shopData, setShopData] = useState(null);
  const [suggestedCards, setSuggestedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShopDetail(id);
        setShopData(data);

        // 판매자인 경우 교환 제안 목록 불러오기
        if (data.isSeller && accessToken) {
          console.log('판매자 확인됨, 교환 제안 목록 로드 시작');
          const exchangeData = await fetchShopExchangeRequests(id, accessToken);
          console.log('교환 제안 데이터:', exchangeData);
          
          // 요청 상태인 교환만 필터링
          const validExchanges = (exchangeData.data || []).filter(
            item => item.status === 'REQUESTED'
          );
          
          console.log('첫 번째 교환 제안 데이터 구조:', validExchanges[0]);
          
          // 교환 제안 데이터 포맷팅
          const formattedExchanges = validExchanges.map(exchange => {
            console.log('현재 처리 중인 교환 데이터:', exchange);
            return {
              id: exchange.id,
              exchangeId: exchange.id,
              requestCardId: exchange.requestCardId,
              targetCardId: exchange.targetCardId,
              imageUrl: exchange.imageUrl || exchange.requestCard?.photoCard?.imageUrl || '/logo.svg',
              name: exchange.name || exchange.requestCard?.photoCard?.name || '카드 이름',
              grade: exchange.grade || exchange.requestCard?.photoCard?.grade || 'COMMON',
              genre: exchange.genre || exchange.requestCard?.photoCard?.genre || '장르 없음',
              description: exchange.description || '설명 없음',
              status: exchange.status,
              createdAt: exchange.createdAt,
              nickname: exchange.requestCard?.user?.nickname || '프로여행러',
              price: exchange.price || exchange.requestCard?.photoCard?.price || 0
            };
          });

          console.log('포맷팅된 교환 제안:', formattedExchanges);
          setSuggestedCards(formattedExchanges);
        }
      } catch (err) {
        console.error('데이터 로드 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, accessToken]);

  if (loading) return <SalePageSkeleton />;
  if (error) return <div className="text-white text-center mt-10">에러 발생: {error}</div>;
  if (!shopData) return <div className="text-white text-center mt-10">데이터가 없습니다.</div>;

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

  return (
    <div className="mb-30 w-full">
      <CardDetailSection
        type={isSeller ? 'seller' : 'buyer'}
        photoCard={photoCard}
        exchangeCard={exchangeCard}
      />
      {isSeller && (
        <ExchangeSuggest 
          cards={suggestedCards} 
          isSeller={true} 
          shopId={id} 
        />
      )}
    </div>
  );
}

export default SalePage;
