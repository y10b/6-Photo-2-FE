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


export async function postExchangeProposal({
  targetCardId,
  requestCardId,
  shopListingId,
  description,
  accessToken,
}) {
  try {
    // 요청 데이터 유효성 검사
    if (!targetCardId || !requestCardId || !shopListingId) {
      throw new Error('필수 정보가 누락되었습니다.');
    }

    // 숫자로 변환
    const numericTargetCardId = Number(targetCardId);
    const numericRequestCardId = Number(requestCardId);
    const numericShopListingId = Number(shopListingId);

    if (isNaN(numericTargetCardId) || isNaN(numericRequestCardId) || isNaN(numericShopListingId)) {
      throw new Error('ID는 숫자여야 합니다.');
    }

    const response = await fetch(`${BASE_URL}/api/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        targetCardId: numericTargetCardId,
        requestCardId: numericRequestCardId,
        shopListingId: numericShopListingId,
        description: description || '',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '교환 제안 실패');
    }

    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('교환 요청 API 오류:', error);
    throw error;
  }
}

/**
 * 내가 보낸 교환 요청 목록을 조회합니다.
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} - 교환 요청 목록 데이터
 */
export const fetchMyExchangeRequests = async (accessToken) => {
  console.log('🔍 내가 보낸 교환 요청 목록 조회 시작');

  try {
    const response = await fetch(
      `${BASE_URL}/api/exchange/my-requests`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ 교환 요청 목록 조회 실패:', errorData);
      throw new Error(errorData.message || '교환 요청 목록을 가져오는데 실패했습니다.');
    }

    const data = await response.json();
    console.log('✅ 교환 요청 목록 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 교환 요청 목록 조회 실패:', error);
    return { success: false, data: [] };
  }
};

/**
 * 교환 요청을 생성합니다.
 * @param {Object} exchangeData - 교환 요청 데이터
 * @param {string} exchangeData.targetCardId - 교환 대상 카드 ID
 * @param {string} exchangeData.requestCardId - 교환 요청 카드 ID
 * @param {string} exchangeData.description - 교환 설명
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} - 생성된 교환 요청 데이터
 */
export async function createExchangeRequest(exchangeData, accessToken) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(exchangeData),
      },
    );

    if (!response.ok) {
      throw new Error('교환 요청 생성에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('교환 요청 생성 오류:', error);
    throw error;
  }
}

/**
 * 교환 요청을 취소합니다.
 * @param {number} exchangeId - 취소할 교환 요청 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} - 취소된 교환 요청 데이터
 */
export async function cancelExchangeRequest(exchangeId, accessToken) {
  try {
    // exchangeId가 숫자인지 확인
    const numericExchangeId = Number(exchangeId);
    console.log(`🔄 교환 취소 API 호출: exchangeId=${numericExchangeId}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange/${numericExchangeId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ 서버 응답 오류:', errorData);
      throw new Error(errorData.message || '교환 요청 취소에 실패했습니다.');
    }

    const result = await response.json();
    console.log('✅ 교환 취소 성공:', result);
    return result;
  } catch (error) {
    console.error('❌ 교환 요청 취소 실패:', error);
    throw error;
  }
}

/**
 * 판매 게시글에 대한 교환 제안 목록을 가져옵니다.
 * @param {number} shopId - 판매 게시글 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} - 교환 제안 목록 데이터
 */
export async function fetchShopExchangeRequests(shopId, accessToken) {
  try {
    console.log(`🔍 판매 게시글 교환 요청 목록 조회 시작: shopId=${shopId}`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange/shop/${shopId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 판매 게시글 교환 요청 목록 조회 실패:', errorText);
      throw new Error('교환 요청 목록을 가져오는데 실패했습니다.');
    }

    const result = await response.json();
    console.log('✅ 판매 게시글 교환 요청 목록 조회 결과:', result);
    return result;
  } catch (error) {
    console.error('판매 게시글 교환 요청 목록 조회 오류:', error);
    throw error;
  }
}

/**
 * 특정 판매글에 대해 내가 보낸 교환 요청을 조회합니다.
 * @param {number} shopListingId - 판매글 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} - 교환 요청 목록 데이터
 */
export const fetchMyExchangeRequestsForShop = async (shopListingId, accessToken) => {
  console.log('🔍 판매글에 대한 내 교환 요청 조회 시작:', { shopListingId });

  try {
    const response = await fetch(
      `${BASE_URL}/api/exchange/shop/${shopListingId}/my-requests`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ 교환 요청 조회 실패:', errorData);
      throw new Error(errorData.message || '교환 요청을 가져오는데 실패했습니다.');
    }

    const data = await response.json();
    console.log('✅ 교환 요청 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 교환 요청 조회 실패:', error);
    return { success: false, data: [] };
  }
};

/**
 * 특정 판매글에 대해 내가 제시한 교환 카드 목록을 조회합니다.
 * @param {number} shopListingId - 판매글 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} - 교환 제시 카드 목록 데이터
 */
export const fetchMyOfferedCardsForShop = async (shopListingId, accessToken) => {
  console.log('🔍 판매글에 대한 내가 제시한 카드 목록 조회 시작:', { shopListingId });

  try {
    const response = await fetch(
      `${BASE_URL}/api/exchange/shop/${shopListingId}/my-cards`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ 제시 카드 목록 조회 실패:', errorData);
      throw new Error(errorData.message || '제시한 카드 목록을 가져오는데 실패했습니다.');
    }

    const data = await response.json();
    console.log('✅ 제시 카드 목록 조회 성공:', data);
    return {
      success: true,
      data: data.data.map(card => ({
        id: card.id,
        photoCard: {
          imageUrl: card.photoCard.imageUrl,
          name: card.photoCard.name,
          grade: card.photoCard.grade,
          genre: card.photoCard.genre
        },
        status: card.status,
        createdAt: card.createdAt
      }))
    };
  } catch (error) {
    console.error('❌ 제시 카드 목록 조회 실패:', error);
    return { success: false, data: [] };
  }
};
