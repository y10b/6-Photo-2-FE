'use client';

import {useEffect, useState} from 'react';
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
import {useModal} from '@/components/modal/ModalContext';
import useMarketInfiniteCards from '@/hooks/useMarketInfiniteCards';
import useLocalUser from '@/hooks/useLocalUser';
import {
  GENRE_OPTIONS,
  GRADE_OPTIONS,
  SOLDOUT_OPTIONS,
  SORT_OPTIONS,
} from '@/utils/filterOptions';

export default function MarketplacePage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('latest');
  const [filter, setFilter] = useState({type: '', value: ''});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCounts, setFilterCounts] = useState(null);
  const [isMyCardsSellOpen, setIsMyCardsSellOpen] = useState(false);
  const [isSellRegistrationOpen, setIsSellRegistrationOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const {openModal, closeModal} = useModal();

  // 무한스크롤 커스텀 훅
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMarketInfiniteCards({keyword, sort, filter});

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
  const user = useLocalUser();

  const handleCardClick = card => {
    if (!user.id) {
      // 비회원일 경우 모달 열기
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

    const isMyCard = card?.nickname === user.nickname;
    const path = isMyCard ? `/sale/${card.shopId}` : `/purchase/${card.shopId}`;
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
                options={SORT_OPTIONS}
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
                  options={GRADE_OPTIONS}
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
                  options={GENRE_OPTIONS}
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
                  options={SOLDOUT_OPTIONS}
                />
              </div>
            </div>
            <div>
              <DropdownInput
                className="!h-[45px] !w-[140px] pc:!w-[180px] pc:!h-[50px]"
                name="sort"
                value={sort}
                onChange={({target}) => setSort(target.value)}
                options={SORT_OPTIONS}
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
      {user && (
        <MyCardsSellBottomSheet
          isOpen={isMyCardsSellOpen}
          onClose={() => setIsMyCardsSellOpen(false)}
          onCardSelectedForSale={handleCardSelectedForSale}
        />
      )}

      {/* SellCardRegistrationBottomSheet 컴포넌트 렌더링 추가 */}
      {user && (
        <SellCardRegistrationBottomSheet
          isOpen={isSellRegistrationOpen}
          onClose={handleCloseSellRegistration}
          cardId={selectedCardId}
        />
      )}
    </>
  );
}
