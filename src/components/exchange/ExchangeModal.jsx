'use client';

import { useState, useEffect } from 'react';
import { useModal } from '@/components/modal/ModalContext';
import SearchInput from '@/components/ui/input/SearchInput';
import CardList from '@/components/ui/card/cardOverview/CardList';
import FilterBottomSheet from '@/components/market/FilterBottomSheet2';
import Image from 'next/image';

export default function ExchangeModal({ myCards = [], onSelect }) {
  const { closeModal } = useModal();
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ type: '', value: '' });
  const [filterCounts, setFilterCounts] = useState({ grade: {}, genre: {} });

  const testCard = {
    type: 'my_card',
    title: '테스트 포토카드',
    cardGrade: 'RARE',
    cardGenre: 'TRAVEL',
    nickname: 'me',
    price: 5000,
    quantityLeft: 3,
    quantityTotal: 10,
    imageUrl: '/images/sample.png',
  };

  const rawCards = myCards.length === 0 ? [testCard] : myCards;

  useEffect(() => {
    const counts = { grade: {}, genre: {} };
    rawCards.forEach((card) => {
      counts.grade[card.grade] = (counts.grade[card.grade] || 0) + 1;
      counts.genre[card.genre] = (counts.genre[card.genre] || 0) + 1;
    });
    setFilterCounts(counts);
  }, [rawCards]);

  const filtered = rawCards.filter((card) => {
    const matchesSearch =
      card.name?.toLowerCase().includes(search.toLowerCase()) ||
      card.title?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      !filter.type || !filter.value
        ? true
        : filter.value.split(',').includes(
            filter.type === 'grade' ? card.grade : card.genre
          );

    return matchesSearch && matchesFilter;
  });

  const mappedCards = filtered.map((card) => ({
    type: 'my_card',
    title: card.name ?? card.title ?? '제목 없음',
    cardGrade: card.grade ?? card.cardGrade,
    cardGenre: card.genre ?? card.cardGenre,
    nickname:
      card.ownerNickname || card.sellerNickname || card.nickname || 'me',
    price: card.price ?? 0,
    quantityLeft: card.remainingQuantity ?? card.quantityLeft ?? 0,
    quantityTotal: card.initialQuantity ?? card.quantityTotal ?? 0,
    imageUrl: card.imageUrl ?? '/images/fallback.png',
  }));

  return (
    <div className="font-noto text-white w-full max-h-[80vh] overflow-y-auto pb-5 px-2 relative">
      <div className="mb-[30px] relative">
        <p className="font-baskin text-gray300 text-sm mb-[15px]">마이갤러리</p>
        <p className="font-baskin text-[26px]">포토카드 교환하기</p>
        <button
          onClick={closeModal}
          aria-label="닫기"
          className="absolute right-0 top-0 text-gray300 text-lg"
        >
          ✕
        </button>
      </div>

      {/* 검색 + 필터 버튼 */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="w-[45px] h-[45px] border border-white rounded flex items-center justify-center"
        >
          <Image src="/icons/ic_filter.svg" alt="필터" width={20} height={20} />
        </button>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="보유 카드 검색"
          className="flex-1"
        />
      </div>

      {/* 카드 리스트 */}
      {mappedCards.length > 0 ? (
        <CardList
          cards={mappedCards}
          className="grid grid-cols-2 tablet:grid-cols-3 pc:grid-cols-4 gap-5"
        />
      ) : (
        <p className="text-gray300 text-sm">일치하는 포토카드가 없습니다.</p>
      )}

      {/* 필터 바텀시트 */}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(f) => setFilter(f)}
        filterCounts={filterCounts}
        tabs={['grade', 'genre']}
      />
    </div>
  );
}
