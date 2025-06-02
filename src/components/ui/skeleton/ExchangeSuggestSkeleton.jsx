import SkeletonBox from './SkeletonBox';

export default function ExchangeSuggestSkeleton() {
  return (
    <div>
      <div className="mt-30 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <SkeletonBox className="h-[40px] w-[200px] mb-2 rounded-md" />
        <SkeletonBox className="h-[2px] w-full bg-gray-700 rounded" />
      </div>
    </div>
  );
}
