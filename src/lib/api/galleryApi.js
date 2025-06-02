import {tokenFetch} from '@/lib/fetchClient';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// 마이갤러리 카드 목록 조회
export const fetchMyGalleryCards = async ({
  filterType = '',
  filterValue = '',
  keyword = '',
  page = 1,
  take = 12,
}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      take: take.toString(),
    });

    if (filterType) queryParams.append('filterType', filterType);
    if (filterValue) queryParams.append('filterValue', filterValue);
    if (keyword) queryParams.append('keyword', keyword);

    const url = `/api/mypage/idle-cards?${queryParams.toString()}`;
    const data = await tokenFetch(url, {cache: 'no-store'});
    return data;
  } catch (error) {
    console.error('마이갤러리 카드 조회 실패:', error);
    throw new Error(error.message || '마이갤러리 카드 조회 실패');
  }
};

// 포토카드 생성
export async function createPhotoCard(data) {
  return tokenFetch('/api/mypage/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
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

// 포토카드 생성 가능 여부 조회
export async function fetchCardCreationQuota() {
  return tokenFetch('/api/mypage/creation-quota');
}
