"use client";

import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import FilterBottomSheet from "@/components/market/FilterBottomSheet";
import { SearchInput } from "@/components/ui/input";
import { fetchMarketCards } from "@/lib/api/marketApi";
import DropdownInput from "@/components/ui/input/DropdownInput";
import Image from "next/image";
import Link from "next/link";
import CardList from "@/components/ui/card/cardOverview/CardList";
import Button from "@/components/common/Button";

export default function MarketplacePage() {
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [filter, setFilter] = useState({ type: "", value: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allCards, setAllCards] = useState([]);
  const [filterCounts, setFilterCounts] = useState(null);

  // 무한 스크롤 트리거용 ref
  const { ref: loaderRef, inView } = useInView({ threshold: 0.1 });

  // 무한 스크롤링
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["marketCards", keyword, sort, filter],
      queryFn: ({ pageParam = 1 }) =>
        fetchMarketCards({
          pageParam,
          take: 12,
          keyword,
          sort,
          filterType: filter.type,
          filterValue: filter.value,
        }),
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1;
        }
        return undefined;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 필터 값 카운트
  useEffect(() => {
    if (!data || filter.type) return;

    const allCards = data.pages.flatMap((page) => page.result);

    const counts = {
      grade: {},
      genre: {},
      method: {},
      soldOut: {},
    };

    allCards.forEach((card) => {
      counts.grade[card.cardGrade] = (counts.grade[card.cardGrade] || 0) + 1;
      counts.genre[card.cardGenre] = (counts.genre[card.cardGenre] || 0) + 1;
      const isSoldOut = card.quantityLeft === 0 ? "true" : "false";
      counts.soldOut[isSoldOut] = (counts.soldOut[isSoldOut] || 0) + 1;
    });

    setFilterCounts(counts);
  }, [data, filter.type]);

  // 임시 이미지로 변경(삭제 예정)
  const cards =
    data?.pages.flatMap((page) =>
      page.result.map((card) => ({ ...card, imageUrl: "/images/image1.png" }))
    ) ?? [];

  const handleSearch = (value) => setKeyword(value);

  const sortOptions = [
    { label: "최신순", value: "latest" },
    { label: "낮은 가격순", value: "price-asc" },
    { label: "높은 가격순", value: "price-desc" },
    { label: "오래된순", value: "oldest" },
  ];

  return (
    <>
      <div className="max-w-[744px] tablet:max-w-[1200px] mx-auto">
        {/* 데스크탑/태블릿 헤더 */}
        <div className="hidden tablet:flex justify-between items-center">
          <h1 className="font-baskin text-[48px] pc:text-[62px] font-bold text-white">
            마켓플레이스
          </h1>
          <Link href="/sell">
            <Button role="sell" variant="primary" fullWidth={false}>
              나의 포토카드 판매하기
            </Button>
          </Link>
        </div>

        <div className="space-y-[15px] pb-[80px]">
          {/* 모바일 검색창 */}
          <div className="block tablet:hidden w-full mb-2">
            <SearchInput
              name="query"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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
                onChange={({ target }) => setSort(target.value)}
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
                  onChange={(e) => setKeyword(e.target.value)}
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
                  value={filter.type === "grade" ? filter.value : ""}
                  onChange={({ target }) =>
                    setFilter({ type: "grade", value: target.value })
                  }
                  placeholder="등급"
                  options={[
                    { label: "COMMON", value: "COMMON" },
                    { label: "RARE", value: "RARE" },
                    { label: "SUPER_RARE", value: "SUPER_RARE" },
                    { label: "LEGENDARY", value: "LEGENDARY" },
                  ]}
                />
              </div>

              <div className="tablet:ml-[25px] pc:ml-[45px]">
                <DropdownInput
                  className="border-none !px-0"
                  name="genre"
                  value={filter.type === "genre" ? filter.value : ""}
                  onChange={({ target }) =>
                    setFilter({ type: "genre", value: target.value })
                  }
                  placeholder="장르"
                  options={[
                    { label: "여행", value: "TRAVEL" },
                    { label: "풍경", value: "LANDSCAPE" },
                    { label: "인물", value: "PORTRAIT" },
                    { label: "사물", value: "OBJECT" },
                  ]}
                />
              </div>

              <div className="tablet:ml-[25px] pc:ml-[45px]">
                <DropdownInput
                  className="border-none !px-0"
                  name="soldOut"
                  value={filter.type === "soldOut" ? filter.value : ""}
                  onChange={({ target }) =>
                    setFilter({ type: "soldOut", value: target.value })
                  }
                  placeholder="매진여부"
                  options={[
                    { label: "판매중", value: "false" },
                    { label: "품절", value: "true" },
                  ]}
                />
              </div>
            </div>
            <div>
              <DropdownInput
                className="!h-[45px] !w-[140px] pc:!w-[180px] pc:!h-[50px]"
                name="sort"
                value={sort}
                onChange={({ target }) => setSort(target.value)}
                options={sortOptions}
              />
            </div>
          </div>

          {/* 카드 목록 그리드 */}
          {/* TODO: 카드리스트 컴포넌트에서 그리드 처리하도록 수정해야 함. */}
          <div className="w-full">
            <CardList
              cards={cards}
              className="grid grid-cols-2 gap-[5px] tablet:grid-cols-2 tablet:gap-[20px] pc:grid-cols-3 pc:gap-[80px] max-w-[360px] tablet:max-w-[704px] pc:max-w-[1440px] mx-auto"
            />
          </div>

          {/* 무한 스크롤 트리거(수정 예정)*/}
          <div ref={loaderRef} className="h-10" />
          {isFetchingNextPage && (
            <div className="text-center text-white">불러오는 중...</div>
          )}

          {/* 모바일 하단 고정 바 + 필터 바텀시트 */}
          <div className="tablet:hidden">
            <FilterBottomSheet
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={(filter) => setFilter(filter)}
              filterCounts={filterCounts}
              tabs={["grade", "genre", "soldOut"]}
              selectedFilter={filter}
            />

            <div className="fixed bottom-[15px] left-[15px] right-[15px] h-[55px] px-[18px] bg-main z-10 text-center rounded-xs">
              <Link href="/sell" className="block w-full h-full">
                <Button
                  role="sell"
                  variant="primary"
                  fullWidth
                  className="w-full h-full"
                >
                  나의 포토카드 판매하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
