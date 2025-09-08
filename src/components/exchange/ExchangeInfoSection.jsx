import React, {useState, useEffect} from 'react';
import Button from '../common/Button';
import gradeStyles from '@/utils/gradeStyles';
import {formatCardGrade} from '@/utils/formatCardGrade';
import {useModal} from '@/components/modal/ModalContext';
import ExchangeConfirmContent from './ExchangeConfirmContent';
import useMediaQuery from '@/hooks/useMediaQuery';
import {
  fetchMyOfferedCardsForShop,
  cancelExchangeRequest,
} from '@/lib/api/exchange';
import CardList from '@/components/ui/card/cardOverview/CardList';

function ExchangeInfoSection({
  exchangeGrade,
  exchangeGenre,
  exchangeDescription,
  onExchangeRequest,
  shopId,
}) {
  const {openModal, closeModal} = useModal();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [myExchangeCards, setMyExchangeCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyExchanges = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken || !shopId) return;

        const response = await fetchMyOfferedCardsForShop(shopId, accessToken);

        if (response?.success && response?.data?.requests) {
          const requests = response.data.requests;
          if (!Array.isArray(requests)) {
            console.error('응답 데이터가 배열이 아닙니다:', requests);
            return;
          }

          // 응답 데이터 형식에 맞게 매핑
          const formattedCards = requests.map(request => ({
            id: request.id,
            type: 'exchange_btn1',
            title: request.requestCard?.photoCard?.name || '카드 이름',
            imageUrl: request.requestCard?.photoCard?.imageUrl || '',
            cardGrade: request.requestCard?.photoCard?.grade || 'COMMON',
            cardGenre: request.requestCard?.photoCard?.genre || '포토카드',
            description: request.description || '',
            status: request.status,
            price: 0,
            nickname: request.requestCard?.user?.nickname || '내 카드',
            buttonText: '취소하기',
            buttonType: 'cancel',
            buttonProps: {
              onClick: () => {
                // 교환 취소 처리
                openModal({
                  type: 'alert',
                  title: '교환 제시 취소',
                  description: `[${formatCardGrade(
                    request.requestCard?.photoCard?.grade,
                  )} | ${
                    request.requestCard?.photoCard?.genre
                  }] 교환 제시를 취소하시겠습니까?`,
                  button: {
                    label: '취소하기',
                    onClick: async () => {
                      try {
                        // 교환 취소 API 호출
                        const accessToken = localStorage.getItem('accessToken');
                        await cancelExchangeRequest(request.id, accessToken);

                        // 목록에서 제거
                        setMyExchangeCards(prev =>
                          prev.filter(c => c.id !== request.id),
                        );

                        openModal({
                          type: 'success',
                          title: '교환 제시 취소 완료',
                          description: '교환 제시가 취소되었습니다.',
                          button: {
                            label: '확인',
                            onClick: closeModal,
                          },
                        });
                      } catch (error) {
                        openModal({
                          type: 'alert',
                          title: '교환 제시 취소 실패',
                          description:
                            error.message ||
                            '교환 제시 취소 중 오류가 발생했습니다.',
                          button: {
                            label: '확인',
                            onClick: closeModal,
                          },
                        });
                      }
                    },
                  },
                });
              },
            },
          }));
          setMyExchangeCards(formattedCards);
        } else {
          console.error('응답 데이터가 올바르지 않습니다:', response);
        }
      } catch (error) {
        console.error('교환 요청 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyExchanges();
  }, [shopId]);

  const handleExchangeConfirm = () => {
    openModal({
      type: 'responsive',
      variant: 'bottom',
      title: '포토카드 교환',
      isDismissible: true,
      isCloseable: true,
      overlayClassName: 'bg-black/50 cursor-pointer',
      modalClassName: 'cursor-default',
      className: {
        mobile:
          'h-[95vh] rounded-t-[20px] touch-pan-y cursor-grab active:cursor-grabbing',
        tablet:
          'h-[95vh] rounded-t-[20px] touch-pan-y cursor-grab active:cursor-grabbing',
        pc: 'max-w-[500px] rounded-[20px]',
      },
      dragToClose: true,
      children: (
        <ExchangeConfirmContent
          shopId={shopId}
          onConfirm={selectedCard => {
            if (onExchangeRequest) {
              onExchangeRequest(selectedCard);
            }
          }}
        />
      ),
    });
  };

  if (!exchangeGrade && !exchangeGenre && !exchangeDescription) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">교환 희망 정보가 없습니다</div>
        <div className="text-sm text-gray-400">
          이 상품은 교환을 원하지 않는 상품입니다.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-[10px] tablet:mb-5 flex items-center justify-between">
        <h3 className="font-bold text-2xl tablet:text-[32px] pc:text-[40px] ">
          교환 희망 정보
        </h3>
        <div className="hidden tablet:block">
          <Button role="exchange-confirm" onClick={handleExchangeConfirm}>
            포토카드 교환하기
          </Button>
        </div>
      </div>
      <hr className="border-2 border-gray100 mb-[46px] tablet:mb-10 pc:mb-12" />
      <div>
        <p
          className={`mb-5 text-[18px] pc:text-2xl ${
            exchangeDescription ? 'font-bold' : 'text-gray300 font-normal'
          }`}
        >
          {exchangeDescription
            ? exchangeDescription
            : '판매자가 희망하는 카드에 대한 설명을 작성하지 않았습니다.'}
        </p>
        <div className="mb-10 tablet:mb-12 pc:mb-45 flex gap-[10px] tablet:gap-[11px] pc:gap-[15px] text-[18px] pc:text-2xl">
          <p className={`${gradeStyles[exchangeGrade]} pb-1 pc:pb-[6px]`}>
            {formatCardGrade(exchangeGrade)}
          </p>
          <p className="text-gray400">|</p>
          <p className="text-gray300">{exchangeGenre}</p>
        </div>
      </div>
      <div className="mb-30 block tablet:hidden">
        <Button role="exchange-confirm" onClick={handleExchangeConfirm}>
          포토카드 교환하기
        </Button>
      </div>

      {/* 내가 제시한 교환 카드 목록 */}
      {myExchangeCards.length > 0 && (
        <div className="mb-10 tablet:mb-12 pc:mb-45">
          <h4 className="font-bold text-2xl tablet:text-[32px] pc:text-[40px] mb-5">
            내가 제시한 교환 목록
          </h4>
          <hr className="mb-[46px] tablet:mb-12 pc:mb-[70px] border-2 border-gray100" />
          <CardList
            cards={myExchangeCards}
            className="grid grid-cols-2 pc:grid-cols-3 gap-4"
            onCardClick={card => {
              openModal({
                type: 'alert',
                title: '교환 제시 취소',
                description: `[${formatCardGrade(card.cardGrade)} | ${
                  card.cardGenre
                }] 교환 제시를 취소하시겠습니까?`,
                button: {
                  label: '취소하기',
                  onClick: async () => {
                    try {
                      // 교환 취소 API 호출
                      const accessToken = localStorage.getItem('accessToken');
                      await cancelExchangeRequest(card.id, accessToken);

                      // 목록에서 제거
                      setMyExchangeCards(prev =>
                        prev.filter(c => c.id !== card.id),
                      );

                      openModal({
                        type: 'success',
                        title: '교환 제시 취소 완료',
                        description: '교환 제시가 취소되었습니다.',
                        button: {
                          label: '확인',
                          onClick: closeModal,
                        },
                      });
                    } catch (error) {
                      openModal({
                        type: 'alert',
                        title: '교환 제시 취소 실패',
                        description:
                          error.message ||
                          '교환 제시 취소 중 오류가 발생했습니다.',
                        button: {
                          label: '확인',
                          onClick: closeModal,
                        },
                      });
                    }
                  },
                },
              });
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ExchangeInfoSection;
