'use client';

import {useState} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import Image from 'next/image';
import Button from './Button';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {checkPointCooldown, drawPoint} from '@/api/user.api';

export default function PointDrawModal() {
  const [selectedBox, setSelectedBox] = useState(null);
  const queryClient = useQueryClient();

  const {data: cooldownData} = useQuery({
    queryKey: ['pointCooldown'],
    queryFn: checkPointCooldown,
  });

  const {
    mutate,
    data: drawResult,
    isSuccess,
  } = useMutation({
    mutationFn: drawPoint,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['pointCooldown']});
    },
  });

  if (!cooldownData) return null; // 로딩 메시지 제거

  const handleDraw = () => {
    mutate();
  };

  const isDrawn = isSuccess;
  const point = drawResult?.point;

  return (
    <div className="w-full px-4 pb-8 text-center font-noto">
      {/* 제목 */}
      <h2 className="text-[30px] font-baskin font-[400] text-white mb-7">
        랜덤<span className="text-main">포인트</span>
      </h2>
      {!isDrawn ? (
        <>
          {/* 설명 */}
          <p className="text-white text-[16px] font-bold whitespace-pre-wrap mb-7">
            1시간마다 돌아오는 기회!
            <br />
            랜덤 상자 뽑기를 통해 포인트를 획득하세요!
          </p>

          {/* 쿨타임 (가짜 값) */}
          <p className="text-gray300 text-[14px] font-[400] mb-15 whitespace-pre-wrap">
            다음 기회까지 남은 시간 <br />
            <span className="text-main">
              {cooldownData.canDraw
                ? '지금 뽑을 수 있어요!'
                : `${Math.floor(cooldownData.remainSeconds / 60)}분 ${
                    cooldownData.remainSeconds % 60
                  }초`}
            </span>
          </p>

          {/* 상자 3개 */}
          <div className="flex justify-center gap-6 mb-4">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => {
                  setSelectedBox(num);
                }}
              >
                <div
                  className={`w-[98px] h-[76px] relative transition-opacity duration-200 ${
                    selectedBox === null || selectedBox === num
                      ? 'opacity-100'
                      : 'opacity-40'
                  }`}
                >
                  <Image
                    src={`/images/box${num}.png`}
                    alt={`랜덤박스-${num}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </button>
            ))}
          </div>
          {/* 선택 시에만 나타나는 버튼 */}
          {selectedBox !== null && cooldownData.canDraw && !isDrawn && (
            <div className="mt-15">
              <Button role="random" onClick={handleDraw}>
                선택완료
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-center">
            <div className="w-[240px] h-[229px] relative">
              <Image
                src="/images/point-lg.png"
                alt="포인트 그림"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-[24px] text-main font-bold mb-7">
            {point}P <span className="text-white">획득!</span>
          </p>

          {/* 뽑기 이후 쿨타임 표시 */}
          <p className="text-gray300 text-[14px] font-[400] mb-15 whitespace-pre-wrap">
            다음 기회까지 남은 시간 <br />
            <span className="text-main">
              {cooldownData.remainSeconds > 0
                ? `${Math.floor(cooldownData.remainSeconds / 60)}분 ${
                    cooldownData.remainSeconds % 60
                  }초`
                : '지금 뽑을 수 있어요!'}
            </span>
          </p>
        </>
      )}
    </div>
  );
}
