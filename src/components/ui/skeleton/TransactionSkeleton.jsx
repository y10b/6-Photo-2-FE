import SkeletonBox from './SkeletonBox';
import CardProfileSkeleton from './CardProfileSkeleton';

export default function TransactionSection({type}) {
  return (
    <div className="mx-auto w-[345px] tablet:w-[704px] pc:w-[1480px]">
      {/* 헤더 */}
      <div className="mt-5 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <SkeletonBox className="h-[40px] w-[200px] mb-2 rounded-md" />
        <SkeletonBox className="h-[2px] w-full bg-gray-700 rounded" />
      </div>

      {/* 본문 */}
      <div className="flex flex-col tablet:flex-row gap-5 pc:gap-20 mb-30">
        {/* 이미지 영역 */}
        <SkeletonBox className="w-[345px] tablet:w-[342px] pc:w-240 h-[258.75px] tablet:h-[256.5px] pc:h-180" />

        {/* 오른쪽 정보 영역 */}
        <div className="w-full tablet:flex-1">
          <CardProfileSkeleton type={type} />
        </div>
      </div>
    </div>
  );
}
