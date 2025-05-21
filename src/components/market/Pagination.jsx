"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [viewport, setViewport] = useState("mobile");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // 브레이크포인트 계산
  useEffect(() => {
    const handleResize = () => {
      const tabletMin = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--breakpoint-tablet"
        )
      );
      setViewport(window.innerWidth < tabletMin ? "mobile" : "tablet");
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 모바일 페이지네이션 정렬
  const getMobilePages = () => {
    const last = totalPages;
    if (currentPage === 1) return [1, 2, "...right", last - 1, last];
    if (currentPage === 2) return [1, 2, 3, "...right", last - 1, last];
    if (currentPage === 3) return [1, 2, 3, 4, "...right", last];
    if (currentPage === last - 2)
      return [1, "...left", last - 3, last - 2, last - 1, last];
    if (currentPage === last - 1)
      return [1, 2, "...left", last - 2, last - 1, last];
    if (currentPage === last) return [1, 2, "...left", last - 1, last];
    return [
      1,
      "...left",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...right",
      last,
    ];
  };

  // 전체 페이지네이션 정렬
  const generatePageNumbers = () => {
    const last = totalPages;
    if (totalPages <= 6)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (viewport === "mobile") return getMobilePages();

    if (currentPage <= 2)
      return [1, 2, 3, "...right", last - 2, last - 1, last];
    if (currentPage === 3) return [1, 2, 3, 4, "...right", last - 1, last];
    if (currentPage === 4) return [1, "...left", 3, 4, 5, "...right", last];
    if (currentPage >= 5 && currentPage <= last - 3)
      return [
        1,
        "...left",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...right",
        last,
      ];
    if (currentPage === last - 2)
      return [
        1,
        2,
        "...left",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        last,
      ];
    return [1, 2, 3, "...left", last - 2, last - 1, last];
  };

  // 페이지 이동 함수
  const handlePageChange = (page) => {
    onPageChange(page);
    setOpenDropdown(null);
  };

  // ...(더보기) 클릭 함수
  const handleEllipsisClick = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  // 페이지네이션 드롭다운
  const getDropdownPages = (type) => {
    const shownPages = new Set(
      pageNumbers.filter((p) => typeof p === "number")
    );
    const hiddenPages = Array.from(
      { length: totalPages - 2 },
      (_, i) => i + 2
    ).filter((p) => !shownPages.has(p));
    return type === "left"
      ? hiddenPages.filter((p) => p < currentPage)
      : hiddenPages.filter((p) => p > currentPage);
  };

  const pageNumbers = generatePageNumbers();

  // 디자인 동적 적용
  const isMobile = viewport === "mobile";
  const dropdownSizeClass = isMobile
    ? "w-[40px] max-h-[150px]"
    : "w-[45px] max-h-[170px]";
  const itemSizeClass = isMobile ? "w-[34px] h-[30px]" : "w-[36px] h-[34px]";
  const buttonSizeClass = isMobile ? "w-[40px] h-[40px]" : "w-[45px] h-[45px]";

  return (
    <div
      className="flex justify-center gap-[10px] mt-15 items-center text-white relative"
      ref={dropdownRef}
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hover:opacity-80 disabled:opacity-50"
      >
        <Image src="/icons/ic_left.svg" alt="이전" width={22} height={22} />
      </button>

      {pageNumbers.map((num, index) => {
        if (typeof num === "string" && num.includes("...")) {
          return (
            <div key={`ellipsis-${index}`} className="relative">
              <button
                onClick={() => handleEllipsisClick(`${num}-${index}`)}
                className={`${buttonSizeClass} flex items-center justify-center text-sm hover:bg-white/30 relative`}
              >
                ...
                <Image
                  src="/icons/ic_corner.svg"
                  alt="더보기"
                  width={6}
                  height={6}
                  className="absolute bottom-0 right-0"
                />
              </button>
              {openDropdown === `${num}-${index}` && (
                <div
                  className={`absolute top-10 left-1/2 -translate-x-1/2 bg-gray500 border border-gray100 z-50 overflow-y-auto rounded-[2px] ${dropdownSizeClass}`}
                >
                  {getDropdownPages(
                    num.includes("left") ? "left" : "right"
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`${itemSizeClass} text-sm block hover:bg-gray-700`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`${buttonSizeClass} text-sm border rounded-xs hover:bg-white/10 transition-all ${
              currentPage === num
                ? "border-white font-bold"
                : "border-transparent"
            }`}
          >
            {num}
          </button>
        );
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hover:opacity-80 disabled:opacity-30"
      >
        <Image src="/icons/ic_right.svg" alt="다음" width={22} height={22} />
      </button>
    </div>
  );
}
