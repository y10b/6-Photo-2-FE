'use client';

import {useState} from 'react';
import FullScreenModal from '@/components/modal/layout/FullScreenModal';
import CardOverview from '@/components/ui/card/cardOverview/CardOverview';
import Button from '@/components/common/Button';

export default function ExchangeFullScreen({card, onClose, targetCardId}) {
  const [exchangeNote, setExchangeNote] = useState('');

  const handleExchange = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            targetCardId,
            requestCardId: card.userCardId,
            description: exchangeNote,
          }),
        },
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || '교환 제안 중 오류 발생');

      alert('교환 제안이 성공적으로 전송되었습니다!');
      onClose();
    } catch (err) {
      alert(err.message);
      console.error(err);
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
