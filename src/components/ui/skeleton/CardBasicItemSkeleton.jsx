import SkeletonBox from './SkeletonBox';

export default function CardBasicItemSkeleton() {
  return (
    <div className="text-white bg-transparent">
      <div className="flex items-center justify-between mb-6">
        <SkeletonBox className="w-[140px] h-[28px] pc:w-[180px] pc:h-[32px]" />
        <SkeletonBox className="w-[100px] h-[28px] pc:w-[140px] pc:h-[32px]" />
      </div>
      <SkeletonBox className="w-full h-[60px] mb-6" />
      <SkeletonBox className="w-full h-[20px] mb-4" />
      <SkeletonBox className="w-full h-[20px]" />
    </div>
  );
}
