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

export default function ExchangeModal({ myCards = [], onSelect }) {
  const { closeModal, openModal } = useModal();

  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState({ type: '', value: '' });
  const [filterCounts, setFilterCounts] = useState({ grade: {}, genre: {} });

  // 필터 수량 계산
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

  // 검색 및 필터링
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

  // 카드 데이터 변환
  const mappedCards = filtered.map(card => ({
    id: card.id,
    title: card.name ?? card.title,
    cardGrade: card.grade ?? card.cardGrade,
    cardGenre: card.genre ?? card.cardGenre,
    nickname: card.nickname ?? card.ownerNickname ?? 'me',
    price: card.price ?? 0,
    quantityLeft: card.remainingQuantity ?? card.quantityLeft ?? 1,
    quantityTotal: card.initialQuantity ?? card.quantityTotal ?? 1,
    imageUrl: card.imageUrl ?? '/images/fallback.png',
    description: card.description ?? '',
  }));

  // 카드 클릭 시 FullScreenModal 열기 (setTimeout 사용!)
  const handleCardClick = (card) => {
    closeModal(); // 바텀시트 먼저 닫고

    setTimeout(() => {
      let proposalMessage = '';

      openModal({
        type: 'custom',
        children: (
          <FullScreenModal onClose={closeModal}>
            <div className="text-white p-4 pt-12 space-y-4">
              <h2 className="text-xl font-bold">교환 제안</h2>

              <div className="flex gap-4 items-center">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-[100px] h-[75px] object-cover rounded"
                />
                <div>
                  <p className="font-bold">{card.title}</p>
                  <p className="text-sm text-gray300">
                    {card.cardGrade} | {card.cardGenre}
                  </p>
                  <p className="text-sm text-gray400 mt-1">
                    수량 {card.quantityLeft}/{card.quantityTotal}
                  </p>
                </div>
              </div>

              <TextboxInput
                value={proposalMessage}
                onChange={(e) => {
                  proposalMessage = e.target.value;
                }}
                placeholder="교환 제안 내용을 입력하세요."
              />

              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={closeModal}>
                  취소하기
                </Button>
                <Button
                  onClick={() => {
                    onSelect?.(card.id, proposalMessage);
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
          onChange={e => setSearch(e.target.value)}
          placeholder="보유 카드 검색"
          className="flex-1"
        />
      </div>

      {/* 카드 목록 */}
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
