'use client';

import {useState} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import Image from 'next/image';
import Button from './Button';

export default function PointDrawModal() {
  const {closeModal} = useModal();
  const [isDrawn, setIsDrawn] = useState(false);
  const [point, setPoint] = useState(null);

  const handleDraw = () => {
    const randomPoint = Math.floor(Math.random() * 91) + 10;
    setTimeout(() => {
      setPoint(randomPoint);
      setIsDrawn(true);
    }, 1000);
  };

  return (
    <div className="w-full px-4 pb-8 text-center font-noto">
      {!isDrawn ? (
        <>
          {/* 제목 */}
          <div className='relative w-[126px] h-[31px]'>
          <Image
            src={`/images/random_point_font.png`}
            className="fill"
          />
          </div>
          <div className="w-[100px] h-[4px] mx-auto bg-blue mb-6" />

          {/* 설명 */}
          <p className="text-white text-[16px] font-[400] whitespace-pre-wrap mb-4">
            1시간마다 돌아오는 기회!
            <br />
            랜덤 상자 뽑기를 통해 포인트를 획득하세요!
          </p>

          {/* 쿨타임 (가짜 값) */}
          <p className="text-gray300 text-[14px] font-[300] mb-6">
            다음 기회까지 남은 시간{' '}
            <span className="text-main font-[500]">59분 59초</span>
          </p>

          {/* 상자 3개 */}
          <div className="flex justify-center gap-6 mb-4">
            {['1', '2', '3'].map((color, index) => (
              <button key={color} onClick={handleDraw}>
                <Image
                  src={`/images/box${color}.svg`} // 예: public/images/boxes/box_blue.png
                  alt={`랜덤박스-${color}`}
                  width={120}
                  height={120}
                  className="hover:scale-110 transition-transform duration-200"
                />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-[24px] font-bold text-white mb-6">
            🎉 축하합니다!
          </h2>
          <p className="text-[20px] text-main font-extrabold mb-4">
            총 {point}P를 획득하셨습니다!
          </p>
          <Button role="modal" onClick={closeModal}>
            닫기
          </Button>
        </>
      )}
    </div>
  );
}
