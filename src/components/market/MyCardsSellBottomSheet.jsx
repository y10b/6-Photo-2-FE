// src/components/market/MyCardsSellBottomSheet.jsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import FilterBottomSheet from "@/components/market/FilterBottomSheet2"; // 이 경로는 현재 프로젝트에 맞춰 조정하세요.
import { SearchInput } from "@/components/ui/input";
import useMediaQuery from "@/hooks/useMediaQuery";
import Modal from "@/components/common/Modal.jsx";
import BottomSheet from "@/components/common/BottomSheet.jsx";
import CardList from "@/components/ui/card/cardOverview/CardList";
import { fetchMyCards } from "@/lib/api/shop";
import Image from "next/image";

export default function MyCardsSellBottomSheet({ isOpen, onClose }) {
  const isMobile = useMediaQuery("(max-width: 743px)");
  const isTablet = useMediaQuery("(min-width: 744px) and (max-width: 1199px)");
  const isDesktop = useMediaQuery("(min-width: 1200px)");

  const [keyword, setKeyword] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState({ type: "", value: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCounts, setFilterCounts] = useState(null);
  const debounceTimeoutRef = useRef(null);

  const { ref: loaderRef, inView } = useInView({ threshold: 0.1 });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["marketIDLECards", keyword, filter],
      queryFn: ({ pageParam = 1 }) =>
        fetchMyCards({
          page: pageParam, 
          take: 10,
          keyword,
          filterType: filter.type,
          filterValue: filter.value,
        }),
      getNextPageParam: (lastPage) => {
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

  useEffect(() => {
    if (!data) return;
    const allCards = data.pages.flatMap((page) => page.result);
    const counts = { grade: {}, genre: {} };

    allCards.forEach((card) => {
      counts.grade[card.cardGrade] = (counts.grade[card.cardGrade] || 0) + 1;
      counts.genre[card.cardGenre] = (counts.genre[card.cardGenre] || 0) + 1;
    });

    setFilterCounts(counts);
  }, [data]);

  const handleSearch = (value) => {
    setInputValue(value);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setKeyword(value);
    }, 500);
  };

  // 모달,바텀시트가 열릴 때마다 검색어와 필터를 초기화
  useEffect(() => {
    if (isOpen) {
      setKeyword("");
      setInputValue("");
      setFilter({ type: "", value: "" });
    }
  }, [isOpen]); 

  const allCards = data?.pages.flatMap((page) => page.result) || [];

  if (!isOpen) return null;

  return (
    <>
      {isDesktop && (
        <Modal onClose={onClose}>
          <h2>나의 포토카드 목록 (데스크탑)</h2>
          {/* TODO: 데스크탑 모달 내부 내용 추가 */}
          {/* 데스크탑 모달 안에도 모바일/태블릿과 유사한 내용을 배치할 수 있습니다. */}
          <div className="w-full mx-auto pb-[90px] min-h-[80vh]">
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="검색"
              />
            </div>

            <div className=" mt-6 flex justify-center">
              {isLoading ? (
                <p className="text-center">로딩 중...</p>
              ) : allCards.length > 0 ? (
                <CardList
                  cards={allCards}
                  className="grid grid-cols-2 gap-[5px]"
                />
              ) : (
                <p>등록된 카드가 없습니다.</p>
              )}
            </div>

            <div ref={loaderRef} className="h-10 mt-6">
              {isFetchingNextPage && (
                <p className="text-center">불러오는 중...</p>
              )}
            </div>

            <FilterBottomSheet
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={setFilter}
              filterCounts={filterCounts}
              tabs={["grade", "genre"]}
            />
          </div>
        </Modal>
      )}
      {(isMobile || isTablet) && (
        <BottomSheet onClose={onClose}>
          <p className="font-baskin text-gray300 text-sm mb-[15px]">
            마이갤러리
          </p>
          <p className="font-baskin text-[26px] mb-[30px]">
            나의 포토카드 판매하기
          </p>
          <div className="w-full mx-auto pb-[90px] min-h-[80vh]">
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="검색"
              />
            </div>

            <div className=" mt-6 flex justify-center">
              {isLoading ? (
                <p className="text-center">로딩 중...</p>
              ) : allCards.length > 0 ? (
                <CardList
                  cards={allCards}
                  className="grid grid-cols-2 gap-[5px]"
                />
              ) : (
                <p>등록된 카드가 없습니다.</p>
              )}
            </div>

            <div ref={loaderRef} className="h-10 mt-6">
              {isFetchingNextPage && (
                <p className="text-center">불러오는 중...</p>
              )}
            </div>

            <FilterBottomSheet
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
              onApply={setFilter}
              filterCounts={filterCounts}
              tabs={["grade", "genre"]}
            />
          </div>
        </BottomSheet>
      )}
    </>
  );
}

