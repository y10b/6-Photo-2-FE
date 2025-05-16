"use client";
import { FiSearch } from "react-icons/fi";

export default function SearchInput({
  name,
  value,
  onChange,
  placeholder = "검색",
  className = "",
  onSearch, // 검색 버튼 클릭 시 실행할 함수
  ...rest
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      e.preventDefault();
      onSearch(value);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  // 입력 값이 있는지 확인
  const hasValue = value && value.length > 0;

  return (
    <div className="relative w-full font-noto">
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        type="text"
        placeholder={placeholder}
        className={`px-5 py-3 tablet:py-4 border-[1px] border-gray200 bg-black text-gray200 rounded-[2px]
          placeholder:text-gray200 focus:outline-none
          h-[45px] tablet:h-[50px] w-full text-[14px] tablet:text-[16px]
          ${hasValue ? "font-[400]" : "font-[300] text-white"}
          ${className}`}
        {...rest}
      />
      <button
        type="button"
        onClick={handleSearch}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
      >
        <FiSearch className="w-4 h-4 tablet:w-5 tablet:h-5" />
      </button>
    </div>
  );
}
