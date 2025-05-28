import ExchangeSuggestSkeleton from './ExchangeSuggestSkeleton';
import SkeletonBox from './SkeletonBox';

export default function SellerCardItemSkeleton() {
  return (
    <div className="mt-[78px]">
      <div className="mb-4 flex items-center gap-2">
        <SkeletonBox className="w-[22px] h-[22px]" />
        <SkeletonBox className="w-[120px] h-[28px]" />
      </div>
      <SkeletonBox className="mb-[30px] h-[2px] w-full bg-gray-700 rounded" />
      <SkeletonBox className="w-[180px] h-[28px] mb-[30px]" />
      <SkeletonBox className="w-full h-[60px] mb-[54px]" />
      <SkeletonBox className="w-full h-[50px] mb-4" />
      <SkeletonBox className="w-full h-[50px]" />
    </div>
  );
}
