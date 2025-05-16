import Button from "../../Button";

const BuyerCardItem = ({ card, quantity, onQuantityChange }) => {
  const totalPrice = card.price * (quantity || 0);

  return (
    <div>
      <hr className="border-gray400 my-[30px]" />
      <div className="mb-5 flex justify-between items-center">
        <span className="font-normal text-[18px] pc:text-xl">구매수량</span>
        <div className="bg-black border border-gray200 w-[144px] pc:w-[150px] h-[45px] pc:h-[50px] px-3 py-[10px]">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange(card.cardGrade, e.target.value)}
            className="w-full h-full bg-black text-white text-center outline-none"
          />
        </div>
      </div>
      <div className="mb-10 flex justify-between items-center">
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
        <Button role="product" size="sm" font="bigger" onClick={() => {}}>
          포토카드 구매하기
        </Button>
      </div>
      <div className="hidden pc:block">
        <Button role="product" size="lg" font="strong" onClick={() => {}}>
          포토카드 구매하기
        </Button>
      </div>
    </div>
  );
};

export default BuyerCardItem;
