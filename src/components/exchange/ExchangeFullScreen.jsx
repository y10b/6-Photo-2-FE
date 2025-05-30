'use client';

import {useState, useEffect} from 'react';
import FullScreenModal from '@/components/modal/layout/FullScreenModal';
import CardOverview from '@/components/ui/card/cardOverview/CardOverview';
import Button from '@/components/common/Button';
import { postExchangeProposal } from '@/lib/api/exchange';

export default function ExchangeFullScreen({card, onClose, targetCardId, onSelect}) {
  const [exchangeNote, setExchangeNote] = useState('');
  const [actualTargetCardId, setActualTargetCardId] = useState(null);

  useEffect(() => {
    if (targetCardId) {
      setActualTargetCardId(targetCardId);
      return;
    }

    try {
      const url = new URL(window.location.href);
      const pathSegments = url.pathname.split('/');
      const idFromUrl = pathSegments[pathSegments.length - 1];

      if (idFromUrl && !isNaN(Number(idFromUrl))) {
        console.log('URL에서 추출한 targetCardId:', idFromUrl);
        setActualTargetCardId(Number(idFromUrl));
      } else {
        console.error('URL에서 유효한 targetCardId를 찾을 수 없습니다');
      }
    } catch (err) {
      console.error('URL 파싱 중 오류:', err);
    }
  }, [targetCardId]);

  const handleExchange = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    const requestCardId =
      card?.userCardId ?? card?.id ?? card?.cardId ?? undefined;

    const finalTargetCardId = actualTargetCardId || targetCardId;

    if (!requestCardId || !finalTargetCardId) {
      alert('카드 정보가 부족합니다.');
      console.error('❌ 카드 ID 누락', {
        requestCardId, 
        targetCardId, 
        actualTargetCardId: finalTargetCardId,
        card
      });
      return;
    }

    try {
      // 문자열을 숫자로 변환
      const numericRequestCardId = Number(requestCardId);
      const numericTargetCardId = Number(finalTargetCardId);

      console.log('📤 교환 요청 전송:', {
        targetCardId: numericTargetCardId,
        requestCardId: numericRequestCardId,
        description: exchangeNote
      });

      // API 함수 사용
      const result = await postExchangeProposal({
        targetCardId: numericTargetCardId,
        requestCardId: numericRequestCardId,
        description: exchangeNote,
        accessToken
      });

      alert('교환 제안이 성공적으로 전송되었습니다!');

      // ✅ 선택한 카드 정보를 상위로 전달
      if (onSelect) {
        onSelect(card, exchangeNote);
      }

      onClose();
    } catch (err) {
      alert(err.message || '교환 제안 중 오류가 발생했습니다.');
      console.error('❌ 교환 제안 실패:', err);
    }
  };

  return (
    <FullScreenModal onClose={onClose} title="포토카드 교환하기">
      <div className="text-white">
        <div className="flex justify-center mb-6">
          <CardOverview card={card} />
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
