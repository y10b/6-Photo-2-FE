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

  const {filteredCards, filterCounts} = useFilteredCards(
    myCards,
    search,
    filter,
  );

  useEffect(() => {
    console.log('🟡 ExchangeModal 받은 targetCardId:', targetCardId);
  }, [targetCardId]);

  const handleCardClick = card => {
    const formattedCard = {
      ...card,
      userCardId: card.userCardId ?? card.id ?? card.cardId,
    };

    console.log('✅ 선택된 카드:', formattedCard);

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
  };

  return (
    <div className="font-noto text-white w-full max-h-[80vh] overflow-y-auto pb-5 px-4 relative">
      <div className="mb-[30px] relative">
        <p className="font-baskin text-gray-300 text-sm mb-[15px]">
          마이갤러리
        </p>
        <p className="font-baskin text-[26px]">포토카드 교환하기</p>
        <button
          onClick={closeModal}
          className="absolute right-0 top-0 text-gray-300 hover:text-yellow-300"
        >
          ✕
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="w-[45px] h-[45px] border border-white rounded flex items-center justify-center"
        >
          <img src="/icons/ic_filter.svg" alt="필터" width={20} height={20} />
        </button>
        <SearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="보유 카드 검색"
          className="flex-1"
        />
      </div>

      {filteredCards.length > 0 ? (
        <CardList
          cards={filteredCards}
          onCardClick={handleCardClick}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
        />
      ) : (
        <p className="text-gray-300 text-sm">일치하는 포토카드가 없습니다.</p>
      )}

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={setFilter}
        filterCounts={filterCounts}
        tabs={['grade', 'genre']}
      />
    </div>
  );
}
