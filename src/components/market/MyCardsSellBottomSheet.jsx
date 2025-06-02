'use client';

import React, {useEffect, useState, useMemo} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';
import {useModal} from '@/components/modal/ModalContext';
import {useRouter} from 'next/navigation';
import FilterBottomSheet from '@/components/market/FilterBottomSheet2';
import ResponsiveModalWrapper from '@/components/modal/ResponsiveModalWrapper';
import CardList from '@/components/ui/card/cardOverview/CardList';
import {fetchMyCards} from '@/lib/api/shop';
import Image from 'next/image';
import {DropdownInput, SearchInput} from '../ui/input';

export default function MyCardsSellBottomSheet({
  isOpen,
  onClose,
  onCardSelectedForSale,
}) {
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState({type: '', value: ''});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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
      queryKey: ['marketIDLECards', {keyword, filter}],
      queryFn: ({pageParam = 1}) =>
        fetchMyCards({
          page: pageParam,
          take: 10,
          keyword,
          filterType: filter.type,
          filterValue: filter.value,
        }),
      enabled: isOpen && !!user, // 비회원일 때 api 요청 안 보내도록
      getNextPageParam: lastPage => {
        return lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined;
      },
      keepPreviousData: false,
    });

  useEffect(() => {
    const shouldFetch = inView && hasNextPage && !isFetchingNextPage;
    if (shouldFetch) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

    setInputValue('');
    setKeyword('');
    setFilter({type: '', value: ''});
  }, [isOpen, openModal, router]);

  const allCards = data?.pages.flatMap(page => page.result) || [];

  const getFilterCounts = cards => {
    const counts = {grade: {}, genre: {}};
    cards.forEach(card => {
      counts.grade[card.cardGrade] = (counts.grade[card.cardGrade] || 0) + 1;
      counts.genre[card.cardGenre] = (counts.genre[card.cardGenre] || 0) + 1;
    });
    return counts;
  };

  const filterCounts = useMemo(() => {
    if (!data) return null;
    return getFilterCounts(allCards);
  }, [data]);

  const handleCardClick = card => {
    if (onCardSelectedForSale) {
      onCardSelectedForSale(card.userCardId);
    }
    onClose();
  };

  const handleDropdownChange = (type, value) => {
    setFilter({type, value});
  };

  const handleSearch = value => {
    setKeyword(value);
  };

  const renderCardList = () => {
    if (isLoading)
      return (
        <div className="flex justify-center h-screen mt-[50px]">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-transparent border-l-gray-400 border-r-gray-400"></div>
        </div>
      );
    if (allCards.length === 0) return <p>등록된 카드가 없습니다.</p>;

    return (
      <CardList
        cards={allCards}
        className="grid grid-cols-2 gap-[5px]"
        onCardClick={handleCardClick}
      />
    );
  };

  if (!isOpen || !user) return null;

  return (
    <ResponsiveModalWrapper onClose={onClose} variant="bottom">
      <div className="pb-[90px] min-h-[80vh]" style={{overflowY: 'auto'}}>
        {/* PC용 헤더 */}
        <div className="hidden tablet:block pc:block">
          <p className="font-baskin text-gray300 text-[24px] mb-10">
            마이갤러리
          </p>
          <p className="font-baskin text-[46px] mb-[20px]">
            나의 포토카드 판매하기
          </p>
          <div className="border-[2px] border-gray100 mb-[20px]" />

          {/* PC / 태블릿 검색,필터 */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap items-center max-w-full tablet:max-w-[calc(100%-180px)]">
              <div>
                <SearchInput
                  name="query"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSearch(inputValue);
                    }
                  }}
                  placeholder="검색"
                  className="pc:!w-[320px] pc:!h-[50px] tablet:!w-[200px] tablet:!h-[45px]"
                />
              </div>

              <div className="pc:ml-[60px] tablet:ml-[30px]">
                <DropdownInput
                  className="border-none !px-0 !gap-[10px] bg-gray500"
                  name="grade"
                  value={filter.type === 'grade' ? filter.value : ''}
                  onChange={({target}) =>
                    handleDropdownChange('grade', target.value)
                  }
                  placeholder="등급"
                  options={[
                    {label: 'COMMON', value: 'COMMON'},
                    {label: 'RARE', value: 'RARE'},
                    {label: 'SUPER RARE', value: 'SUPER_RARE'},
                    {label: 'LEGENDARY', value: 'LEGENDARY'},
                  ]}
                />
              </div>

              <div className="ml-[45px]">
                <DropdownInput
                  className="border-none !px-0 !gap-[10px] bg-gray500"
                  name="genre"
                  value={filter.type === 'genre' ? filter.value : ''}
                  onChange={({target}) =>
                    handleDropdownChange('genre', target.value)
                  }
                  placeholder="장르"
                  options={[
                    {label: '여행', value: 'TRAVEL'},
                    {label: '풍경', value: 'LANDSCAPE'},
                    {label: '인물', value: 'PORTRAIT'},
                    {label: '사물', value: 'OBJECT'},
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 모바일/태블릿용 헤더 */}
        <div className="block tablet:hidden pc:hidden">
          <p className="font-baskin text-gray300 text-sm mb-[15px]">
            마이갤러리
          </p>
          <p className="font-baskin text-[26px] mb-[30px]">
            나의 포토카드 판매하기
          </p>

          {/* 모바일 검색 + 필터 버튼 */}
          <div className="tablet:hidden flex justify-between items-center mb-[20px] gap-[10px]">
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
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch(inputValue);
                }
              }}
              placeholder="검색"
            />
          </div>
        </div>

        {/* 카드 목록 */}
        <div className="mt-6 flex justify-center">{renderCardList()}</div>

        {/* 무한스크롤 로더 */}
        <div ref={loaderRef} className="h-10 mt-6">
          {isFetchingNextPage && <p className="text-center">불러오는 중...</p>}
        </div>

        {/* 필터 바텀시트 (모바일 전용) */}
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
