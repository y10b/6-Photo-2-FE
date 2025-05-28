'use client';

import { useState, useEffect } from 'react';
import { useModal } from '@/components/modal/ModalContext';
import SearchInput from '@/components/ui/input/SearchInput';
import TextboxInput from '@/components/ui/input/TextboxInput';
import Button from '@/components/common/Button';
import CardList from '@/components/ui/card/cardOverview/CardList';
import FilterBottomSheet from '@/components/market/FilterBottomSheet2';
import Image from 'next/image';
import FullScreenModal from '@/components/modal/layout/FullScreenModal';
import CardOverview from '@/components/ui/card/cardOverview/CardOverview'; // ✅ 카드 모양 재사용

export default function ExchangeModal({ myCards = [], targetCardId, onSelect }) {
  const { closeModal, openModal } = useModal();

  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ type: '', value: '' });
  const [filterCounts, setFilterCounts] = useState({ grade: {}, genre: {} });

  useEffect(() => {
    const counts = { grade: {}, genre: {} };
    myCards.forEach(card => {
      const grade = card.grade ?? card.cardGrade;
      const genre = card.genre ?? card.cardGenre;
      counts.grade[grade] = (counts.grade[grade] || 0) + 1;
      counts.genre[genre] = (counts.genre[genre] || 0) + 1;
    });
    setFilterCounts(counts);
  }, [myCards]);

  const filtered = myCards.filter(card => {
    const name = card.name ?? card.title ?? '';
    const grade = card.grade ?? card.cardGrade;
    const genre = card.genre ?? card.cardGenre;

    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      !filter.type || !filter.value
        ? true
        : filter.value.split(',').includes(filter.type === 'grade' ? grade : genre);

    return matchesSearch && matchesFilter;
  });

  const mappedCards = filtered.map(card => ({
    userCardId: card.id,
    title: card.name ?? card.title,
    cardGrade: card.grade ?? card.cardGrade,
    cardGenre: card.genre ?? card.cardGenre,
    nickname: card.nickname ?? card.ownerNickname ?? 'me',
    price: card.price ?? 0,
    quantityLeft: card.remainingQuantity ?? card.quantityLeft ?? 1,
    quantityTotal: card.initialQuantity ?? card.quantityTotal ?? 1,
    imageUrl: card.imageUrl ?? '/images/fallback.png',
    description: card.description ?? '',
    type: 'my_card', // ✅ 카드 스타일 맞추기 위해 type 지정
  }));

  const handleCardClick = (card) => {
    closeModal();

    setTimeout(() => {
      let message = '';

      openModal({
        type: 'custom',
        children: (
          <FullScreenModal onClose={closeModal}>
            <div className="text-white">
              <h2 className="text-center text-base font-bold mb-6">포토카드 교환하기</h2>

              {/* ✅ 동일한 카드 모양 재사용 */}
              <div className="flex justify-center mb-6">
                <CardOverview card={card} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">교환 제시 내용</label>
                <TextboxInput
                  placeholder="내용을 입력해주세요"
                  onChange={(e) => (message = e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={closeModal}>
                  취소하기
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-yellow-300 text-black font-bold"
                  onClick={() => {
                    onSelect?.(card.userCardId, message);
                    closeModal();
                  }}
                >
                  교환하기
                </Button>
              </div>
            </div>
          </FullScreenModal>
        ),
      });
    }, 0);
  };

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

      {/* 검색 + 필터 */}
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
          onCardClick={handleCardClick}
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
