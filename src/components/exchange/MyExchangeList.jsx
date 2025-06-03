'use client';

import { useState, useEffect } from 'react';
import { useModal } from '@/components/modal/ModalContext';
import { getMyExchangeProposals, cancelExchangeProposal } from '@/lib/api/exchange';
import ExchangeCard from './ExchangeCard';

export default function MyExchangeList() {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openModal } = useModal();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setIsLoading(true);
      const data = await getMyExchangeProposals();
      setProposals(data);
    } catch (error) {
      console.error('교환 제안 목록 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (proposalId, newStatus) => {
    setProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === proposalId
          ? { ...proposal, status: newStatus }
          : proposal
      )
    );
  };

  const handleCancel = async (proposalId) => {
    openModal({
      type: 'alert',
      title: '교환 제안 취소',
      description: '이 교환 제안을 취소하시겠습니까?',
      button: {
        label: '취소하기',
        onClick: async () => {
          try {
            await cancelExchangeProposal(proposalId);
            handleStatusChange(proposalId, 'CANCELLED');
            openModal({
              type: 'success',
              title: '교환 제안 취소 완료',
              description: '교환 제안이 취소되었습니다.',
            });
          } catch (error) {
            openModal({
              type: 'fail',
              title: '교환 제안 취소 실패',
              description: error.message || '교환 제안 취소 중 오류가 발생했습니다.',
            });
          }
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        교환 제안 목록을 불러오는 중...
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        교환 제안 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <ExchangeCard
          key={proposal.id}
          proposal={proposal}
          onStatusChange={handleStatusChange}
          onCancel={handleCancel}
        />
      ))}
    </div>
  );
} 