'use client';

import {useState, useEffect} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import SearchInput from '@/components/ui/input/SearchInput';
import CardList from '@/components/ui/card/cardOverview/CardList';
import FilterBottomSheet from '@/components/market/FilterBottomSheet2';
import Image from 'next/image';
import ExchangeFullScreen from './ExchangeFullScreen';
import useFilteredCards from '@/hooks/useFilteredCards';

export default function ExchangeModal({myCards, targetCardId}) {
  const {closeModal, openModal} = useModal();
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({type: '', value: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [myExchangeRequests, setMyExchangeRequests] = useState([]);

  const {filteredCards, filterCounts} = useFilteredCards(
    myCards,
    search,
    filter,
  );

  useEffect(() => {
    console.log('🟡 ExchangeModal 받은 targetCardId:', targetCardId);

    // 내가 요청한 교환 목록 조회
    const fetchMyExchangeRequests = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange/card/${targetCardId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error('교환 요청 목록을 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        console.log('내가 요청한 교환 목록:', data);

        // 요청 상태인 교환만 필터링
        const validRequests = (data.data || []).filter(
          item => item.status === 'REQUESTED'
        );

        setMyExchangeRequests(validRequests);
      } catch (error) {
        console.error('교환 요청 목록 조회 실패:', error);
      }
    };

    if (targetCardId) {
      fetchMyExchangeRequests();
    }
  }, [targetCardId]);

  const handleCardClick = async card => {
    // 디버깅을 위한 로깅 추가
    console.log('선택된 카드 전체 데이터:', card);
    console.log('카드 ID 정보:', {
      userCardId: card.userCardId,
      photoCardId: card.photoCardId,
      id: card.id
    });
    
    // 이미 교환 요청한 카드인지 확인
    const isAlreadyRequested = myExchangeRequests.some(
      request => request.requestCardId === card.userCardId
    );

    if (isAlreadyRequested) {
      alert('이미 교환 요청한 카드입니다.');
      return;
    }

    console.log('선택된 원본 카드 데이터:', card);
    
    setIsLoading(true);
    
    try {
      const cardId = card.userCardId;
      console.log('카드 상태 확인에 사용할 ID:', cardId);
      
      if (!cardId) {
        throw new Error('카드 ID가 없습니다.');
      }
      
      // 카드 상태 재확인
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cards/${cardId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('카드 정보를 가져오는데 실패했습니다.');
      }
      
      const cardData = await response.json();
      console.log('서버에서 받은 카드 데이터:', cardData);
      
      // 카드 상태가 saleStatus 또는 status 필드에 있을 수 있음
      const cardStatus = cardData.saleStatus || cardData.status;
      
      if (cardStatus !== 'IDLE') {
        alert('현재 교환할 수 없는 카드입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      
      const formattedCard = {
        ...card,
        userCardId: cardId,
        photoCardId: card.photoCardId,
        status: 'IDLE',
        type: 'exchange_big'
      };

      console.log('포맷팅된 카드 데이터:', formattedCard);

      openModal({
        type: 'custom',
        content: (
          <ExchangeFullScreen
            card={formattedCard}
            targetCardId={targetCardId}
            onClose={closeModal}
          />
        ),
      });
    } catch (error) {
      console.error('카드 상태 확인 중 오류:', error);
      alert('카드 상태를 확인하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 이미 교환 요청한 카드 필터링
  const availableCards = filteredCards.filter(card => {
    return !myExchangeRequests.some(
      request => request.requestCardId === card.userCardId
    );
  });

  return (
    <div className="font-noto text-white w-full max-h-[80vh] overflow-y-auto pb-5 relative">
      <div className="sticky top-0 z-10 bg-black px-4 pt-4 pb-2">
        <div className="mb-[30px] relative">
          <p className="font-baskin text-gray-300 text-sm mb-[15px]">
            마이갤러리
          </p>
          <p className="font-baskin text-[26px]">포토카드 교환하기</p>
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 p-2"
          >
            <Image
              src="/icons/ic_close.svg"
              width={24}
              height={24}
              alt="close"
            />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-[30px]">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-600 rounded-lg"
          >
            <Image
              src="/icons/ic_filter.svg"
              width={24}
              height={24}
              alt="filter"
            />
            <span>필터</span>
          </button>
          <div className="flex-1">
            <SearchInput
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="카드 검색"
            />
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* 교환 요청한 카드 목록 */}
        {myExchangeRequests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">교환 요청한 카드</h3>
            <div className="grid grid-cols-2 gap-4">
              {myExchangeRequests.map(request => (
                <div
                  key={request.id}
                  className="bg-gray-800 rounded-lg p-4"
                >
                  <div className="aspect-w-4 aspect-h-3 mb-2">
                    <img
                      src={request.imageUrl}
                      alt={request.name}
                      className="object-cover rounded"
                    />
                  </div>
                  <p className="text-sm font-bold truncate">{request.name}</p>
                  <p className="text-xs text-gray-400">
                    {request.grade} | {request.genre}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <CardList
          cards={availableCards.map(card => ({
            ...card,
            type: 'original',
            onClick: () => handleCardClick(card),
          }))}
          onCardClick={(id) => {
            const card = availableCards.find(c => c.userCardId === id);
            if (card) {
              handleCardClick(card);
            }
          }}
          className="grid grid-cols-2 tablet:grid-cols-2 pc:grid-cols-3 gap-4"
        />
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white">로딩 중...</div>
        </div>
      )}

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filter={filter}
        onFilterChange={setFilter}
        filterCounts={filterCounts}
      />
    </div>
  );
}
