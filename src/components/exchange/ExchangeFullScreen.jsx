'use client';

import {useState, useEffect} from 'react';
import FullScreenModal from '@/components/modal/layout/FullScreenModal';
import CardOverview from '@/components/ui/card/cardOverview/CardOverview';
import Button from '@/components/common/Button';
import { postExchangeProposal } from '@/lib/api/exchange';

export default function ExchangeFullScreen({
  card,
  onClose,
  targetCardId,
  shopListingId,  // 판매글 ID
  onSelect
}) {
  const [exchangeNote, setExchangeNote] = useState('');
  const [actualTargetCardId, setActualTargetCardId] = useState(null);

  useEffect(() => {
    console.log('ExchangeFullScreen에 전달된 카드 데이터:', card);
    console.log('전달받은 targetCardId:', targetCardId);
    console.log('전달받은 shopListingId:', shopListingId);
    
    // targetCardId가 실제 판매중인 카드 ID인지 확인
    if (targetCardId >= 282 && targetCardId <= 286) {
      setActualTargetCardId(targetCardId);
    } else {
      // 기본값으로 첫 번째 판매 카드 ID 사용
      setActualTargetCardId(282);
      console.log('유효하지 않은 targetCardId. 기본값 282로 설정됨');
    }
  }, [targetCardId, shopListingId]);

  const handleExchange = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    const requestCardId = card?.userCardId;

    if (!requestCardId || !actualTargetCardId || !shopListingId) {
      console.error('카드 정보 누락:', { requestCardId, actualTargetCardId, shopListingId });
      alert('카드 정보가 부족합니다.');
      return;
    }

    try {
      // 교환 요청 데이터 준비
      const exchangeData = {
        targetCardId: actualTargetCardId,  // 수정된 부분: actualTargetCardId 사용
        requestCardId,
        shopListingId,
        description: exchangeNote,
        accessToken
      };
      
      console.log('교환 요청 데이터:', exchangeData);
      
      // 교환 요청 API 호출
      const response = await postExchangeProposal(exchangeData);
      
      if (response.success) {
        alert('교환 요청이 완료되었습니다.');
        onClose?.();
      } else {
        throw new Error(response.message || '교환 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 교환 제안 실패:', error);
      alert(error.message || '교환 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <FullScreenModal onClose={onClose} title="포토카드 교환하기">
      <div className="text-white">
        <div className="flex justify-center mb-6">
          <div className="w-[342px] tablet:w-[342px] pc:w-[440px]">
            <CardOverview 
              card={{
                ...card,
                type: 'exchange_big'
              }} 
            />
          </div>
        </div>
        <label className="block text-sm font-bold mb-2">교환 제시 내용</label>
        <textarea
          value={exchangeNote}
          onChange={e => setExchangeNote(e.target.value)}
          className="w-full h-[140px] pc:h-[180px] px-5 py-3 border rounded-md bg-black text-white placeholder:text-gray-400 resize-none"
          placeholder="내용을 입력해주세요"
        />
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소하기
          </Button>
          <Button
            className="flex-1 bg-yellow-300 text-black font-bold"
            onClick={handleExchange}
          >
            교환하기
          </Button>
        </div>
      </div>
    </FullScreenModal>
  );
}
