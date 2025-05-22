'use client';

import {useState} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import SearchInput from '@/components/ui/input/SearchInput';
import CardList from '@/components/ui/card/cardOverview/CardList';

export default function ExchangeModal({myCards = [], onSelect}) {
  const {closeModal} = useModal();
  const [search, setSearch] = useState('');

  // 검색된 카드 필터링입니다
  const filteredCards = myCards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="font-noto text-white w-full max-h-[80vh] overflow-y-auto pb-5 px-2">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[24px] font-bold">포토카드 교환하기</h2>
        <button
          onClick={closeModal}
          aria-label="닫기"
          className="text-gray300 text-lg"
        >
          ✕
        </button>
      </div>

      {/* 검색 인풋 */}
      <SearchInput
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="보유 카드 검색"
        className="mb-5"
      />

      {/* 카드 리스트 */}
      {filteredCards.length > 0 ? (
        <CardList
          cards={filteredCards}
          className="grid grid-cols-2 tablet:grid-cols-3 pc:grid-cols-4 gap-5"
        />
      ) : (
        <p className="text-gray300 text-sm">일치하는 포토카드가 없습니다.</p>
      )}
    </div>
  );
}
