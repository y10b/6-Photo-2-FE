const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;

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

  const url = `${BASE_URL}/mypage/idle-cards?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || '마이갤러리 불러오기 실패');
  }

  return await res.json();
}

// 포토카드 생성 요청
export async function createPhotoCard(data) {
  const token = localStorage.getItem('accessToken');

  const url = `${BASE_URL}/mypage/create`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || '포토카드 생성에 실패했습니다');
  }

  return await res.json();
}

// 이미지 업로드
export async function uploadImage(file) {
  const url = `${BASE_URL}/upload`;
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('이미지 업로드 실패');
  }

  const data = await response.json();
  return `${BASE_URL.replace('/api', '')}${data.imageUrl}`;
}

// 포토카드 생성 제한
export async function fetchCardCreationQuota() {
  const token = localStorage.getItem('accessToken');

  const res = await fetch(`${BASE_URL}/mypage/creation-quota`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('생성 가능 횟수 불러오기 실패');
  }

  return res.json();
}
