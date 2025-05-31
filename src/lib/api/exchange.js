const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function postExchangeProposal({
  targetCardId,
  requestCardId,
  description,
  accessToken,
}) {
  console.log('📦 프론트 요청 데이터:', {
    targetCardId,
    requestCardId,
    description,
  });

  const response = await fetch(`${BASE_URL}/api/exchange`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      targetCardId,
      requestCardId,
      description,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ 서버 응답 오류:', errorData);
    throw new Error(errorData.message || '교환 제안 실패');
  }

  const result = await response.json();

  // ✅ 서버 응답 성공 시 프론트 로그 추가
  console.log('✅ 서버 응답 결과:', result);

  return result;
}

/**
 * 특정 카드에 대한 내 교환 요청 목록을 가져옵니다.
 * @param {string} targetCardId - 교환 대상 카드 ID
 * @param {string} accessToken - 액세스 토큰
 * @returns {Promise<Object>} - 교환 요청 목록 데이터
 */
export async function fetchMyExchangeRequests(targetCardId, accessToken) {
  try {
    console.log(`🔍 교환 요청 목록 조회 시작: targetCardId=${targetCardId}`);
    
    // 백엔드 API 엔드포인트 호출
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/exchange/card/${targetCardId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ 교환 요청 목록 조회 실패:', errorData);
      
      // 권한 관련 에러 메시지 처리
      if (errorData.message && errorData.message.includes('권한')) {
        return { data: [] }; // 권한이 없는 경우 빈 배열 반환
      }
      
      throw new Error(errorData.message || '교환 요청 목록을 가져오는데 실패했습니다.');
    }

    const data = await response.json();
    console.log('✅ 교환 요청 목록 조회 성공:', data);
    
    // 응답 데이터 구조 자세히 로깅
    if (data.data && data.data.length > 0) {
      console.log('📊 첫 번째 교환 요청 데이터 구조:', JSON.stringify(data.data[0], null, 2));
    }
    
    return data;
  } catch (error) {
    console.error('❌ 교환 요청 목록 조회 오류:', error);
    // 에러가 발생해도 UI가 깨지지 않도록 빈 배열 반환
    return { data: [] };
  }
}

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
