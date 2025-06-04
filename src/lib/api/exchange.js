import { tokenFetch } from '@/lib/fetchClient';

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
    console.log(`🔄 교환 제안 수락 API 호출: proposalId=${proposalId}`);

    // proposalId가 undefined인 경우 에러 발생
    if (!proposalId) {
      throw new Error('교환 제안 ID가 필요합니다.');
    }

    const numericProposalId = Number(proposalId);
    if (isNaN(numericProposalId)) {
      throw new Error('유효하지 않은 교환 제안 ID입니다.');
    }

    const data = await tokenFetch(`/api/exchange/${numericProposalId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });
    console.log('✅ 교환 제안 수락 응답:', data);
    return data;
  } catch (error) {
    console.error('❌ 교환 제안 수락 실패:', error);
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
 * @param {number} exchangeId - 교환 제안 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} 처리 결과
 */
export async function cancelExchangeRequest(exchangeId, accessToken) {
  try {
    const numericExchangeId = Number(exchangeId);
    console.log(`🔄 교환 취소 API 호출: exchangeId=${numericExchangeId}`);

    const data = await tokenFetch(`/api/exchange/${numericExchangeId}`, {
      method: 'DELETE'
    });

    console.log('✅ 교환 취소 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 교환 요청 취소 실패:', error);
    throw error;
  }
}

/**
 * 내가 보낸 교환 요청 목록을 조회합니다.
 * @returns {Promise<Object>} - 교환 요청 목록 데이터
 */
export const fetchMyExchangeRequests = async () => {
  console.log('🔍 내가 보낸 교환 요청 목록 조회 시작');

  try {
    const data = await tokenFetch('/api/exchange/my-requests');
    console.log('✅ 교환 요청 목록 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 교환 요청 목록 조회 실패:', error);
    return { success: false, data: [] };
  }
};

/**
 * 판매 게시글에 대한 교환 제안 목록을 가져옵니다.
 * @param {number} shopId - 판매 게시글 ID
 * @returns {Promise<Object>} - 교환 제안 목록 데이터
 */
export const fetchShopExchangeRequests = async (shopId) => {
  try {
    console.log(`🔍 판매 게시글 교환 요청 목록 조회 시작: shopId=${shopId}`);
    const data = await tokenFetch(`/api/exchange/shop/${shopId}`);
    console.log('✅ 판매 게시글 교환 요청 목록 조회 결과:', data);
    return data;
  } catch (error) {
    console.error('판매 게시글 교환 요청 목록 조회 오류:', error);
    throw error;
  }
};

/**
 * 특정 판매글에 대해 내가 보낸 교환 요청을 조회합니다.
 * @param {number} shopListingId - 판매글 ID
 * @returns {Promise<Object>} - 교환 요청 목록 데이터
 */
export const fetchMyExchangeRequestsForShop = async (shopListingId) => {
  console.log('🔍 판매글에 대한 내 교환 요청 조회 시작:', { shopListingId });

  try {
    const data = await tokenFetch(`/api/exchange/my?shopListingId=${shopListingId}&status=REQUESTED`);
    console.log('✅ 교환 요청 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 교환 요청 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 판매글에 대해 내가 제시한 교환 카드 목록을 조회합니다.
 * @param {number} shopId - 판매글 ID
 * @returns {Promise<Object>} - 교환 제시 카드 목록 데이터
 */
export const fetchMyOfferedCardsForShop = async (shopId) => {
  console.log('🔍 판매글에 대한 내가 제시한 카드 목록 조회 시작:', { shopId });

  try {
    const data = await tokenFetch(`/api/exchange/my?shopListingId=${shopId}&status=REQUESTED`);
    console.log('✅ 제시 카드 목록 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 제시 카드 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 판매글에 대한 교환 요청을 생성합니다.
 * @param {Object} params - 교환 요청 매개변수
 * @param {number} params.shopId - 판매글 ID
 * @param {number} params.targetCardId - 교환하고자 하는 카드 ID
 * @param {string} params.description - 교환 설명
 * @returns {Promise<Object>} 생성된 교환 요청 데이터
 */
export const createExchangeRequest = async ({
  shopId,
  targetCardId,
  description,
}) => {
  try {
    const data = await tokenFetch(`/api/exchange/${shopId}`, {
      method: 'POST',
      body: JSON.stringify({
        requestCardId: targetCardId,
        description,
      }),
    });
    return data;
  } catch (error) {
    console.error('교환 요청 생성 오류:', error);
    throw error;
  }
};
