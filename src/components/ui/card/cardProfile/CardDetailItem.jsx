import Link from "next/link";

const CardDetailItem = ({ card, quantity, onQuantityChange }) => {
  const gradeStyles = {
    COMMON: "text-main",
    RARE: "text-blue",
    SUPER_RARE: "text-purple",
    LEGENDARY: "text-pink",
  };

  const handleInputChange = (value) => {
    let val = parseInt(value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > card.initialQuantity) val = card.initialQuantity;
    onQuantityChange(card.grade, val);
  };

  return (
    <div className="text-white bg-transparent">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[10px] font-bold text-[18px] pc:text-2xl">
          <p className={gradeStyles[card.grade]}>{card.grade}</p>
          <div className="text-gray400">|</div>
          <p>{card.genre}</p>
        </div>
        <Link href="/" className="underline">
          <p className="font-bold text-[18px] pc:text-2xl">
            {card.sellerNickname}
          </p>
        </Link>
      </div>
      <hr className="my-[30px] text-gray400" />
      <div className="mb-[10px] flex justify-between items-center">
        <span className="font-normal text-[18px] pc:text-xl text-gray300">
          총 판매 수량
        </span>
        <div className="flex justify-between items-center">
          <input
            type="number"
            min={1}
            max={card.initialQuantity}
            value={quantity}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-[144px] pc:w-[176px] h-[45px] pc:h-[50px] text-center bg-black text-white p-1 border border-gray200 rounded"
          />
          <div className="flex flex-col items-start text-gray300 ml-[15px] pc:ml-5">
            <span className="font-bold text-[18px] pc:text-xl text-white">
              /{card.initialQuantity}
            </span>
            <span className="font-light text-[12px] pc:text-sm text-gray200">
              최대 {card.initialQuantity}장
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-between text-gray300">
        <span className="py-[9.5px] font-normal text-[18px] pc:text-xl">
          장당 가격
        </span>
        <div className="relative w-[202px] pc:w-[245px]">
          <input
            type="number"
            className="w-full h-[45px] pc:h-[50px] border rounded-[2px] pr-6"
          />
          <span className="absolute top-1/2 right-3 -translate-y-1/2 font-bold text-[18px] pc:text-xl text-white pointer-events-none">
            P
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardDetailItem;
