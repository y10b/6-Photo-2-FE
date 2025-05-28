import SkeletonBox from './SkeletonBox';

export default function BuyerCardItemSkeleton() {
  return (
    <div>
      <hr className="border-gray400 my-[30px]" />
      <div className="mb-5 flex justify-between items-center">
        <SkeletonBox className="w-[100px] h-[24px]" />
        <SkeletonBox className="w-[144px] h-[45px] pc:w-[150px] pc:h-[50px]" />
      </div>
      <div className="mb-10 pc:mb-20 flex justify-between items-center">
        <SkeletonBox className="w-[120px] h-[24px]" />
        <SkeletonBox className="w-[100px] h-[28px]" />
      </div>
      <SkeletonBox className="w-full h-[50px] rounded" />
    </div>
  );
}
