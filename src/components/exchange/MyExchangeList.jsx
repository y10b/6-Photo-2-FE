'use client';

import {useState, useEffect} from 'react';
import {useAccessToken} from '@/hooks/useAccessToken';
import {useModal} from '@/components/modal/ModalContext';
import {useInView} from 'react-intersection-observer';
import {cancelExchangeRequest} from '@/lib/api/exchange';

export default function MyExchangeList({cards = [], onCancelExchange}) {
  const [loading, setLoading] = useState({});
  const [visibleCount, setVisibleCount] = useState(5);
  const accessToken = useAccessToken();
  const {openModal} = useModal();
  const {ref: loaderRef, inView} = useInView({
    threshold: 0.5,
  });

  // 취소되지 않은 카드만 필터링 (CANCELLED 상태 제외)
  const activeCards = cards.filter(card => card.status !== 'CANCELLED');

  useEffect(() => {
    if (inView && visibleCount < activeCards.length) {
      setVisibleCount(prev => prev + 5);
    }
  }, [inView, activeCards.length, visibleCount]);

  if (!activeCards.length) {
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
            // exchangeId가 숫자인지 확인하고 변환
            const numericExchangeId = Number(exchangeId);
            console.log('취소 API 호출 시작:', numericExchangeId);
            
            // API 함수 사용
            const result = await cancelExchangeRequest(numericExchangeId, accessToken);
            console.log('취소 API 응답:', result);

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
            
            // 오류 메시지 처리 개선
            let errorMessage = '교환 요청 취소 중 오류가 발생했습니다.';
            if (error.message) {
              if (error.message.includes('이미 처리된 교환 요청')) {
                errorMessage = '이미 처리된 교환 요청은 취소할 수 없습니다.';
              } else if (error.message.includes('이미 수락된')) {
                errorMessage = '이미 수락된 교환 요청은 취소할 수 없습니다.';
              } else if (error.message.includes('이미 거절된')) {
                errorMessage = '이미 거절된 교환 요청은 취소할 수 없습니다.';
              } else if (error.message.includes('본인이 요청한 교환만')) {
                errorMessage = '본인이 요청한 교환만 취소할 수 있습니다.';
              } else if (error.message.includes('존재하지 않는')) {
                errorMessage = '존재하지 않는 교환 요청입니다.';
              }
            }
            
            openModal({
              type: 'fail',
              title: '교환 취소',
              result: '실패',
              description: errorMessage,
            });
          } finally {
            setLoading(prev => ({...prev, [exchangeId]: false}));
          }
        },
      },
    });
  };

  const visibleCards = activeCards.slice(0, visibleCount);
  const hasMoreCards = visibleCount < activeCards.length;

  // 각 카드 렌더링 함수
  const renderCard = (card) => {
    // exchangeId가 없으면 id를 사용하도록 수정
    const cardId = card.exchangeId || card.id;
    console.log('카드 렌더링:', card, '사용할 ID:', cardId);
    return (
      <div key={cardId} className="bg-black border border-gray400 rounded-lg overflow-hidden">
        <div className="relative aspect-[1/1]">
          <img
            src={card.imageUrl || '/logo.svg'}
            alt={card.name || card.title || '카드 이미지'}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-white font-bold text-lg">{card.name || card.title || '카드 이미지'}</h3>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-yellow-300">{card.cardGrade || card.grade || 'COMMON'}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">{card.cardGenre || card.genre || '장르 없음'}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <p className="text-white">
              {(card.price || 0).toLocaleString()} P <span className="text-gray-300">에 구매</span>
            </p>
            <p className="text-white underline">{card.nickname || '프로여행러'}</p>
          </div>
          
          <hr className="my-3 border-gray-400" />
          
          <p className="text-white line-clamp-2 mb-4">{card.description || '설명이 없습니다.'}</p>
          
          <div className="mt-5 tablet:mt-[25px] pc:mt-10 flex justify-center">
            <button 
              className="px-4 py-2 border border-white text-white rounded hover:bg-gray-700 transition-colors"
              onClick={() => handleCancelExchange(cardId)}
              disabled={loading[cardId]}
            >
              {loading[cardId] ? '취소 중...' : '취소하기'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mt-10 pt-5 mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <h3 className="text-white text-[20px] font-bold mb-2">
        내가 제시한 교환 목록 ({activeCards.length}개)
      </h3>
      <hr className="border-t border-gray200 mb-5" />
      
      <div className="grid grid-cols-2 tablet:grid-cols-2 pc:grid-cols-3 gap-4">
        {visibleCards.map(card => renderCard(card))}
      </div>

      {hasMoreCards && (
        <div ref={loaderRef} className="h-10 flex items-center justify-center mt-4">
          <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
        </div>
      )}
    </section>
  );
}
