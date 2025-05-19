import Button from "@/components/common/Button";
import CounterInput from "@/components/ui/input/CounterInput";

const BuyerCardItem = ({ card, quantity, onQuantityChange }) => {
  const totalPrice = card.price * (quantity || 0);

  const handleQuantityChange = (newValue) => {
    onQuantityChange(card.cardGrade, newValue);
  };

  return (
    <div>
      <hr className="border-gray400 my-[30px]" />
      <div className="mb-5 flex justify-between items-center">
        <span className="font-normal text-[18px] pc:text-xl">구매수량</span>
        <CounterInput
          initialValue={quantity || 1}
          max={card.quantityLeft}
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
            {totalPrice}P
          </span>
          <span className="font-normal text-[18px] pc:text-xl text-gray300">
            ({quantity || 0}장)
          </span>
        </div>
      </div>
      <div className="block pc:hidden">
        <Button role="product" onClick={() => {}}>
          포토카드 구매하기
        </Button>
      </div>
      <div className="hidden pc:block">
        <Button role="product" onClick={() => {}}>
          포토카드 구매하기
        </Button>
      </div>
    </div>
  );
};

export default BuyerCardItem;
