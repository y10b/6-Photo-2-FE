// components/exchange/ExchangeSuggest.jsx
'use client';

import React, {useState, useEffect} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import {useAccessToken} from '@/hooks/useAccessToken';
import CardList from '../ui/card/cardOverview/CardList';

export default function ExchangeSuggest({cards, isSeller, shopId}) {
  const {openModal} = useModal();
  const accessToken = useAccessToken();
  const [loadingStates, setLoadingStates] = useState({});
  const [displayCards, setDisplayCards] = useState([]);

  useEffect(() => {
    if (cards?.length > 0) {
      setDisplayCards(cards);
    } else {
      setDisplayCards([]);
    }
  }, [cards]);

  const handleExchangeAction = async (exchangeId, action) => {
    setLoadingStates(prev => ({...prev, [exchangeId]: action}));

    const isAccept = action === 'accept';
    const endpoint = isAccept ? 'accept' : 'reject';
    const actionText = isAccept ? '승인' : '거절';

    try {
      console.log(`교환 ${actionText} 요청 시작:`, exchangeId);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange/${exchangeId}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error(`교환 ${actionText} 실패:`, responseData);
        let errorMessage = responseData.message || `교환 ${actionText} 실패`;
        
        // 특정 에러 상황에 대한 사용자 친화적인 메시지
        if (errorMessage.includes('재고가 부족')) {
          errorMessage = '현재 재고가 부족하여 교환을 수락할 수 없습니다.';
        } else if (errorMessage.includes('이미 수락된')) {
          errorMessage = '이미 수락된 교환 요청입니다.';
        } else if (errorMessage.includes('이미 거절된')) {
          errorMessage = '이미 거절된 교환 요청입니다.';
        } else if (errorMessage.includes('취소된')) {
          errorMessage = '취소된 교환 요청입니다.';
        }
        
        openModal({
          type: 'fail',
          title: `교환 ${actionText} 실패`,
          result: '실패',
          description: errorMessage,
        });
        return;
      }

      console.log(`교환 ${actionText} 성공:`, responseData);

      openModal({
        type: 'success',
        title: `교환 ${actionText}`,
        result: '성공',
        description: `교환 요청이 ${actionText}되었습니다.`,
      });

      // 성공 시 목록에서 해당 카드 제거
      setDisplayCards(prev =>
        prev.filter(card => card.exchangeId !== exchangeId),
      );
    } catch (error) {
      console.error(`교환 ${actionText} 오류:`, error);
      openModal({
        type: 'fail',
        title: `교환 ${actionText} 실패`,
        result: '실패',
        description: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setLoadingStates(prev => ({...prev, [exchangeId]: false}));
    }
  };

  const cardDataForComponent = displayCards.map(card => ({
    id: card.exchangeId,
    type: isSeller ? 'exchange_btn2' : 'exchange_btn1',
    title: '교환 카드',
    price: card.price,
    imageUrl: card.imageUrl,
    cardGrade: card.grade,
    cardGenre: card.genre,
    nickname: card.userNickname,
    description: card.description || '',
    onClick: isSeller
      ? action => handleExchangeAction(card.exchangeId, action)
      : undefined,
    isLoading: !!loadingStates[card.exchangeId],
  }));

  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <h3 className="mb-[10px] tablet:mb-5 font-bold text-2xl tablet:text-[32px] pc:text-[40px] text-white">
        교환 제시 목록
      </h3>
      <hr className="mb-[46px] tablet:mb-[48px] pc:mb-[70px] border-2 border-gray100" />
      {cardDataForComponent.length > 0 ? (
        <div className="grid grid-cols-2 tablet:grid-cols-2 pc:grid-cols-3 gap-4">
          {cardDataForComponent.map(card => (
            <div
              key={card.id}
              className="h-[360px] tablet:h-[561px] pc:h-[600px]"
            >
              <CardList cards={[card]} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white text-center py-10">교환 제안이 없습니다.</p>
      )}
    </div>
  );
}
