import axiosInstance from '@/api/axiosInstance';

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

  try {
    const response = await axiosInstance.get(
      `/api/mypage/idle-cards?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('마이갤러리 불러오기 실패:', error);
    throw new Error(
      error.response?.data?.message || error.message || '알 수 없는 오류',
    );
  }
}

// 이미지 업로드
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axiosInstance.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const {imageUrl} = response.data;
    // 업로드된 파일의 실제 접근 경로는 API의 baseURL에서 `/api` 제거한 경로
    return `${axiosInstance.defaults.baseURL.replace('/api', '')}${imageUrl}`;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw new Error(
      error.response?.data?.message || error.message || '이미지 업로드 실패',
    );
  }
}

// 포토카드 생성 제한
export async function fetchCardCreationQuota() {
  try {
    const response = await axiosInstance.get('/api/mypage/creation-quota', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('생성 가능 횟수 조회 실패:', error);
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        '생성 가능 횟수 불러오기 실패',
    );
  }
}
