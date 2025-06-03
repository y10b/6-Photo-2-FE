'use client';

import {useState, useEffect} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import SearchInput from '@/components/ui/input/SearchInput';
import CardList from '@/components/ui/card/cardOverview/CardList';
import FilterBottomSheet from '@/components/market/FilterBottomSheet2';

import ExchangeFullScreen from './ExchangeFullScreen';
import useFilteredCards from '@/hooks/useFilteredCards';

export default function ExchangeModal({myCards, targetCardId, shopListingId}) {
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
    if (!targetCardId) {
      console.error('교환할 카드 ID가 없습니다.');
      alert('교환할 카드 정보가 없습니다.');
      closeModal();
      return;
    }

    if (!shopListingId) {
      console.error('판매글 ID가 없습니다.');
      alert('판매글 정보가 없습니다.');
      closeModal();
      return;
    }

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
          item => item.status === 'REQUESTED',
        );

        setMyExchangeRequests(validRequests);
      } catch (error) {
        console.error('교환 요청 목록 조회 실패:', error);
      }
    };

    fetchMyExchangeRequests();
  }, [targetCardId, shopListingId, closeModal]);

  const handleCardClick = async card => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 카드 상태 확인
      const cardResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cards/${card.userCardId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!cardResponse.ok) {
        throw new Error('카드 정보를 가져오는데 실패했습니다.');
      }

      const cardData = await cardResponse.json();

      // 카드 상태 확인
      if (cardData.status && cardData.status !== 'IDLE') {
        throw new Error('이미 거래 중이거나 교환할 수 없는 상태의 카드입니다.');
      }

      const formattedCard = {
        ...card,
        status: cardData.status,
      };

      openModal({
        type: 'custom',
        content: (
          <ExchangeFullScreen
            card={formattedCard}
            targetCardId={targetCardId} // photoCardId 전달
            shopListingId={shopListingId} // 판매글 ID 전달
            onClose={closeModal}
          />
        ),
      });
    } catch (error) {
      console.error('카드 상태 확인 중 오류:', error);
      alert(error.message || '카드 상태를 확인하는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 이미 교환 요청한 카드 필터링
  const availableCards = filteredCards.filter(card => {
    return !myExchangeRequests.some(
      request => request.requestCardId === card.userCardId,
    );
  });
  {
    isLoading && <div className="text-white">로딩 중...</div>;
  }

  return (
    <div className="w-full max-h-[95vh] flex flex-col px-[15px] tablet:px-5 pc:px-30 relative">
      {/* 헤더 영역: 고정 */}
      <div className="sticky top-0 z-10 pb-4">
        <div className="mb-[30px] relative">
          <p className="font-baskin text-gray300 text-sm tablet:text-base pc:text-2xl mb-[15px] tablet:mb-10">
            마이갤러리
          </p>
          <p className="font-baskin text-[26px]">포토카드 교환하기</p>
        </div>

        <div className="flex items-center gap-[10px] mb-[30px]">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="p-[12.5px] h-[45px] border-1"
          >
            <img
              src="/icons/ic_filter.svg"
              width={20}
              height={20}
              alt="filter"
            />
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

      {/* 카드 리스트 스크롤 영역 */}
      <div className="flex-1 mb-30 overflow-y-auto min-h-0 hide-scrollbar">
        <div className="">
          <CardList
            cards={availableCards.map(card => ({
              ...card,
              type: 'original',
              onClick: () => handleCardClick(card),
            }))}
            onCardClick={id => {
              const card = availableCards.find(c => c.userCardId === id);
              if (card) {
                handleCardClick(card);
              }
            }}
            className="grid grid-cols-2 gap-[5px] w-max-[375px] tablet:w-max-[744px] pc:w-max-[1200px] mx-auto"
          />
        </div>
      </div>

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
