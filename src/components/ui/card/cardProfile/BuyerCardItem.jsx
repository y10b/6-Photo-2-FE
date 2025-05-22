import Button from '@/components/common/Button';
import CounterInput from '@/components/ui/input/CounterInput';
import {useModal} from '@/context/ModalContext';

const BuyerCardItem = ({card, quantity, onQuantityChange}) => {
  const {openModal} = useModal();

  const totalPrice = card.price * (quantity || 0);

  const handleQuantityChange = newValue => {
    onQuantityChange(card.grade, newValue);
  };

  const handlePurchaseCheck = () => {
    openModal({
      title: '포토카드 구매',
      description: `[${card.grade} | ${card.name}] ${quantity}장을 구매하시겠습니까?`,
      button: {
        label: '구매하기',
        onClick: () => {
          /* api 호출 */
        },
      },
    });
  };

  return (
    <div>
      <hr className="border-gray400 my-[30px]" />
      <div className="mb-5 flex justify-between items-center">
        <span className="font-normal text-[18px] pc:text-xl">구매수량</span>
        <CounterInput
          initialValue={quantity || 1}
          max={card.remainingQuantity}
          showMaxInfo={false}
          onChange={handleQuantityChange}
          width="w-[144px] pc:w-[150px]"
          height="h-[45px] pc:h-[50px]"
        />
      </div>
      <div className="mb-10 pc:mb-20 flex justify-between items-center">
        <span>총 가격</span>
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl pc:text-2xl text-white mr-[10px]">
            {totalPrice.toLocaleString()}P
          </span>
          <span className="font-normal text-[18px] pc:text-xl text-gray300">
            ({quantity || 0}장)
          </span>
        </div>
      </div>
      <div className="block pc:hidden">
        <Button role="product" onClick={handlePurchaseCheck}>
          포토카드 구매하기
        </Button>
      </div>
      <div className="hidden pc:block">
        <Button role="product" onClick={handlePurchaseCheck}>
          포토카드 구매하기
        </Button>
      </div>
    </div>
  );
};

export default BuyerCardItem;
