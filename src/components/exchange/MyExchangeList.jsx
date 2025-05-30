'use client';

import {useState, useEffect} from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import {useAccessToken} from '@/hooks/useAccessToken';
import {useModal} from '@/components/modal/ModalContext';

export default function MyExchangeList({cards = [], onCancelExchange}) {
  const [loading, setLoading] = useState({});
  const [visibleCount, setVisibleCount] = useState(5);
  const accessToken = useAccessToken();
  const {openModal} = useModal();

  useEffect(() => {
    console.log('MyExchangeList에 전달된 cards:', cards);
  }, [cards]);

  if (!cards.length) {
    console.log('MyExchangeList: cards 배열이 비어있습니다.');
    return null;
  }

  const handleCancelExchange = async exchangeId => {
    if (loading[exchangeId]) return;

    openModal({
      type: 'alert',
      title: '교환 취소',
      description: '정말 교환 요청을 취소하시겠습니까?',
      button: {
        label: '취소하기',
        onClick: async () => {
          try {
            setLoading(prev => ({...prev, [exchangeId]: true}));

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange/${exchangeId}/reject`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (!response.ok) throw new Error('교환 취소 실패');

            if (onCancelExchange) onCancelExchange(exchangeId);

            openModal({
              type: 'success',
              title: '교환 취소',
              result: '성공',
              description: '교환 요청이 취소되었습니다.',
            });
          } catch (error) {
            console.error('교환 취소 오류:', error);
            openModal({
              type: 'fail',
              title: '교환 취소',
              result: '실패',
              description: '교환 요청 취소 중 오류가 발생했습니다.',
            });
          } finally {
            setLoading(prev => ({...prev, [exchangeId]: false}));
          }
        },
      },
    });
  };

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const visibleCards = cards.slice(0, visibleCount);
  const hasMoreCards = visibleCount < cards.length;

  return (
    <section className="mt-10 pt-5 mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <h3 className="text-white text-[20px] font-bold mb-2">
        내가 제시한 교환 목록 ({cards.length}개)
      </h3>
      <hr className="border-t border-gray200 mb-5" />
      <div className="flex flex-col gap-4">
        {visibleCards.map(card => (
          <div
            key={card.exchangeId || card.id}
            className="w-[345px] tablet:w-[440px] pc:w-[520px] bg-gray500 rounded-md overflow-hidden text-white"
          >
            <div className="w-full h-[220px] relative">
              <Image
                src={card.imageUrl || '/logo.svg'}
                alt={card.name || '카드 이미지'}
                fill
                className="object-cover"
                unoptimized={!card.imageUrl?.startsWith('/')}
              />
            </div>

            <div className="p-4">
              <p className="text-base font-bold mb-[6px]">
                {card.name || '카드 이름'}
              </p>
              <p className="text-sm text-blue mb-[2px]">
                {card.grade || 'COMMON'} | {card.genre || '장르 없음'}
              </p>
              <p className="text-sm text-gray400 mb-2">4 P 에 구매 | 유디</p>
              <hr className="border-gray300 mb-2" />
              <p className="text-sm text-gray300 line-clamp-2 mb-4">
                {card.description || '설명이 없습니다.'}
              </p>
              <Button
                role="exchange-cancel"
                variant="outline"
                className="w-full"
                onClick={() => handleCancelExchange(card.exchangeId || card.id)}
                disabled={loading[card.exchangeId || card.id]}
              >
                {loading[card.exchangeId || card.id]
                  ? '취소 중...'
                  : '취소하기'}
              </Button>
            </div>
          </div>
        ))}

        {hasMoreCards && (
          <div className="text-center mt-4">
            <Button variant="outline" size="sm" onClick={handleShowMore}>
              더 보기 ({cards.length - visibleCount}개 더)
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
