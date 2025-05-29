import Button from '@/components/common/Button';
import CounterInput from '@/components/ui/input/CounterInput';
import {useBuyerCardHandlers} from '@/lib/useBuyerCardHandlers';

const BuyerCardItem = ({card, quantity = 0, onQuantityChange, error}) => {
  const {handlePurchaseCheck} = useBuyerCardHandlers(card, quantity);

  const totalPrice = card.price * quantity;

  const handleQuantityChange = newValue => {
    onQuantityChange(card.grade, newValue);
  };

  return (
    <div>
      <hr className="border-gray400 my-[30px]" />

      <div className="mb-5 flex justify-between items-center">
        <span className="font-normal text-[18px] pc:text-xl">구매수량</span>
        <CounterInput
          initialValue={quantity}
          max={card.remainingQuantity}
          showMaxInfo={false}
          onChange={handleQuantityChange}
          width="w-[144px] pc:w-[150px]"
          height="h-[45px] pc:h-[50px]"
        />
      </div>

      <div className="mb-10 pc:mb-20 flex justify-between items-center">
        <span>총 가격</span>
        <div className="flex items-center">
          <span className="font-bold text-xl pc:text-2xl text-white mr-[10px]">
            {totalPrice.toLocaleString()}P
          </span>
          <span className="font-normal text-[18px] pc:text-xl text-gray300">
            ({quantity}장)
          </span>
        </div>
      </div>

      <Button role="product" onClick={handlePurchaseCheck} disabled={!!error}>
        포토카드 구매하기
      </Button>
    </div>
  );
};

export default BuyerCardItem;
