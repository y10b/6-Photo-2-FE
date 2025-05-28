import SkeletonBox from './SkeletonBox';

export default function CardImageSkeleton() {
  return (
    <div className="relative w-[150px] tablet:w-[302px] pc:w-90 h-[112px] tablet:h-[226.5px] pc:h-[270px] mb-[10px] tablet:mb-[25.5px] pc:mb-[25px]">
      <SkeletonBox className="w-full h-full rounded-[2px]" />
    </div>
  );
}
