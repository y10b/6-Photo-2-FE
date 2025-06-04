'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useModal } from '@/components/modal/ModalContext';
import { createExchangeProposal } from '@/lib/api/exchange';
import { formatCardGrade } from '@/utils/formatCardGrade';
import gradeStyles from '@/utils/gradeStyles';

export default function ExchangeModal({ targetCard, onClose }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useModal();

  const handleSubmit = async () => {
    if (!selectedCard) {
      alert('교환할 카드를 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      await createExchangeProposal({
        targetCardId: targetCard.id,
        requestCardId: selectedCard.id,
        shopListingId: targetCard.shopListingId,
        description,
      });

      openModal({
        type: 'success',
        title: '교환 제안 완료',
        description: '교환 제안이 성공적으로 전송되었습니다.',
      });
      onClose?.();
    } catch (error) {
      openModal({
        type: 'fail',
        title: '교환 제안 실패',
        description: error.message || '교환 제안 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">교환 제안</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* 교환 대상 카드 */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">교환 대상 카드</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded">
              <div className="relative w-20 h-20">
                <Image
                  src={targetCard.imageUrl || '/logo.svg'}
                  alt={targetCard.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h4 className="font-medium">{targetCard.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded ${gradeStyles[targetCard.grade]}`}>
                    {formatCardGrade(targetCard.grade)}
                  </span>
                  <span className="text-sm text-gray-500">{targetCard.genre}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 교환할 카드 선택 */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">교환할 카드 선택</h3>
            <div className="grid grid-cols-2 gap-4">
              {targetCard.availableCards?.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`p-4 text-left border rounded-lg transition-colors ${
                    selectedCard?.id === card.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="relative w-full h-32 mb-2">
                    <Image
                      src={card.imageUrl || '/logo.svg'}
                      alt={card.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h4 className="font-medium">{card.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded ${gradeStyles[card.grade]}`}>
                      {formatCardGrade(card.grade)}
                    </span>
                    <span className="text-sm text-gray-500">{card.genre}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 교환 설명 */}
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              교환 설명
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="교환 제안에 대한 설명을 입력해주세요."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedCard}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              교환 제안하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 