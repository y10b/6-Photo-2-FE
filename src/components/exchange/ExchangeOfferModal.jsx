import React, {useState, useEffect} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import CardList from '@/components/ui/card/cardOverview/CardList';
import Button from '@/components/common/Button';
import {TextboxInput} from '@/components/ui/input';

export default function ExchangeOfferModal({
  card,
  onExchange,
  onCancel,
  onCardClick,
}) {
  const {closeModal, openModal} = useModal();
  const [description, setDescription] = useState('');

  useEffect(() => {
    // 컴포넌트 마운트 시 카드 데이터 로깅
    console.log('=== ExchangeOfferModal 마운트 ===');
    console.log('원본 카드 데이터:', card);
  }, [card]);

  // 카드 데이터 매핑
  const mappedCard = {
    id: card?.photoCard?.id || card?.id,
    title: card?.photoCard?.name || card?.name,
    grade: card?.photoCard?.grade || card?.grade,
    genre: card?.photoCard?.genre || card?.genre,
    imageUrl: card?.photoCard?.imageUrl || card?.imageUrl,
    price: card?.price || 0,
    nickname: card?.shopListing?.seller?.nickname || card?.nickname,
    type: 'exchange_big',
  };

  useEffect(() => {
    // 매핑된 카드 데이터 로깅
    console.log('매핑된 카드 데이터:', mappedCard);
  }, [mappedCard]);

  const handleExchange = () => {
    const exchangeData = {
      cardId: mappedCard.id,
      description,
    };
    console.log('교환 요청 데이터:', exchangeData);
    onExchange(exchangeData);
  };

  const handleCardClick = () => {
    console.log('카드 클릭 이벤트 발생');
    console.log('클릭된 카드 데이터:', mappedCard);

    if (onCardClick) {
      console.log('사용자 정의 onCardClick 실행');
      onCardClick(mappedCard);
    } else {
      console.log('기본 상세 모달 열기');
      openModal({
        type: 'exchange_detail',
        props: {
          card: mappedCard,
          onClose: closeModal,
        },
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 고정된 헤더 부분 */}
      <div className="flex-none px-5 pc:px-10">
        <h3 className="font-bold text-2xl tablet:text-[28px] pc:text-[32px] mb-[10px] tablet:mb-5 pc:mb-7">
          {mappedCard.title}
        </h3>
        <hr className="border-gray100" />
      </div>

      {/* 스크롤되는 컨텐츠 영역 */}
      <div className="flex-grow overflow-y-auto overscroll-contain">
        <div className="h-full py-5 px-5 pc:px-10">
          <div className="h-full tablet:flex tablet:gap-10 tablet:items-start">
            {/* 카드 영역 */}
            <div className="w-full tablet:w-[400px] tablet:flex-none">
              <CardList
                cards={[mappedCard]}
                className="flex justify-center"
                onCardClick={handleCardClick}
              />
            </div>

            {/* 교환 제시 내용 */}
            <div className="mobile:mt-30 tablet:mt-0 tablet:flex-1 flex flex-col">
              <div className="tablet:sticky tablet:top-0 tablet:bg-gray500 tablet:-mx-5 tablet:px-5 tablet:py-3 pc:-mx-10 pc:px-10">
                <p className="font-bold text-2xl tablet:text-[22px] pc:text-[26px]">
                  교환 제시 내용
                </p>
              </div>
              <div className="flex flex-col gap-5 mt-5">
                <TextboxInput
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="교환 제시 내용을 입력해주세요."
                  className="w-full h-[140px] tablet:h-31 pc:h-[125px]"
                  as="textarea"
                />
                {/* 버튼 영역 */}
                <div className="flex justify-between gap-4 mb-[90px] tablet:mb-0">
                  <Button role="exchange" variant="outline" onClick={onCancel}>
                    취소하기
                  </Button>
                  <Button
                    role="exchange"
                    onClick={handleExchange}
                    disabled={!description.trim()}
                  >
                    교환하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
