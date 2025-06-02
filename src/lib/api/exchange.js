import { tokenFetch } from '@/lib/fetchClient';

const BASE_URL = `http://localhost:5005`;

/**
 * 판매글에 대한 교환 제안 목록 조회
 * GET /api/exchange/:shopId
 */
export const fetchExchangeProposals = async (shopId) => {
  try {
    // 백엔드 API 경로에 맞게 수정
    const url = `${BASE_URL}/api/exchange/${shopId}`;
    console.log('요청 URL:', url);

    // fetch API를 직접 사용하여 테스트
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (!response.ok) {
      console.error('응답 상태:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('교환 제안 목록 조회 실패:', error);
    throw new Error(error.message || '교환 제안 목록을 불러올 수 없습니다');
  }
};

/**
 * 교환 제안 거절
 * @param {string} proposalId - 교환 제안 ID
 * @returns {Promise<Object>} 처리 결과
 */
export const rejectExchangeProposal = async (proposalId) => {
  if (!proposalId) {
    throw new Error('교환 제안 ID가 필요합니다');
  }

  try {
    const data = await tokenFetch(`/api/exchange/${proposalId}/reject`, {
      method: 'POST',
    });
    return data;
  } catch (error) {
    console.error('교환 제안 거절 실패:', error);
    throw new Error(error.message || '교환 제안을 거절할 수 없습니다');
  }
};

/**
 * 교환 제안하기
 * @param {Object} proposalData - 교환 제안 데이터
 * @returns {Promise<Object>} 처리 결과
 */
export const createExchangeProposal = async (proposalData) => {
  if (!proposalData || !proposalData.shopId || !proposalData.cardId) {
    throw new Error('교환 제안에 필요한 데이터가 부족합니다');
  }

  try {
    const data = await tokenFetch('/api/exchange', {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
    return data;
  } catch (error) {
    console.error('교환 제안 생성 실패:', error);
    throw new Error(error.message || '교환 제안을 생성할 수 없습니다');
  }
};
