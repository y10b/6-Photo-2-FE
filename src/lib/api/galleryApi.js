const BASE_API = 'http://localhost:5005';

// 마이 갤러리 카드 조회
export async function fetchMyGalleryCards({
  pageParam = 1,
  take = 4,
  keyword = '',
  sort = 'latest',
  filterType = '',
  filterValue = '',
}) {
  const params = new URLSearchParams({
    page: pageParam,
    take,
    keyword,
    sort,
  });

  if (filterType && filterValue) {
    params.append('filterType', filterType);
    params.append('filterValue', filterValue);
  }

  const url = `${BASE_API}/api/mypage/idle-cards?${params.toString()}`;
  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));

    throw new Error(error.message || '마이갤러리 불러오기 실패');
  }

  const data = await res.json();
  return data;
}

// 포토카드 생성 요청
export async function createPhotoCard(data) {
  const url = `${BASE_API}/api/mypage/create`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || '포토카드 생성에 실패했습니다');
  }

  const result = await res.json();
  return result;
}
