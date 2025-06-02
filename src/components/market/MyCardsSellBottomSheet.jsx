'use client';

import React, {useEffect, useState, useRef, useMemo} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';
import {useModal} from '@/components/modal/ModalContext';
import {useRouter} from 'next/navigation';
import FilterBottomSheet from '@/components/market/FilterBottomSheet2';
import ResponsiveModalWrapper from '@/components/modal/ResponsiveModalWrapper';
import CardList from '@/components/ui/card/cardOverview/CardList';
import {fetchMyCards} from '@/lib/api/shop';
import Image from 'next/image';
import {SearchInput} from '../ui/input';
import {useDebounce} from '@/hooks/useDebounce';

export default function MyCardsSellBottomSheet({
  isOpen,
  onClose,
  onCardSelectedForSale,
}) {
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState({type: '', value: ''});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const debounceTimeoutRef = useRef(null);
  const debouncedKeyword = useDebounce(inputValue);
  const router = useRouter();
  const {openModal} = useModal();
  // 회원 비회원 여부 확인
  const user =
    typeof window !== 'undefined' && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null;

  const {ref: loaderRef, inView} = useInView({threshold: 0.1});

  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} =
    useInfiniteQuery({
      queryKey: ['marketIDLECards', debouncedKeyword, filter],
      queryFn: ({pageParam = 1}) =>
        fetchMyCards({
          page: pageParam,
          take: 10,
          keyword: debouncedKeyword,
          filterType: filter.type,
          filterValue: filter.value,
        }),
      enabled: isOpen && !!user, // 비회원일 때 api 요청 안 보내도록
      getNextPageParam: lastPage => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
      keepPreviousData: false,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const filterCounts = useMemo(() => {
    if (!data) return null;
    const allCards = data.pages.flatMap(page => page.result);
    const counts = {grade: {}, genre: {}};

    allCards.forEach(card => {
      counts.grade[card.cardGrade] = (counts.grade[card.cardGrade] || 0) + 1;
      counts.genre[card.cardGenre] = (counts.genre[card.cardGenre] || 0) + 1;
    });

    return counts;
  }, [data]);

  const handleSearch = value => {
    setInputValue(value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setKeyword(value);
    }, 500);
  };

  useEffect(() => {
    if (!isOpen) return;

    const storedUser =
      typeof window !== 'undefined' && localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user'))
        : null;

    if (!storedUser) {
      openModal({
        type: 'alert',
        title: '로그인이 필요합니다.',
        description:
          '로그인 하시겠습니까?\n다양한 서비스를 편리하게 이용하실 수 있습니다.',
        button: {
          label: '확인',
          onClick: () => router.push('/auth/login'),
        },
      });
      return;
    }

    setKeyword('');
    setInputValue('');
    setFilter({type: '', value: ''});
  }, [isOpen, openModal, router]);

  const allCards = data?.pages.flatMap(page => page.result) || [];

  const handleCardClick = card => {
    if (onCardSelectedForSale) {
      onCardSelectedForSale(card.userCardId);
    }
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <ResponsiveModalWrapper onClose={onClose} variant="bottom">
      {/* 공통 콘텐츠 구조 */}
      <div className="pb-[90px] min-h-[80vh] " style={{overflowY: 'auto'}}>
        {/* 제목은 데스크탑만 */}
        <div className="hidden pc:block ">
          <p className="font-baskin text-gray300 text-[24px] mb-10">
            마이갤러리
          </p>
          <p className="font-baskin text-[46px] mb-[20px]">
            나의 포토카드 판매하기
          </p>
          <div className="border-[2px] border-gray100 mb-[20px]"></div>
        </div>

        {/* 모바일/태블릿 전용 상단 텍스트 */}
        <div className="block pc:hidden">
          <p className="font-baskin text-gray300 text-sm mb-[15px]">
            마이갤러리
          </p>
          <p className="font-baskin text-[26px] mb-[30px]">
            나의 포토카드 판매하기
          </p>

          {/* 검색/필터 */}
          <div className="flex justify-between items-center mb-[20px] gap-[10px]">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-[52px] h-[45px] border border-gray200 rounded-[2px] flex justify-center items-center"
            >
              <Image
                src="/icons/ic_filter.svg"
                alt="필터"
                width={20}
                height={20}
              />
            </button>
            <SearchInput
              value={inputValue}
              onSearch={handleSearch}
              onChange={e => handleSearch(e.target.value)}
              placeholder="검색"
            />
          </div>
        </div>

        {/* 카드 목록 */}
        <div className="mt-6 flex justify-center">
          {isLoading ? (
            <p className="text-center">로딩 중...</p>
          ) : allCards.length > 0 ? (
            <CardList
              cards={allCards}
              className="grid grid-cols-2 gap-[5px]"
              onCardClick={handleCardClick}
            />
          ) : (
            <p>등록된 카드가 없습니다.</p>
          )}
        </div>

        {/* 무한스크롤 */}
        <div ref={loaderRef} className="h-10 mt-6">
          {isFetchingNextPage && <p className="text-center">불러오는 중...</p>}
        </div>

        {/* 필터 바텀시트 */}
        <FilterBottomSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={setFilter}
          filterCounts={filterCounts}
          tabs={['grade', 'genre']}
        />
      </div>
    </ResponsiveModalWrapper>
  );
}
