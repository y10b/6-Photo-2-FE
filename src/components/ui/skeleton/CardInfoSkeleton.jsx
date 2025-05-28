import SkeletonBox from './SkeletonBox';

export default function CardInfoSkeleton({type}) {
  const isExchange = type === 'exchange';

  return (
    <div className="mb-[10px] tablet:mb-[25.5px] w-full">
      <SkeletonBox className="h-[20px] tablet:h-[30px] w-3/4 mb-[10px]" />

      <div className="flex justify-between items-center mb-5">
        <SkeletonBox className="w-1/2 h-4 tablet:h-5" />
        <SkeletonBox className="w-[80px] h-4 tablet:h-5" />
      </div>

      <hr className="border-gray400 mb-1 tablet:mb-5" />

      <SkeletonBox className="h-[60px] tablet:h-[80px] w-full mb-[10px] tablet:mb-[20px]" />

      {!isExchange && (
        <>
          <div className="flex justify-between mb-[5px] tablet:mb-[10px]">
            <SkeletonBox className="w-[40px] h-4" />
            <SkeletonBox className="w-[60px] h-4" />
          </div>

          <div className="flex justify-between">
            <SkeletonBox className="w-[40px] h-4" />
            <SkeletonBox className="w-[60px] h-4" />
          </div>

          <SkeletonBox className="hidden tablet:block w-1/2 h-5 mx-auto my-[30px]" />
        </>
      )}
    </div>
  );
}
