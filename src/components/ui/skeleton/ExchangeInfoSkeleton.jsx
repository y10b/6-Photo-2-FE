import SkeletonBox from './SkeletonBox';

export default function ExchangeInfoSkeleton() {
  return (
    <div>
      <div className="mt-30 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <SkeletonBox className="h-[40px] w-[200px] mb-2 rounded-md" />
        <SkeletonBox className="h-[2px] w-full bg-gray-700 rounded" />
      </div>
      <SkeletonBox className="h-[40px] w-full rounded-md" />
      <SkeletonBox className="h-[1px] w-full bg-gray-700 rounded" />
      <div className="mt-5 gap-5 flex justify-start">
        <SkeletonBox className="h-[28px] w-[10%] rounded-md" />
        <SkeletonBox className="h-[28px] w-[10%] rounded-md" />
      </div>
      <SkeletonBox className="mt-10 h-[55px] w-full rounded-md" />
    </div>
  );
}
