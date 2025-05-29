import CardBasicItemSkeleton from './CardBasicItemSkeleton';
import BuyerCardItemSkeleton from './BuyerCardItemSkeleton';
import CardDetailItemSkeleton from './CardDetailItemSkeleton';
import SellerCardItemSkeleton from './SellerCardItemSkeleton';

export default function CardProfileSkeleton({type, count = 1}) {
  return (
    <div className="w-[345px] tablet:w-[342px] pc:w-[440px]">
      {Array.from({length: count}).map((_, i) => (
        <div key={i}>
          {type === 'card_detail' && <CardDetailItemSkeleton />}
          {type !== 'card_detail' && (
            <>
              <CardBasicItemSkeleton />
              {type === 'buyer' && <BuyerCardItemSkeleton />}
              {type === 'seller' && <SellerCardItemSkeleton />}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
