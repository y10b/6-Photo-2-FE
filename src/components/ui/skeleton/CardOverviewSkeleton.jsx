import CardImageSkeleton from './CardImageSkeleton';
import CardInfoSkeleton from './CardInfoSkeleton';
import SkeletonBox from './SkeletonBox';

export default function CardOverviewSkeleton({type}) {
  const isExchange = type === 'exchange';

  return (
    <div className="font-noto text-[10px] tablet:text-base text-white w-[170px] tablet:w-[342px] pc:w-110 rounded-[2px] bg-gray500 px-[10px] tablet:px-5 pc:px-10 pt-[10px] tablet:pt-5 pc:pt-10 border border-white/10">
      <CardImageSkeleton />
      <CardInfoSkeleton type={type} />
      {isExchange && (
        <>
          {/* 모바일 */}
          <div className="block tablet:hidden pc:hidden mb-[10px]">
            <div className="flex gap-[5px]">
              <SkeletonBox className="w-1/2 h-8 rounded-md" />
              <SkeletonBox className="w-1/2 h-8 rounded-md" />
            </div>
          </div>

          {/* 태블릿, PC */}
          <div className="hidden tablet:block pc:block tablet:mb-[25px] pc:mb-10">
            <div className="flex gap-5">
              <SkeletonBox className="w-full h-10 rounded-md" />
              <SkeletonBox className="w-full h-10 rounded-md" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
