'use client';

import {useState, useEffect} from 'react';
import Button from '@/components/common/Button';
import {useModal} from '@/components/modal/ModalContext';
import ExchangeModal from './ExchangeModal';
import Image from 'next/image';

export default function ExchangeInfoSection({info, onSelect}) {
  const [exchangeInfo, setExchangeInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [myExchangeRequests, setMyExchangeRequests] = useState([]);
  const {openModal} = useModal();

  // 교환 제안 목록 조회
  const fetchExchangeRequests = async (cardId) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange/card/${cardId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('교환 제안 목록을 가져오는데 실패했습니다.');
      }

      const data = await response.json();
      console.log('교환 제안 목록 조회 결과:', data);

      if (data.success && Array.isArray(data.data)) {
        // 요청 상태인 교환만 필터링
        const validRequests = data.data.filter(
          request => request.status === 'REQUESTED'
        );
        setMyExchangeRequests(validRequests);
      }
    } catch (error) {
      console.error('교환 제안 목록 조회 실패:', error);
    }
  };

  useEffect(() => {
    const fetchExchangeInfo = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          console.error('로그인이 필요합니다.');
          return;
        }

        console.log('조회할 카드 정보:', info);

        if (!info.shopListingId) {
          console.log('판매 정보 ID가 없음');
          setExchangeInfo(null);
          return;
        }

        // 판매 정보 조회
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/shop/${info.shopListingId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log('API 응답 상태:', response.status);
        
        if (!response.ok) {
          throw new Error('교환 희망 정보를 불러오는데 실패했습니다.');
        }

        const listingInfo = await response.json();
        console.log('판매 정보:', listingInfo);

        if (!listingInfo || !listingInfo.shop) {
          console.log('판매 정보가 없음');
          setExchangeInfo(null);
          return;
        }

        const shopData = listingInfo.shop;
        console.log('판매글 데이터:', shopData);

        // 교환 가능한 경우에만 교환 정보 설정
        if (shopData.listingType === 'FOR_SALE_AND_TRADE') {
          const processedInfo = {
            exchangeDescription: shopData.exchangeDescription || '교환 희망 설명이 없습니다.',
            exchangeGrade: shopData.exchangeGrade || 'COMMON',
            exchangeGenre: shopData.exchangeGenre || '장르 없음',
            listingType: shopData.listingType,
            photoCardId: shopData.photoCardId,
            userCardId: shopData.photoCardId  // photoCardId를 userCardId로 사용
          };

          console.log('가공된 교환 정보:', processedInfo);
          setExchangeInfo(processedInfo);

          // 교환 제안 목록 조회
          if (shopData.photoCardId) {
            await fetchExchangeRequests(shopData.photoCardId);
          }
        } else {
          console.log('교환 불가능한 판매글');
          setExchangeInfo(null);
        }
      } catch (error) {
        console.error('교환 희망 정보 조회 실패:', error);
        setExchangeInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (info?.shopListingId) {
      console.log('교환 정보 조회 시작');
      fetchExchangeInfo();
    } else {
      console.log('shopListingId가 없음');
      setIsLoading(false);
    }
  }, [info?.shopListingId]);

  const handleOpenModal = () => {
    if (!exchangeInfo?.userCardId) {
      console.error('교환할 카드 ID가 없습니다.');
      return;
    }

    openModal({
      type: 'responsive',
      variant: 'bottom',
      children: <ExchangeModal 
        myCards={info.myCards} 
        targetCardId={exchangeInfo.userCardId}
        shopListingId={info.shopListingId}
      />,
    });
  };

  if (isLoading) {
    return (
      <section className="mt-10 pt-5 mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-px bg-gray-700 mb-5"></div>
          <div className="h-20 bg-gray-700 rounded mb-5"></div>
          <div className="h-6 bg-gray-700 rounded w-32"></div>
        </div>
      </section>
    );
  }

  // 교환 정보가 없는 경우에도 기본 정보 표시
  const displayInfo = exchangeInfo || {
    exchangeDescription: '교환 희망 설명이 없습니다.',
    exchangeGrade: 'COMMON',
    exchangeGenre: '장르 없음',
    listingType: 'FOR_SALE'
  };

  // 교환 불가능한 경우 표시하지 않음
  if (!exchangeInfo) {
    return null;
  }

  return (
    <section className="mt-10 pt-5 mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <h3 className="text-white text-[24px] font-bold mb-2">교환 희망 정보</h3>
      <hr className="border-t border-gray200 mb-5" />
      
      {/* 내가 요청한 교환 목록 */}
      {myExchangeRequests.length > 0 && (
        <div className="mb-8">
          <h4 className="text-white text-[18px] font-bold mb-4">내가 제시한 교환 카드</h4>
          <div className="grid grid-cols-2 gap-4">
            {myExchangeRequests.map(request => (
              <div key={request.id} className="bg-gray800 rounded-lg p-4">
                <div className="aspect-w-4 aspect-h-3 mb-2">
                  <img
                    src={request.requestCard.imageUrl}
                    alt={request.requestCard.name}
                    className="object-cover rounded-lg w-full h-full"
                  />
                </div>
                <p className="text-white font-bold text-sm truncate">
                  {request.requestCard.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow300 text-xs">
                    {request.requestCard.grade}
                  </span>
                  <span className="text-gray400 text-xs">|</span>
                  <span className="text-gray300 text-xs">
                    {request.requestCard.genre}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-white font-bold text-[18px] mb-5 whitespace-pre-wrap">
        {displayInfo.exchangeDescription}
      </p>
      <div className="flex items-center gap-2 mb-10">
        <span className="font-bold text-sm text-blue">
          {displayInfo.exchangeGrade}
        </span>
        <span className="text-gray400">|</span>
        <span className="text-gray300 text-sm">
          {displayInfo.exchangeGenre}
        </span>
      </div>
      <Button role="exchange-confirm" onClick={handleOpenModal}>
        포토카드 교환하기
      </Button>
    </section>
  );
}
