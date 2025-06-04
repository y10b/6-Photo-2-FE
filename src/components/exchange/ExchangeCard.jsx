'use client';

import {useState} from 'react';
import Image from 'next/image';
import {useModal} from '@/components/modal/ModalContext';
import {
  acceptExchangeProposal,
  rejectExchangeProposal,
} from '@/lib/api/exchange';
import {formatCardGrade} from '@/utils/formatCardGrade';
import gradeStyles from '@/utils/gradeStyles';

export default function ExchangeCard({proposal, onStatusChange}) {
  const [isLoading, setIsLoading] = useState(false);
  const {openModal} = useModal();

  const handleAccept = async () => {
    openModal({
      type: 'alert',
      title: '교환 제안 수락',
      description: '이 교환 제안을 수락하시겠습니까?',
      button: {
        label: '수락하기',
        onClick: async () => {
          try {
            setIsLoading(true);

            await acceptExchangeProposal(proposal.id);

            onStatusChange?.(proposal.id, 'ACCEPTED');

            openModal({
              type: 'success',
              title: '교환 수락 완료',
              description: '교환이 성공적으로 완료되었습니다.',
            });
          } catch (error) {
            console.error('[교환 승인 실패]', error);
            openModal({
              type: 'fail',
              title: '교환 수락 실패',
              description: error.message || '교환 수락 중 오류가 발생했습니다.',
            });
          } finally {
            setIsLoading(false);
          }
        },
      },
    });
  };

  const handleReject = async () => {
    openModal({
      type: 'alert',
      title: '교환 제안 거절',
      description: '이 교환 제안을 거절하시겠습니까?',
      button: {
        label: '거절하기',
        onClick: async () => {
          try {
            setIsLoading(true);
            await rejectExchangeProposal(proposal.id);
            onStatusChange?.(proposal.id, 'REJECTED');
            openModal({
              type: 'success',
              title: '교환 거절 완료',
              description: '교환 제안이 거절되었습니다.',
            });
          } catch (error) {
            openModal({
              type: 'fail',
              title: '교환 거절 실패',
              description: error.message || '교환 거절 중 오류가 발생했습니다.',
            });
          } finally {
            setIsLoading(false);
          }
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <Image
            src={proposal.imageUrl || '/logo.svg'}
            alt={proposal.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{proposal.name}</h3>
          <p className="text-sm text-gray-600">{proposal.userNickname}</p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-1 text-xs rounded ${
                gradeStyles[proposal.grade]
              }`}
            >
              {formatCardGrade(proposal.grade)}
            </span>
            <span className="text-sm text-gray-500">{proposal.genre}</span>
          </div>
        </div>
      </div>

      {proposal.description && (
        <p className="text-sm text-gray-600">{proposal.description}</p>
      )}

      {proposal.status === 'REQUESTED' && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleAccept}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            수락하기
          </button>
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            거절하기
          </button>
        </div>
      )}

      {proposal.status === 'ACCEPTED' && (
        <div className="px-4 py-2 text-sm text-center text-green-600 bg-green-50 rounded">
          수락된 교환
        </div>
      )}

      {proposal.status === 'REJECTED' && (
        <div className="px-4 py-2 text-sm text-center text-red-600 bg-red-50 rounded">
          거절된 교환
        </div>
      )}
    </div>
  );
}
