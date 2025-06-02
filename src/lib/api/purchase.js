const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

// 판매 정보 가져오기
export async function fetchPurchase(shopId, accessToken) {
  const res = await fetch(`${BASE_URL}/purchase/${shopId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: { revalidate: 0 },
  });

  if (res.status === 410) {
    const json = await res.json();
    return {
      ...json.data,
      isSoldOut: true,
    };
  }

  if (res.ok) {
    const result = await res.json();

    // 판매자인 경우 메시지에 '본인이 등록한 판매 게시글입니다'라는 문구가 포함됨
    const isSeller = result.message?.includes('본인이 등록한 판매 게시글') ||
      result.data?.isSeller === true;

    return {
      ...result.data,
      isSeller,
    };
  }

  throw new Error("포토카드 정보를 불러올 수 없습니다");
}

// 카드 구매 요청 보내기
export async function postPurchase({ shopId, quantity, accessToken }) {
  const response = await fetch(`${BASE_URL}/purchase/${shopId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('서버 에러 응답:', errorData);
    throw new Error(errorData.message || '구매 요청 실패');
  }

  return await response.json();
}
