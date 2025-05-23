import Button from '@/components/common/Button';
import CounterInput from '@/components/ui/input/CounterInput';
import {useModal} from '@/components/modal/ModalContext';
import { postPurchase } from '@/lib/api/purchase';

const BuyerCardItem = ({card, quantity = 0, onQuantityChange}) => {
  const {openModal} = useModal();

  const totalPrice = card.price * quantity;

  const handleQuantityChange = newValue => {
    onQuantityChange(card.grade, newValue);
  };

  const handlePurchaseCheck = () => {
    openModal({
      type: 'alert',
      title: '포토카드 구매',
      description: `[${card.grade} | ${card.name}] ${quantity}장을 구매하시겠습니까?`,
      button: {
        label: '구매하기',
        onClick: async () => {
          try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
              alert('로그인이 필요합니다.');
              return;
            }
  
            const response = await postPurchase({
              shopId:card.id,
              quantity,
              accessToken,
            });
  
            alert(response.message || '구매에 성공했습니다!');
            // TODO: 구매 후 상태 업데이트 (예: 잔여 수량 등)
          } catch (error) {
            console.error('구매 실패:', error);
            alert(error.message || '구매에 실패했습니다.');
          }
        },
      },
    });
  };

  const ResponsiveButton = () => (
    <>
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
    </>
  );

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

      <ResponsiveButton />
    </div>
  );
};

export default BuyerCardItem;
