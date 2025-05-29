const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function postExchangeProposal({
  targetCardId,
  requestCardId,
  description,
  accessToken,
}) {
  // ✅ 요청 직전 프론트 콘솔 로그
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
