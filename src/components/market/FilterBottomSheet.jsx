"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "../common/Button";

const fullTabConfig = {
  grade: {
    label: "등급",
    options: ["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"],
  },
  genre: {
    label: "장르",
    options: ["TRAVEL", "LANDSCAPE", "PORTRAIT", "OBJECT"],
  },
  soldOut: {
    label: "매진 여부",
    options: ["false", "true"],
  },
};

const labelMap = {
  COMMON: "COMMON",
  RARE: "RARE",
  SUPER_RARE: "SUPER RARE",
  LEGENDARY: "LEGENDARY",
  TRAVEL: "여행",
  LANDSCAPE: "풍경",
  PORTRAIT: "인물",
  OBJECT: "사물",
  true: "판매 완료",
  false: "판매 중",
};

const colorMap = {
  COMMON: "text-main",
  RARE: "text-blue",
  SUPER_RARE: "text-purple",
  LEGENDARY: "text-pink",
};

export default function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  filterCounts,
  tabs = ["grade", "genre", "soldOut"],
}) {
  const resolvedTabs = tabs.map((type) => ({
    type,
    ...fullTabConfig[type],
  }));

  const [selectedTab, setSelectedTab] = useState(resolvedTabs[0]?.type || "");
  const [selectedValues, setSelectedValues] = useState([]);

  const currentTab = resolvedTabs.find((tab) => tab.type === selectedTab);

  const handleApply = () => {
    if (selectedValues.length > 0) {
      onApply({ type: selectedTab, value: selectedValues.join(",") });
    }
    onClose();
  };

  const toggleValue = (value) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const isSelected = (value) => selectedValues.includes(value);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end">
      <div className="absolute inset-0 bg-black opacity-70" onClick={onClose} />

      {/* 바텀시트 */}
      <div className="relative z-10 w-[375px] h-[480px] bg-[#1b1b1b] text-gray400 rounded-t-[16px] overflow-hidden flex flex-col">
        <div className="relative flex items-center justify-center h-[52px] px-5">
          <span className="absolute left-1/2 -translate-x-1/2">필터</span>
          <button
            onClick={onClose}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6"
            aria-label="닫기"
          >
            <Image
              src="/icons/ic_close_gray.svg"
              alt="닫기"
              width={24}
              height={24}
            />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex h-[52px] text-sm gap-6 mx-6">
          {resolvedTabs.map((tab) => {
            const isActive = selectedTab === tab.type;
            const selectedCount = isActive ? selectedValues.length : 0;

            return (
              <button
                key={tab.type}
                className={`relative p-4 text-center ${
                  isActive
                    ? "text-white border-b-1 border-white"
                    : "text-gray400"
                }`}
                onClick={() => {
                  setSelectedTab(tab.type);
                  setSelectedValues([]);
                }}
              >
                {tab.label}
                {selectedCount > 0 && (
                  <span className="ml-[6px]">{selectedCount}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 옵션 */}
        <div className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {currentTab?.options.map((opt) => {
              const selected = isSelected(opt);
              const count = filterCounts?.[currentTab.type]?.[opt] || 0;
              return (
                <li
                  key={opt}
                  onClick={() => toggleValue(opt)}
                  className={`w-full px-8 py-4 flex justify-between items-center text-sm cursor-pointer ${
                    selected ? "bg-gray500" : ""
                  }`}
                >
                  <span
                    className={
                      currentTab.type === "grade"
                        ? colorMap[opt] || "text-white"
                        : selected
                        ? "text-white"
                        : "text-gray300"
                    }
                  >
                    {labelMap[opt] || opt}
                  </span>

                  <span
                    className={`text-sm ${
                      selected ? "text-gray100" : "text-gray300"
                    }`}
                  >
                    {count}개
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between px-5 pb-10 gap-[11px]">
          <button
            onClick={() => setSelectedValues([])}
            className="flex items-center justify-center w-[54px] h-[55px]"
            aria-label="초기화"
          >
            <Image
              src="/icons/ic_reset.svg"
              alt="초기화"
              width={24}
              height={24}
            />
          </button>
          <Button
            onClick={handleApply}
            fullWidth
            role="filter"
            variant="primary"
          >
            {selectedValues.reduce(
              (acc, value) => acc + (filterCounts?.[selectedTab]?.[value] || 0),
              0
            )}
            개 포토보기
          </Button>
        </div>
      </div>
    </div>
  );
}
