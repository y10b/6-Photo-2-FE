'use client';

import {useEffect, useState} from 'react';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';
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
import {useModal} from '@/components/modal/ModalContext';
import PointDrawModal from '@/components/common/PointDrawModal';

export default function MarketplacePage() {
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('latest');
  const [filter, setFilter] = useState({type: '', value: ''});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCounts, setFilterCounts] = useState(null);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);
  const [isMyCardsSellOpen, setIsMyCardsSellOpen] = useState(false);
  const {openModal} = useModal();
  const [isSellRegistrationOpen, setIsSellRegistrationOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  // 브레이크포인트 감지
  useEffect(() => {
    const getIsMobileOrTablet = () => {
      const pcMinWidth = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--breakpoint-pc',
        ),
      );
      return window.innerWidth < pcMinWidth;
    };

    const handleResize = () => {
      setIsTabletOrMobile(getIsMobileOrTablet());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 무한스크롤 쿼리 (모든 디바이스에서 사용)
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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

  // 필터 값 카운트 (기존 코드 유지)
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
  }, []);

  // 검색어 핸들러
  const handleSearch = value => setKeyword(value);

  const sortOptions = [
    {label: '최신순', value: 'latest'},
    {label: '낮은 가격순', value: 'price-asc'},
    {label: '높은 가격순', value: 'price-desc'},
    {label: '오래된순', value: 'oldest'},
  ];

  const cards = infiniteData?.pages.flatMap(p => p.result) ?? [];

  const handleCardSelectedForSale = cardId => {
    console.log('MarketplacePage: Card selected for sale, ID:', cardId);
    setSelectedCardId(cardId);
    setIsMyCardsSellOpen(false);
    setIsSellRegistrationOpen(true);
  };

  const handleCloseSellRegistration = () => {
    setIsSellRegistrationOpen(false);
    setSelectedCardId(null);
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

        {/* 여기 아래에 포인트 뽑기 버튼 추가 */}
        <div className="mt-6">
          <Button
            role="modal"
            variant="primary"
            fullWidth={false}
            onClick={() =>
              openModal({
                type: 'point',
                children: <PointDrawModal />,
              })
            }
          >
            🎁 오늘의 포인트 뽑기
          </Button>
        </div>

        <div className="space-y-[15px] pb-[80px]">
          {/* 모바일 검색창 */}
          <div className="block tablet:hidden w-full mb-2">
            <SearchInput
              name="query"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onSearch={handleSearch}
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
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onSearch={handleSearch}
                  placeholder="검색"
                  className="!w-[200px] pc:!w-[320px] !h-[45px] pc:!h-[50px]"
                />
              </div>

              <div className="tablet:ml-[30px] pc:ml-[60px]">
                <DropdownInput
                  className="border-none !px-0 !gap-[10px]"
                  name="grade"
                  value={filter.type === 'grade' ? filter.value : ''}
                  // 드롭다운 토글
                  onChange={({target}) => {
                    const isSameValue =
                      filter.type === 'grade' && filter.value === target.value;
                    setFilter(
                      isSameValue
                        ? {type: '', value: ''}
                        : {type: 'grade', value: target.value},
                    );
                  }}
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
                  // 드롭다운 토글
                  onChange={({target}) => {
                    const isSameValue =
                      filter.type === 'genre' && filter.value === target.value;
                    setFilter(
                      isSameValue
                        ? {type: '', value: ''}
                        : {type: 'genre', value: target.value},
                    );
                  }}
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
                  // 드롭다운 토글
                  onChange={({target}) => {
                    const isSameValue =
                      filter.type === 'soldOut' &&
                      filter.value === target.value;
                    setFilter(
                      isSameValue
                        ? {type: '', value: ''}
                        : {type: 'soldOut', value: target.value},
                    );
                  }}
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
          <CardList
            cards={cards}
            className={`grid gap-4 ${
              isTabletOrMobile ? 'grid-cols-2' : 'gap-20 grid-cols-3'
            }`}
          />
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
