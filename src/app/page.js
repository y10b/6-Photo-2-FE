"use client";

import { useState } from "react";
import {
  Input,
  SearchInput,
  DropdownInput,
  TextboxInput,
  TokenInput,
  CounterInput,
  UploadInput,
} from "@/components/ui/input";

export default function InputExamples() {
  // 상태 관리
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [file, setFile] = useState(null);

  // 등급 옵션
  const gradeOptions = [
    { label: "일반", value: "COMMON" },
    { label: "레어", value: "RARE" },
    { label: "슈퍼 레어", value: "SUPER_RARE" },
    { label: "레전더리", value: "LEGENDARY" },
  ];

  // 기본 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "text") setText(value);
    else if (name === "search") setSearchQuery(value);
    else if (name === "grade") setSelectedGrade(value);
    else if (name === "description") setDescription(value);
    else if (name === "file") setFile(value);
  };

  // 검색 핸들러
  const handleSearch = (query) => {
    console.log("검색어:", query);
    // 실제 검색 로직 구현
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black min-h-screen">
      <h1 className="text-3xl font-baskin text-white mb-10">
        <span className="text-main">Input</span> 컴포넌트 예시
      </h1>

      <div className="space-y-12">
        {/* 1. 기본 텍스트 입력 */}
        <section>
          <h2 className="text-xl text-white mb-4">1. 기본 텍스트 입력</h2>
          <Input
            label="닉네임"
            name="text"
            value={text}
            onChange={handleChange}
            placeholder="닉네임을 입력하세요"
          />
        </section>

        {/* 2. 검색 입력 */}
        <section>
          <h2 className="text-xl text-white mb-4">2. 검색 입력</h2>
          <SearchInput
            name="search"
            value={searchQuery}
            onChange={handleChange}
            placeholder="포토카드 검색"
            onSearch={handleSearch}
          />
        </section>

        {/* 3. 드롭다운 선택 */}
        <section>
          <h2 className="text-xl text-white mb-4">3. 드롭다운 선택</h2>
          <DropdownInput
            label="카드 등급"
            name="grade"
            value={selectedGrade}
            onChange={handleChange}
            options={gradeOptions}
            placeholder="등급을 선택해 주세요"
          />
        </section>

        {/* 4. 여러 줄 텍스트 입력 */}
        <section>
          <h2 className="text-xl text-white mb-4">4. 여러 줄 텍스트 입력</h2>
          <TextboxInput
            label="카드 설명"
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="카드 설명을 입력하세요"
          />
        </section>

        {/* 5. 포인트/토큰 입력 */}
        <section>
          <h2 className="text-xl text-white mb-4">5. 포인트 입력</h2>
          <TokenInput
            initialValue={points}
            onChange={setPoints}
            placeholder="가격을 입력하세요"
            tokenSymbol="P"
          />
        </section>

        {/* 6. 수량 조절 입력 */}
        <section>
          <h2 className="text-xl text-white mb-4">6. 수량 조절 입력</h2>
          <CounterInput
            initialValue={quantity}
            onChange={setQuantity}
            min={1}
            max={100}
            maxText="100개"
            showMaxInfo={true} // maxText가 있어도 표시되지 않음
          />
        </section>

        {/* 7. 파일 업로드 */}
        <section>
          <h2 className="text-xl text-white mb-4">7. 파일 업로드</h2>
          <UploadInput
            label="카드 이미지"
            name="file"
            onChange={handleChange}
            accept="image/*"
          />
        </section>

        {/* 입력값 확인 */}
        <section className="bg-gray500 p-4 rounded-[2px] text-white">
          <h2 className="text-xl mb-2">입력 결과</h2>
          <pre className="text-gray300 text-sm">
            {JSON.stringify(
              {
                텍스트: text,
                검색어: searchQuery,
                등급: selectedGrade,
                설명: description,
                포인트: points,
                수량: quantity,
                파일: file ? file.name : null,
              },
              null,
              2
            )}
          </pre>
        </section>
      </div>
    </div>
  );
}
