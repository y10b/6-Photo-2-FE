'use client';

import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import {useAccessToken} from '@/hooks/useAccessToken';
import {useModal} from '@/components/modal/ModalContext';
import {useInView} from 'react-intersection-observer';

export default function MyExchangeList({cards = [], onCancelExchange}) {
  const [loading, setLoading] = useState({});
  const [visibleCount, setVisibleCount] = useState(5);
  const accessToken = useAccessToken();
  const {openModal} = useModal();
  const {ref: loaderRef, inView} = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && visibleCount < cards.length) {
      setVisibleCount(prev => prev + 5);
    }
  }, [inView, cards.length, visibleCount]);

  if (!cards.length) {
    return null;
  }

  const handleCancelExchange = async exchangeId => {
    if (loading[exchangeId]) return;
    
    console.log('취소 요청 시작:', exchangeId);

    openModal({
      type: 'alert',
      title: '교환 취소',
      description: '정말 교환 요청을 취소하시겠습니까?',
      button: {
        label: '취소하기',
        onClick: async () => {
          try {
            setLoading(prev => ({...prev, [exchangeId]: true}));
            console.log('취소 API 호출 시작:', exchangeId);
            
            // 로컬 테스트를 위해 URL 확인
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5005';
            console.log('사용 중인 API 기본 URL:', baseUrl);

            const response = await fetch(
              `${baseUrl}/api/exchange/${exchangeId}/cancel`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            const responseData = await response.json();
            console.log('취소 API 응답:', responseData);

            if (!response.ok) throw new Error(responseData.message || '교환 취소 실패');

            console.log('취소 성공, 부모 컴포넌트에 알림:', exchangeId);
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
              description: error.message || '교환 요청 취소 중 오류가 발생했습니다.',
            });
          } finally {
            setLoading(prev => ({...prev, [exchangeId]: false}));
          }
        },
      },
    });
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
                {card.name || '카드 이미지'}
              </p>
              <p className="text-sm text-blue mb-[2px]">
                {card.grade || 'COMMON'} | {card.genre || '장르 없음'}
              </p>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray400">
                  {card.price || '0'}P 에 구매
                </p>
                <p className="text-sm text-gray400">
                  {card.nickname || '프로여행러'}
                </p>
              </div>
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
          <div ref={loaderRef} className="h-10 flex items-center justify-center">
            <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </section>
  );
}
