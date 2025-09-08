'use client';

import React from 'react';
import CardList from '@/components/ui/card/cardOverview/CardList';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {
  acceptExchangeProposal,
  rejectExchangeProposal,
} from '@/lib/api/exchange';
import {toast} from 'react-hot-toast';

export default function ExchangeSuggest({proposals = [], isLoading, error}) {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: acceptExchangeProposal,
    onSuccess: data => {
      // 교환 제안 목록 갱신
      queryClient.invalidateQueries(['exchangeProposals']);

      // 판매글 상세 정보 갱신 (remainingQuantity 업데이트)
      queryClient.invalidateQueries(['shopDetail']);

      toast.success('교환 제안이 수락되었습니다.');

      // 남은 수량이 0이면 추가 메시지 표시
      if (data?.data?.remainingQuantity === 0) {
        toast.info('모든 카드가 교환되었습니다.');
      }
    },
    onError: error => {
      toast.error(error.message || '교환 제안 수락에 실패했습니다.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectExchangeProposal,
    onSuccess: () => {
      queryClient.invalidateQueries(['exchangeProposals']);
      toast.success('교환 제안이 거절되었습니다.');
    },
    onError: error => {
      toast.error(error.message || '교환 제안 거절에 실패했습니다.');
    },
  });

  const handleAccept = proposalId => {
    acceptMutation.mutate(proposalId);
  };

  const handleReject = proposalId => {
    rejectMutation.mutate(proposalId);
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러가 발생했습니다: {error.message}</div>;
  if (!proposals.length)
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">교환 제안이 없습니다.</div>
        <div className="text-sm text-gray-400">
          다른 사용자들이 아직 이 상품에 대해 교환 제안을 보내지 않았습니다.
        </div>
      </div>
    );

  // 백엔드 응답을 CardList/Card 컴포넌트가 이해할 수 있는 형식으로 변환
  const mappedCards = proposals.map(proposal => {
    return {
      userCardId: proposal.requestCard.id,
      type: 'exchange_btn2',
      title: proposal.requestCard.photoCard.name,
      imageUrl: proposal.requestCard.photoCard.imageUrl,
      createdAt: proposal.createdAt,
      cardGenre: proposal.requestCard.photoCard.genre,
      cardGrade: proposal.requestCard.photoCard.grade,
      nickname: proposal.userNickname,
      description: proposal.description || '교환 제안 메시지가 없습니다.',
      price: 0, // 교환 제안에서는 가격이 필요 없으므로 0으로 설정
      originalProposal: proposal,
      // 교환 요청 상태 업데이트 핸들러 추가
      onAccept: () => {
        handleAccept(proposal.id);
      },
      onReject: () => {
        handleReject(proposal.id);
      },
    };
  });

  // 카드 클릭 핸들러
  const handleCardClick = card => {};

  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <h2 className="mb-[10px] tablet:mb-5 font-bold text-2xl tablet:text-[32px] pc:text-[40px]">
        교환 제안 목록
      </h2>
      <hr className="mb-[46px] tablet:mb-12 pc:mb-[70px] border-2 border-gray100 " />
      {/* CardList 컴포넌트 사용 */}
      <CardList
        cards={mappedCards}
        className="grid grid-cols-2 tablet:grid-cols-2 pc:grid-cols-3 gap-4 tablet:gap-6"
        onCardClick={handleCardClick}
      />
    </div>
  );
}
