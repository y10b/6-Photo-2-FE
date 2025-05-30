'use client';

import {useEffect, useState} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';
import {useRouter} from 'next/navigation';
import FilterBottomSheet from '@/components/market/FilterBottomSheet';
import {SearchInput} from '@/components/ui/input';
import {fetchMarketCards} from '@/lib/api/marketApi';
import DropdownInput from '@/components/ui/input/DropdownInput';
import Image from 'next/image';
import Button from '@/components/common/Button';
import CardList from '@/components/ui/card/cardOverview/CardList';
import MyCardsSellBottomSheet from '@/components/market/MyCardsSellBottomSheet';
import {countFilterValues} from '@/utils/countFilterValues';
import SellCardRegistrationBottomSheet from '@/components/market/SellCardRegistrationBottomSheet';
import CardOverviewSkeleton from '@/components/ui/skeleton/CardOverviewSkeleton';

export default function MarketplacePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [sort, setSort] = useState('latest');
  const [filter, setFilter] = useState({type: '', value: ''});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCounts, setFilterCounts] = useState(null);
  const [isMyCardsSellOpen, setIsMyCardsSellOpen] = useState(false);
  const [isSellRegistrationOpen, setIsSellRegistrationOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  // 무한스크롤 쿼리
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['marketCards', keyword, sort, filter],
    queryFn: ({pageParam = 1}) =>
      fetchMarketCards({
        pageParam,
        take: 12,
        keyword,
        sort,
        filterType: filter.type,
        filterValue: filter.value,
      }),
    enabled: true,
    getNextPageParam: lastPage =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });

  // 무한 스크롤 트리거용 ref
  const {ref: loaderRef, inView} = useInView({threshold: 0.8});

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  // 필터 값 카운트
  useEffect(() => {
    fetchMarketCards({
      pageParam: 1,
      take: 1000,
      keyword: '',
      sort: 'latest',
    }).then(res => {
      const counts = countFilterValues(res.result);
      setFilterCounts(counts);
    });
  }, [filter]);

  // 검색어 핸들러
  const handleSearch = value => setKeyword(value);

  const sortOptions = [
    {label: '최신순', value: 'latest'},
    {label: '오래된순', value: 'oldest'},
    {label: '낮은 가격순', value: 'price-asc'},
    {label: '높은 가격순', value: 'price-desc'},
  ];

  const cards = infiniteData?.pages.flatMap(p => p.result) ?? [];

  const handleCardSelectedForSale = cardId => {
    setSelectedCardId(cardId);
    setIsMyCardsSellOpen(false);
    setIsSellRegistrationOpen(true);
  };

  const handleCloseSellRegistration = () => {
    setIsSellRegistrationOpen(false);
    setSelectedCardId(null);
  };

  // 카드 클릭 실행함수
  // TODO: cardOverview에서 card 받아와야 함.
  const user =
    typeof window !== 'undefined' && localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : {id: null, nickname: null};

  const handleCardClick = card => {
    console.log('user: ', user);
    console.log('card: ', card);
    const isMyCard = card?.nickname === user.nickname;
    const path = isMyCard ? `sale/${card.shopId}` : `/purchase/${card.shopId}`;
    router.push(path);
  };

  // 드롭다운 토글 핸들러
  const handleDropdownChange = (type, value) => {
    setFilter(prev =>
      prev.type === type && prev.value === value
        ? {type: '', value: ''}
        : {type, value},
    );
  };

  return (
    <>
      <div className="max-w-[1480px] mx-auto">
        {/* 데스크탑/태블릿 헤더*/}
        <div className="hidden tablet:flex justify-between items-center">
          <h1 className="font-baskin text-[48px] pc:text-[62px] font-bold text-white">
            마켓플레이스
          </h1>
          <Button
            role="sell"
            variant="primary"
            fullWidth={false}
            onClick={() => setIsMyCardsSellOpen(true)}
          >
            나의 포토카드 판매하기
          </Button>
        </div>

        <div className="space-y-[15px] pb-[80px]">
          {/* 모바일 검색창 */}
          <div className="block tablet:hidden w-full mb-2">
            <SearchInput
              name="query"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onSearch={() => handleSearch(inputValue)}
              placeholder="검색"
            />
          </div>
          <hr className="border-gray400 mt-[15px]" />
          {/* 모바일 필터 + 정렬 */}
          <div className="flex tablet:hidden justify-between items-center">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-[35px] h-[35px] border border-white rounded flex items-center justify-center"
            >
              <Image
                src="/icons/ic_filter.svg"
                alt="필터"
                width={20}
                height={20}
              />
            </button>
            <div>
              <DropdownInput
                className="!w-[130px] !h-[35px]"
                name="sort"
                value={sort}
                onChange={({target}) => setSort(target.value)}
                options={sortOptions}
              />
            </div>
          </div>

          {/* 데스크탑/태블릿: 검색 + 필터 + 정렬 */}
          <div className="hidden tablet:flex flex-wrap gap-2 py-2 items-center justify-between">
            <div className="flex flex-wrap items-center max-w-full tablet:max-w-[calc(100%-180px)]">
              {/* 검색창 */}
              <div>
                <SearchInput
                  name="query"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onSearch={() => handleSearch(inputValue)}
                  placeholder="검색"
                  className="!w-[200px] pc:!w-[320px] !h-[45px] pc:!h-[50px]"
                />
              </div>

              <div className="tablet:ml-[30px] pc:ml-[60px]">
                <DropdownInput
                  className="border-none !px-0 !gap-[10px]"
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

              <div className="tablet:ml-[25px] pc:ml-[45px]">
                <DropdownInput
                  className="border-none !px-0 !gap-[10px]"
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

              <div className="tablet:ml-[25px] pc:ml-[45px]">
                <DropdownInput
                  className="border-none !px-0 !gap-[10px]"
                  name="soldOut"
                  value={filter.type === 'soldOut' ? filter.value : ''}
                  onChange={({target}) =>
                    handleDropdownChange('soldOut', target.value)
                  }
                  placeholder="매진여부"
                  options={[
                    {label: '판매 중', value: 'false'},
                    {label: '품절', value: 'true'},
                  ]}
                />
              </div>
            </div>
            <div>
              <DropdownInput
                className="!h-[45px] !w-[140px] pc:!w-[180px] pc:!h-[50px]"
                name="sort"
                value={sort}
                onChange={({target}) => setSort(target.value)}
                options={sortOptions}
              />
            </div>
          </div>

          {/* 카드 목록 */}
          <div className="mt-6">
            {isLoading ? (
              <div className="grid gap-4 pc:gap-20 grid-cols-2 pc:grid-cols-3">
                {Array.from({length: 6}).map((_, idx) => (
                  <CardOverviewSkeleton key={idx} type="for_sale" />
                ))}
              </div>
            ) : (
              <CardList
                cards={cards}
                className="grid gap-4 pc:gap-20 grid-cols-2 pc:grid-cols-3 justify-items-center"
                onCardClick={handleCardClick}
              />
            )}
          </div>

          <div ref={loaderRef} className="h-10" />
          {/* 모바일 하단 고정 바 + 필터 바텀시트 */}
          <div className="tablet:hidden">
            <FilterBottomSheet
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={filter => setFilter(filter)}
              filterCounts={filterCounts}
              tabs={['grade', 'genre', 'soldOut']}
              selectedFilter={filter}
            />

            <div className="fixed bottom-[15px] left-[15px] right-[15px] h-[55px] px-[18px] bg-main z-10 text-center rounded-xs">
              <Button
                role="sell"
                variant="primary"
                fullWidth
                className="w-full h-full"
                onClick={() => setIsMyCardsSellOpen(true)}
              >
                나의 포토카드 판매하기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 나의 포토카드 판매하기 바텀시트 */}
      <MyCardsSellBottomSheet
        isOpen={isMyCardsSellOpen}
        onClose={() => setIsMyCardsSellOpen(false)}
        onCardSelectedForSale={handleCardSelectedForSale}
      />

      {/* SellCardRegistrationBottomSheet 컴포넌트 렌더링 추가 */}
      <SellCardRegistrationBottomSheet
        isOpen={isSellRegistrationOpen}
        onClose={handleCloseSellRegistration}
        cardId={selectedCardId}
      />
    </>
  );
}
