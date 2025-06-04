'use client';

import Button from '@/components/common/Button';
import {useModal} from '@/components/modal/ModalContext';
import {deleteShop} from '@/lib/api/shop';
import {formatCardGrade} from '@/utils/formatCardGrade';
import Image from 'next/image';
import {useParams, useRouter} from 'next/navigation';
import React, {useState} from 'react';
import EditCardModal from '@/components/market/EditCardModal';

function SellerCardItem({exchangeCard, gradeStyles, card}) {
  const router = useRouter();
  const {openModal, closeModal} = useModal();
  const {id} = useParams();

  const currentCard = card[0];
  const isDisabled = currentCard?.remainingQuantity === 0;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const isExchange = exchangeCard.grade || exchangeCard.genre;

  const handleDelete = async () => {
    openModal({
      type: 'alert',
      title: '포토카드 판매 내리기',
      description: '정말로 판매를 중단하시겠습니까?',
      button: {
        label: '판매 내리기',
        onClick: async () => {
          try {
            await deleteShop(Number(id));
            closeModal();

            openModal({
              type: 'alert',
              title: '판매 포토 카드 삭제 완료',
              description: '판매글이 성공적으로 삭제되었습니다.',
              button: {
                label: '확인',
                onClick: () => {
                  closeModal();
                  router.push('/market');
                },
              },
            });
          } catch (error) {
            closeModal();
            openModal({
              type: 'alert',
              title: '판매 포토 카드 삭제 실패',
              description: '삭제 중 오류가 발생했습니다.',
              button: {
                label: '닫기',
                onClick: closeModal,
              },
            });
          }
        },
      },
    });
  };

  return (
    <div className="mt-[78px]">
      <div className="mb-[10px] flex items-center gap-[10px]">
        <div className="relative w-[22px] h-[22px] pc:w-[24.61px] pc:h-[24.5px]">
          <Image src="/icons/ic_exchange.png" fill alt="exchange" />
        </div>
        <span className="text-[22px] pc:text-[28px] font-bold">
          교환 희망 정보
        </span>
      </div>

      <hr className="mb-[30px] border-2 border-gray200" />

      {/* 카드 정보 */}
      {isExchange ? (
        <>
          <div className="flex items-center gap-[11px] pc:gap-[15px] text-[18px] pc:text-2xl font-bold">
            <p className={gradeStyles[exchangeCard.grade]}>
              {formatCardGrade(exchangeCard.grade)}
            </p>
            <span className="text-gray400">|</span>
            <p className="text-gray300">{exchangeCard.genre}</p>
          </div>

          <hr className="my-[30px] border-t text-gray400" />

          <p className="mb-[54px] text-base pc:text-[18px] font-normal">
            {exchangeCard.description}
          </p>
        </>
      ) : (
        <p className="text-[18px] font-bold mb-[130px]">
          교환 희망을 하지 않습니다.
        </p>
      )}

      {/* 버튼 */}
      <div className="space-y-5">
        <Button
          role="exchange-confirm"
          onClick={() => setIsEditModalOpen(true)}
          disabled={isDisabled}
        >
          수정하기
        </Button>
        <Button
          role="exchange-confirm"
          variant="outline"
          onClick={handleDelete}
          disabled={isDisabled}
        >
          판매 내리기
        </Button>
      </div>

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <EditCardModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}

export default SellerCardItem;
