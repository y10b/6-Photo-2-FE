import { tokenFetch } from '../fetchClient';

const BASE_URL = 'http://localhost:5005';

/**
 * 교환 제안 목록 조회
 * @param {number} shopId - 판매 게시글 ID
 * @returns {Promise<Object>} 교환 제안 목록
 */
export const fetchExchangeProposals = async (shopId) => {
  try {
    const data = await tokenFetch(`/api/exchange/${shopId}`);
    return data;
  } catch (error) {
    console.error('교환 제안 목록 조회 실패:', error);
    throw new Error(error.message || '교환 제안 목록을 가져오는데 실패했습니다.');
  }
};

/**
 * 교환 제안 생성
 * @param {Object} proposalData - 교환 제안 데이터
 * @param {number} proposalData.targetCardId - 교환 대상 카드 ID
 * @param {number} proposalData.requestCardId - 교환 요청 카드 ID
 * @param {number} proposalData.shopListingId - 판매 게시글 ID
 * @param {string} proposalData.description - 교환 설명
 * @returns {Promise<Object>} 생성된 교환 제안
 */
export const createExchangeProposal = async (proposalData) => {
  try {
    const data = await tokenFetch('/api/exchange', {
      method: 'POST',
      body: JSON.stringify(proposalData),
    });
    return data;
  } catch (error) {
    console.error('교환 제안 생성 실패:', error);
    throw new Error(error.message || '교환 제안을 생성할 수 없습니다.');
  }
};

/**
 * 교환 제안 수락
 * @param {number} proposalId - 교환 제안 ID
 * @returns {Promise<Object>} 처리 결과
 */
export const acceptExchangeProposal = async (proposalId) => {
  try {
    const data = await tokenFetch(`/api/exchange/${proposalId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });
    return data;
  } catch (error) {
    console.error('교환 제안 수락 실패:', error);
    throw new Error(error.message || '교환 제안을 수락할 수 없습니다.');
  }
};

/**
 * 교환 제안 거절
 * @param {number} proposalId - 교환 제안 ID
 * @returns {Promise<Object>} 처리 결과
 */
export const rejectExchangeProposal = async (proposalId) => {
  try {
    const data = await tokenFetch(`/api/exchange/${proposalId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'REJECTED' }),
    });
    return data;
  } catch (error) {
    console.error('교환 제안 거절 실패:', error);
    throw new Error(error.message || '교환 제안을 거절할 수 없습니다.');
  }
};

/**
 * 교환 제안 취소
 * @param {number} proposalId - 교환 제안 ID
 * @returns {Promise<Object>} 처리 결과
 */
export const cancelExchangeProposal = async (proposalId) => {
  try {
    const data = await tokenFetch(`/api/exchange/${proposalId}/cancel`, {
      method: 'POST',
    });
    return data;
  } catch (error) {
    console.error('교환 제안 취소 실패:', error);
    throw new Error(error.message || '교환 제안을 취소할 수 없습니다.');
  }
};

/**
 * 내 교환 제안 목록 조회
 * @returns {Promise<Object>} 내 교환 제안 목록
 */
export const getMyExchangeProposals = async () => {
  try {
    const data = await tokenFetch('/api/exchange/my-proposals');
    return data;
  } catch (error) {
    console.error('내 교환 제안 목록 조회 실패:', error);
    throw new Error(error.message || '내 교환 제안 목록을 가져오는데 실패했습니다.');
  }
}; 