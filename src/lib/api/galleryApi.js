const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 마이 갤러리 카드 조회
export async function fetchMyGalleryCards({
  pageParam = 1,
  take = 12,
  keyword = '',
  sort = 'latest',
  filterType = '',
  filterValue = '',
}) {
  const token = localStorage.getItem('accessToken');
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

  const res = await fetch(
    `${BASE_URL}/api/mypage/idle-cards?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {revalidate: 0},
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || '마이갤러리 불러오기 실패');
  }

  return res.json();
}

// 포토카드 생성
export async function createPhotoCard(data) {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${BASE_URL}/api/mypage/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || '포토카드 생성에 실패했습니다');
  }

  return res.json();
}

// 이미지 업로드
export async function uploadImage(file) {
  const token = localStorage.getItem('accessToken');
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || '이미지 업로드 실패');
  }

  const {imageUrl} = await res.json();
  return `${BASE_URL.replace('/api', '')}${imageUrl}`;
}

// 포토카드 생성 제한
export async function fetchCardCreationQuota() {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${BASE_URL}/api/mypage/creation-quota`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {revalidate: 0},
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || '생성 가능 횟수 불러오기 실패');
  }

  return res.json();
}
