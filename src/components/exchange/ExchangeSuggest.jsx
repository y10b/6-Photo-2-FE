'use client';

import React from 'react';
import CardList from '@/components/ui/card/cardOverview/CardList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptExchangeProposal, rejectExchangeProposal } from '@/lib/api/exchange';
import { toast } from 'react-hot-toast';

export default function ExchangeSuggest({proposals = [], isLoading, error}) {
  const queryClient = useQueryClient();

  const acceptMutation = useMutation({
    mutationFn: acceptExchangeProposal,
    onSuccess: () => {
      queryClient.invalidateQueries(['exchangeProposals']);
      toast.success('교환 제안이 수락되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message || '교환 제안 수락에 실패했습니다.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectExchangeProposal,
    onSuccess: () => {
      queryClient.invalidateQueries(['exchangeProposals']);
      toast.success('교환 제안이 거절되었습니다.');
    },
    onError: (error) => {
      toast.error(error.message || '교환 제안 거절에 실패했습니다.');
    },
  });

  const handleAccept = (proposalId) => {
    acceptMutation.mutate(proposalId);
  };

  const handleReject = (proposalId) => {
    rejectMutation.mutate(proposalId);
  };

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

  // 백엔드 응답을 CardList/Card 컴포넌트가 이해할 수 있는 형식으로 변환
  const mappedCards = proposals.map(proposal => {
    console.log('교환 제안 데이터:', proposal);
    return {
      userCardId: proposal.id,
      type: 'exchange_btn2',
      title: proposal.name || '카드 이름',
      imageUrl: proposal.imageUrl || '/images/fallback.png',
      createdAt: proposal.createdAt,
      price: proposal.price || 0,
      cardGenre: proposal.genre || '장르',
      cardGrade: proposal.grade || 'COMMON',
      nickname: proposal.userNickname || '사용자',
      description: proposal.description || '교환 제안 메시지가 없습니다.',
      originalProposal: proposal,
      // 교환 요청 상태 업데이트 핸들러 추가
      onAccept: () => {
        console.log('승인 버튼 클릭:', proposal.exchangeId);
        handleAccept(proposal.exchangeId);
      },
      onReject: () => {
        console.log('거절 버튼 클릭:', proposal.exchangeId);
        handleReject(proposal.exchangeId);
      },
    };
  });

  // 카드 클릭 핸들러
  const handleCardClick = card => {
    // 카드 클릭 시 수행할 작업
    console.log('교환 제안 카드 클릭:', card);
    // 여기에 교환 수락/거절 로직 추가 가능
  };

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
