import React from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import {formatCardGrade} from '@/utils/formatCardGrade';
import {useModal} from '@/components/modal/ModalContext';
import {useRouter} from 'next/navigation';

// type 속성 추가
export default function ExchangeCard({proposal, type = 'exchange_btn2'}) {
  const {openModal, closeModal} = useModal();
  const router = useRouter();

  // 데이터가 없는 경우 처리
  if (!proposal) {
    return (
      <div className="bg-gray800 rounded-lg p-4 border border-gray600">
        <p className="text-white text-center">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const handleAccept = async () => {
    openModal({
      type: 'alert',
      title: '교환 제안 수락',
      description: '이 교환 제안을 수락하시겠습니까?',
      button: {
        label: '수락하기',
        onClick: async () => {
          try {
            // 교환 수락 API 호출 로직 추가 필요
            closeModal();
            openModal({
              type: 'success',
              title: '교환 수락 성공',
              description: '교환이 성공적으로 완료되었습니다.',
              button: {
                label: '확인',
                onClick: () => {
                  closeModal();
                  router.refresh();
                },
              },
            });
          } catch (error) {
            closeModal();
            openModal({
              type: 'fail',
              title: '교환 수락 실패',
              description: error.message || '교환 수락 중 오류가 발생했습니다.',
              button: {
                label: '확인',
                onClick: closeModal,
              },
            });
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
            // 교환 거절 API 호출 로직 추가 필요
            closeModal();
            openModal({
              type: 'success',
              title: '교환 거절 완료',
              description: '교환 제안이 거절되었습니다.',
              button: {
                label: '확인',
                onClick: () => {
                  closeModal();
                  router.refresh();
                },
              },
            });
          } catch (error) {
            closeModal();
            openModal({
              type: 'fail',
              title: '교환 거절 실패',
              description: error.message || '교환 거절 중 오류가 발생했습니다.',
              button: {
                label: '확인',
                onClick: closeModal,
              },
            });
          }
        },
      },
    });
  };

  // 백엔드 응답 구조에 맞게 데이터 접근
  const createdAt = proposal.createdAt
    ? new Date(proposal.createdAt).toLocaleDateString()
    : '';
  const description = proposal.description || '교환 제안 메시지가 없습니다.';

  // CardOverview 형식으로 변환된 객체 생성 (type 속성 포함)
  const cardData = {
    type,
    title: proposal.name || '카드 이름',
    cardGrade: proposal.grade || 'COMMON',
    cardGenre: proposal.genre || '장르',
    nickname: proposal.userNickname || '사용자',
    imageUrl: proposal.imageUrl || '',
    createdAt: proposal.createdAt,
    description,
    id: proposal.id,
    // 원본 proposal 데이터도 포함
    originalProposal: proposal,
  };

  return (
    <div className="bg-gray800 rounded-lg p-4 border border-gray600">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray600 overflow-hidden mr-3">
          {/* 프로필 이미지는 없을 수 있음 */}
        </div>
        <div>
          <p className="text-white font-medium">
            {proposal.userNickname || '사용자'}
          </p>
          <p className="text-gray400 text-sm">{createdAt}</p>
        </div>
      </div>

      <div className="flex mb-4">
        <div className="w-24 h-32 bg-gray700 rounded-md overflow-hidden mr-4">
          {proposal.imageUrl && (
            <Image
              src={proposal.imageUrl}
              alt="카드 이미지"
              width={96}
              height={128}
              className="object-cover w-full h-full"
            />
          )}
        </div>
        <div className="flex-1">
          <p className="text-white font-medium mb-1">
            {proposal.name || '카드 이름'}
          </p>
          <p
            className={`text-sm mb-1 ${
              proposal.grade === 'COMMON'
                ? 'text-main'
                : proposal.grade === 'RARE'
                ? 'text-blue'
                : proposal.grade === 'SUPER_RARE'
                ? 'text-purple'
                : 'text-pink'
            }`}
          >
            {formatCardGrade(proposal.grade || 'COMMON')}
          </p>
          <p className="text-gray300 text-sm">{proposal.genre || '장르'}</p>
        </div>
      </div>

      <p className="text-white text-sm mb-4">{description}</p>

      <div className="flex space-x-2">
        <Button onClick={handleAccept} className="flex-1 py-2">
          수락
        </Button>
        <Button
          onClick={handleReject}
          variant="outline"
          className="flex-1 py-2"
        >
          거절
        </Button>
      </div>
    </div>
  );
}
