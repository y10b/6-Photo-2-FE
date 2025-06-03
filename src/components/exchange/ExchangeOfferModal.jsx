import React, {useState} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import CardList from '@/components/ui/card/cardOverview/CardList';
import Button from '@/components/common/Button';
import {TextboxInput} from '@/components/ui/input';

export default function ExchangeOfferModal({card, onExchange, onCancel}) {
  const {closeModal} = useModal();
  const [description, setDescription] = useState('');

  const handleExchange = () => {
    onExchange({
      cardId: card.id,
      description,
    });
  };

  return (
    <div className="w-full h-full flex flex-col tablet:flex-row gap-5">
      <div className="min-w-[375px] max-w-[500px] mx-auto w-full tablet:min-w-0 tablet:max-w-none">
        {/* 카드 정보 */}
        <h3 className="mt-20 mb-[10px] font-bold text-2xl ">{card.title}</h3>
        <hr />
        <div className="w-full tablet:w-1/2">
          <CardList
            cards={[{...card, type: 'exchange_big'}]}
            className="flex justify-center"
            onCardClick={() => {}} // 카드 클릭 이벤트 방지
          />
        </div>

        {/* 교환 제시 내용 */}
        <div className="w-full tablet:w-1/2 flex flex-col gap-5">
          <p className="text-sm">교환 제시 내용</p>
          <TextboxInput
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="교환 제시 내용을 입력해주세요."
            className="w-full h-[200px] tablet:h-[300px]"
            as="textarea"
          />

          {/* 버튼 그룹 */}
          <div className="flex justify-between">
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
  );
}
