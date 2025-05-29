'use client';

import Button from '@/components/common/Button';
import {useModal} from '@/components/modal/ModalContext';
import ExchangeModal from './ExchangeModal';

export default function ExchangeInfoSection({info}) {
  const {targetCardId, description, grade, genre, myCards} = info;
  const {openModal} = useModal();

  const handleOpenModal = () => {
    openModal({
      type: 'responsive',
      variant: 'bottom',
      children: (
        <ExchangeModal
          myCards={myCards}
          targetCardId={targetCardId}
          onSelect={async (requestCardId, offerDescription) => {
            try {
              const accessToken = localStorage.getItem('accessToken');
              if (!accessToken) {
                alert('로그인이 필요합니다.');
                return;
              }

              console.log('📤 선택한 카드 ID:', requestCardId);
              console.log('📝 입력한 제시 내용:', offerDescription);
              console.log('📦 교환 요청 보낼 데이터:', {
                targetCardId,
                requestCardId,
                description: offerDescription,
              });

              const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({
                    targetCardId,
                    requestCardId,
                    description: offerDescription,
                  }),
                },
              );

              const resultText = await response.text();
              let result = {};
              try {
                result = JSON.parse(resultText);
              } catch (e) {
                console.error('응답 JSON 파싱 실패:', resultText);
              }

              if (!response.ok) {
                console.error('❌ 교환 실패 응답:', result);
                throw new Error(
                  result?.message || '교환 제안 중 오류가 발생했습니다.',
                );
              }

              alert('교환 제안이 성공적으로 전송되었습니다!');
            } catch (error) {
              console.error('❌ 교환 제안 실패:', error);
              alert(error.message || '교환 제안 중 오류가 발생했습니다.');
            }
          }}
        />
      ),
    });
  };

  return (
    <section className="mt-10 pt-5 mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      <h3 className="text-white text-[24px] font-bold mb-2">교환 희망 정보</h3>
      <hr className="border-t border-gray200 mb-5" />
      <p className="text-white font-bold text-[18px] mb-5 whitespace-pre-wrap">
        {description}
      </p>
      <div className="flex items-center gap-2 mb-10">
        <span className={`font-bold text-sm text-blue`}>{grade}</span>
        <span className="text-gray400">|</span>
        <span className="text-gray300 text-sm">{genre}</span>
      </div>
      <Button role="exchange-confirm" onClick={handleOpenModal}>
        포토카드 교환하기
      </Button>
    </section>
  );
}
