'use client';

import Image from 'next/image';
import {useEffect, useState} from 'react';
import Button from '../common/Button';
import {formatCardGrade} from '@/utils/formatCardGrade';
import gradeStyles from '@/utils/gradeStyles';
import {FILTER_TAB_CONFIG, FILTER_LABEL_MAP} from '@/utils/filterOptions';

export default function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  filterCounts,
  tabs = ['grade', 'genre', 'method', 'soldOut'],
  selectedFilter = {type: '', value: ''},
}) {
  const availableTabs = tabs.map(type => ({
    type,
    ...FILTER_TAB_CONFIG[type],
  }));

  const [selectedTab, setSelectedTab] = useState(availableTabs[0]?.type || '');
  const [selectedValues, setSelectedValues] = useState([]);

  const currentTab = availableTabs.find(tab => tab.type === selectedTab);

  // 현재 필터링 중인 탭 보여주기
  useEffect(() => {
    if (!isOpen) return;

    if (selectedFilter?.type && tabs.includes(selectedFilter.type)) {
      setSelectedTab(selectedFilter.type);
      const values = selectedFilter.value?.split(',') ?? [];
      setSelectedValues(values);
    } else {
      setSelectedTab(availableTabs[0]?.type || '');
      setSelectedValues([]);
    }
  }, [isOpen, selectedFilter, tabs]);

  // 필터 적용 함수
  const handleApply = () => {
    if (selectedValues.length > 0) {
      onApply({type: selectedTab, value: selectedValues.join(',')});
    } else {
      onApply({type: '', value: ''});
    }
    setSelectedValues([]);
    onClose();
  };

  // 필터 토글 함수
  const toggleValue = value => {
    setSelectedValues(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value],
    );
  };

  const isSelected = value => selectedValues.includes(value);

  if (!isOpen) return null;

  const totalCount = selectedValues.length
    ? selectedValues.reduce(
        (sum, v) => sum + (filterCounts?.[selectedTab]?.[v] || 0),
        0,
      )
    : Object.values(filterCounts?.[selectedTab] || {}).reduce(
        (sum, count) => sum + count,
        0,
      );

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
        <div
          className={`flex h-[52px] text-sm mx-6 ${
            availableTabs.length === 4 ? 'justify-between' : 'gap-6'
          }`}
        >
          {availableTabs.map(tab => {
            const isActive = selectedTab === tab.type;
            return (
              <button
                key={tab.type}
                className={`relative p-4 text-center ${
                  isActive
                    ? 'text-white border-b-1 border-white'
                    : 'text-gray400'
                }${availableTabs.length === 4 ? 'px-2' : 'px-4'}`}
                onClick={() => {
                  setSelectedTab(tab.type);
                  setSelectedValues([]);
                }}
              >
                {tab.label}
                {isActive && selectedValues.length > 0 && (
                  <span className="ml-[4px]">{selectedValues.length}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* 옵션 */}
        <div className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {currentTab?.options.map(option => {
              const selected = isSelected(option);
              const count = filterCounts?.[currentTab.type]?.[option] || 0;

              const label =
                currentTab.type === 'grade'
                  ? formatCardGrade(option)
                  : FILTER_LABEL_MAP[option] || option;

              const labelClass =
                currentTab.type === 'grade'
                  ? gradeStyles[option] || 'text-white'
                  : selected
                  ? 'text-white'
                  : 'text-gray300';

              return (
                <li
                  key={option}
                  onClick={() => toggleValue(option)}
                  className={`w-full px-8 py-4 flex justify-between items-center text-sm cursor-pointer ${
                    selected ? 'bg-gray500' : ''
                  }`}
                >
                  <span className={labelClass}>{label}</span>
                  <span className={selected ? 'text-gray100' : 'text-gray300'}>
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
            variant="primary"
            role="filter"
          >
            {totalCount}개 포토보기
          </Button>
        </div>
      </div>
    </div>
  );
}
