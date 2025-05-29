'use client';

import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import CardDetailSection from '@/components/common/TransactionSection';
import ExchangeSuggest from '@/components/exchange/ExchangeSuggest';
import {fetchShopDetail} from '@/lib/api/shop'; 

function SalePage() {
  const {id} = useParams();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShopDetail(id);
        setShopData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (!shopData) return <div>데이터가 없습니다.</div>;

  const {shop, isSeller} = shopData;

  const photoCard = {
    name: shop.photoCard.name,
    grade: shop.photoCard.grade,
    genre: shop.photoCard.genre,
    imageUrl:shop.photoCard.imageUrl,
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

export default SalePage;
