'use client';

import {useEffect, useState, useMemo, useCallback} from 'react';
import {useQuery, useInfiniteQuery} from '@tanstack/react-query';
import {useInView} from 'react-intersection-observer';
import Image from 'next/image';
import Button from '@/components/common/Button';
import SearchInput from '@/components/ui/input/SearchInput';
import DropdownInput from '@/components/ui/input/DropdownInput';
import FilterBottomSheet from '@/components/market/FilterBottomSheet';
import CardList from '@/components/ui/card/cardOverview/CardList';
import Pagination from '@/components/market/Pagination';
import {fetchMyGalleryCards} from '@/lib/api/gallaryApi';
import {countFilterValues} from '@/utils/countFilterValues';
import {formatCardGrade} from '@/utils/formatCardGrade';
import gradeStyles from '@/utils/gradeStyles';

export default function MyGalleryPage() {
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('latest');
  const [filter, setFilter] = useState({type: '', value: ''});
  const [filterCounts, setFilterCounts] = useState({
    grade: {},
    genre: {},
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false);

  // 디바이스 유형 판별 함수
  const checkDeviceType = useCallback(() => {
    const pcMinWidth = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--breakpoint-pc',
      ),
    );
    return window.innerWidth < pcMinWidth;
  }, []);

  // 디바이스 리사이징 감지
  useEffect(() => {
    const handleResize = () => setIsTabletOrMobile(checkDeviceType());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkDeviceType]);

  // 필터 카운트 계산
  useEffect(() => {
    fetchMyGalleryCards({
      pageParam: 1,
      take: 1000,
      keyword: '',
      sort: 'latest',
    }).then(res => {
      const counts = countFilterValues(res.result);
      setFilterCounts(counts);
    });
  }, []);

  // 무한 스크롤 쿼리 (데스크탑용)
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['myGallery', keyword, sort, filter],
    queryFn: ({pageParam = 1}) =>
      fetchMyGalleryCards({
        pageParam,
        take: 12,
        keyword,
        sort,
        filterType: filter.type,
        filterValue: filter.value,
      }),
    getNextPageParam: lastPage =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    enabled: !isTabletOrMobile,
  });

  // 페이지네이션 쿼리 (모바일/태블릿용)
  const {data: pageData} = useQuery({
    queryKey: ['myGalleryPage', keyword, sort, filter, currentPage],
    queryFn: () =>
      fetchMyGalleryCards({
        pageParam: currentPage,
        take: 4,
        keyword,
        sort,
        filterType: filter.type,
        filterValue: filter.value,
      }),
    enabled: isTabletOrMobile,
  });

  // 전체 응답 객체
  const responseData = isTabletOrMobile ? pageData : infiniteData?.pages?.[0];
  const nickname = responseData?.nickname;
  const totalCount = responseData?.totalCount ?? 0;

  // 실제 카드 배열만 추출
  const displayCards = isTabletOrMobile
    ? pageData?.result ?? []
    : infiniteData?.pages.flatMap(p => p.result) ?? [];

  // 무한 스크롤 트리거
  const {ref: loaderRef, inView} = useInView({threshold: 0.8});

  useEffect(() => {
    if (!isTabletOrMobile && inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isTabletOrMobile, hasNextPage, isFetchingNextPage]);

  // 검색어 변경 핸들러
  const handleSearch = value => setKeyword(value);

  return (
    <>
      <div className="max-w-[1480px] mx-auto">
        {/* 데스크탑/태블릿 헤더 */}
        <div className="hidden tablet:flex justify-between items-center">
          <h1 className="font-baskin text-[48px] pc:text-[62px] font-bold text-white">
            마이갤러리
          </h1>
          <Button
            role="create"
            variant="primary"
            fullWidth={false}
            onClick={() => {}} // TODO: 포토카드 생성페이지와 연결
          >
            포토카드 생성하기
          </Button>
        </div>
        {/* 유저 정보, 수량 */}
        <p className="text-white mb-2">
          {nickname}님이 보유한 포토카드{' '}
          <span className="text-main">({totalCount}장)</span>
        </p>
        {/* 카드장르별 수량 */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {['COMMON', 'RARE', 'SUPER_RARE', 'LEGENDARY'].map(grade => (
            <span
              key={grade}
              className={`text-sm px-3 py-1 border rounded font-semibold border-white ${gradeStyles[grade]}`}
            >
              {formatCardGrade(grade)} {filterCounts.grade[grade] ?? 0}장
            </span>
          ))}
        </div>

        <div className="space-y-[15px] pb-[80px]">
          <hr className="border-gray400 mt-[15px]" />
          {/* 모바일 필터 + 검색 */}
          <div className="flex tablet:hidden items-center gap-2 mb-4">
            {/* 필터 버튼 */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-[35px] h-[35px] border border-white rounded flex items-center justify-center shrink-0"
            >
              <Image
                src="/icons/ic_filter.svg"
                alt="필터"
                width={20}
                height={20}
              />
            </button>

            {/* 검색창 */}
            <SearchInput
              name="query"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onSearch={handleSearch}
              placeholder="검색"
              className="flex-grow h-[35px]"
            />
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
                  className="!w-[160px] pc:!w-[320px]"
                />
              </div>

              {/* TODO: 필터 중복 선택 가능하도록 수정해야 함. */}
              {/* TODO: 드롭다운 메뉴 너비/폰트 조정해야 함. */}
              <div className="tablet:ml-[30px] pc:ml-[60px]">
                <DropdownInput
                  className="border-none !px-0"
                  name="grade"
                  value={filter.type === 'grade' ? filter.value : ''}
                  onChange={({target}) =>
                    setFilter({type: 'grade', value: target.value})
                  }
                  placeholder="등급"
                  options={[
                    {label: 'COMMON', value: 'COMMON'},
                    {label: 'RARE', value: 'RARE'},
                    {label: 'SUPER_RARE', value: 'SUPER_RARE'},
                    {label: 'LEGENDARY', value: 'LEGENDARY'},
                  ]}
                />
              </div>

              <div className="tablet:ml-[25px] pc:ml-[45px]">
                <DropdownInput
                  className="border-none !px-0"
                  name="genre"
                  value={filter.type === 'genre' ? filter.value : ''}
                  onChange={({target}) =>
                    setFilter({type: 'genre', value: target.value})
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

          <div>
            <CardList
              cards={displayCards}
              className={`grid ${
                isTabletOrMobile ? 'grid-cols-2' : 'grid-cols-3'
              } gap-4`}
            />

            {isTabletOrMobile ? (
              <Pagination
                currentPage={currentPage}
                totalPages={pageData?.totalPages ?? 1}
                onPageChange={setCurrentPage}
              />
            ) : (
              <div ref={loaderRef} className="h-10" />
            )}
          </div>

          {/* 모바일 하단 고정 바 + 필터 바텀시트 */}
          <div className="tablet:hidden">
            <FilterBottomSheet
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={filter => setFilter(filter)}
              filterCounts={filterCounts}
              tabs={['grade', 'genre']}
              selectedFilter={filter}
            />

            <div className="fixed bottom-[15px] left-[15px] right-[15px] h-[55px] px-[18px] bg-main z-10 text-center rounded-xs">
              <Button
                role="sell"
                variant="primary"
                fullWidth
                className="w-full h-full"
                onClick={() => {}} // TODO: 포토카드 생성페이지와 연결
              >
                나의 포토카드 생성하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
