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
    console.log('ExchangeFullScreen에 전달된 카드 데이터:', card);
    console.log('전달받은 targetCardId:', targetCardId);
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

    // 카드 상태 확인
    if (card.status && card.status !== 'IDLE') {
      alert('이미 거래 중이거나 교환할 수 없는 상태의 카드입니다.');
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
      console.log('교환 요청 시작 - 대상 카드 ID:', finalTargetCardId);
      
      // 판매글 정보 조회
      const shopResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/shop/${finalTargetCardId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!shopResponse.ok) {
        const errorData = await shopResponse.json();
        console.error('판매 정보 조회 실패:', errorData);
        throw new Error(errorData.message || '판매 정보를 가져오는데 실패했습니다.');
      }

      const shopData = await shopResponse.json();
      console.log('판매글 정보:', shopData);

      if (!shopData || !shopData.shop) {
        throw new Error('판매 중인 카드가 아닙니다.');
      }

      const shopInfo = shopData.shop;
      console.log('판매글 상세 정보:', shopInfo);

      // 판매글이 교환 가능한 상태인지 확인
      if (shopInfo.listingType !== 'FOR_SALE_AND_TRADE') {
        throw new Error('교환이 불가능한 판매글입니다.');
      }

      // 대상 카드 정보 조회
      const targetCardResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cards/${shopInfo.photoCardId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!targetCardResponse.ok) {
        const errorData = await targetCardResponse.json();
        console.error('대상 카드 조회 실패:', errorData);
        throw new Error(errorData.message || '대상 카드 정보를 가져오는데 실패했습니다.');
      }

      const targetCardData = await targetCardResponse.json();
      console.log('대상 카드 데이터:', targetCardData);

      // 내 카드 상태 확인 (IDLE 상태여야 함)
      if (card.status !== 'IDLE') {
        throw new Error('교환 제안이 가능한 카드가 아닙니다.');
      }

      // 문자열을 숫자로 변환
      const numericRequestCardId = Number(requestCardId);
      const numericTargetCardId = Number(shopInfo.photoCardId);

      console.log('📤 교환 요청 전송:', {
        targetCardId: numericTargetCardId,
        requestCardId: numericRequestCardId,
        description: exchangeNote,
        shopListingId: finalTargetCardId,
        shopInfo,
        myCardStatus: card.status
      });

      // API 함수 사용
      const result = await postExchangeProposal({
        targetCardId: numericTargetCardId,
        requestCardId: numericRequestCardId,
        description: exchangeNote,
        accessToken
      });

      console.log('교환 요청 결과:', result);

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
