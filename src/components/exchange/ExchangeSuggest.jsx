import React from 'react';
import ExchangeCard from './ExchangeCard';

export default function ExchangeSuggest({proposals = [], isLoading, error}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">로딩중..</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-5">
        교환 제안 목록을 불러오는 중 오류가 발생했습니다: {error}
      </div>
    );
  }

  if (!proposals || proposals.length === 0) {
    return (
      <div className="text-center text-white py-10">
        아직 교환 제안이 없습니다.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1480px] mx-auto px-4 py-8">
      <h2 className="text-white text-xl font-bold mb-6">교환 제안 목록</h2>
      <div className="grid grid-cols-1 tablet:grid-cols-2 pc:grid-cols-3 gap-6">
        {proposals.map(proposal => (
          <ExchangeCard key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}
