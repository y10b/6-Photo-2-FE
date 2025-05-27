import axiosInstance from '@/api/axiosInstance';

/**
 * 유저의 IDLE 포토카드 목록 조회 (중복 카드 그룹핑, 수량 계산)
 * GET /api/mypage/idle-cards
 */
export const fetchMyCards = async (params = {}) => {
  const {
    filterType = '',
    filterValue = '',
    keyword = '',
    page = 1,
    take = 10,
  } = params;

  try {
    const queryParams = new URLSearchParams();

    if (filterType) queryParams.append('filterType', filterType);
    if (filterValue) queryParams.append('filterValue', filterValue);
    if (keyword) queryParams.append('keyword', keyword);

    queryParams.append('page', page);
    queryParams.append('take', take);

    const url = `/api/mypage/idle-cards?${queryParams.toString()}`;

    const token = localStorage.getItem('accessToken');

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('포토카드 조회 실패:', error);
    throw new Error(
      error.response?.data?.message || error.message || '알 수 없는 오류',
    );
  }
};

/**
 * 판매 등록
 * POST /api/shop
 */
export const registerSale = async saleData => {
  try {
    const response = await axiosInstance.post('/api/shop', saleData);
    return response.data;
  } catch (error) {
    console.error('판매 등록 API 호출 중 에러:', error);
    throw new Error(
      error.response?.data?.message || error.message || '알 수 없는 오류',
    );
  }
};

/**
 * 판매글 수정
 * PUT /api/shop/:shopId
 */
export const updateShop = async (shopId, updateData) => {
  try {
    const response = await axiosInstance.put(`/api/shop/${shopId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('판매글 수정 API 호출 중 에러:', error);
    throw new Error(
      error.response?.data?.message || error.message || '알 수 없는 오류',
    );
  }
};

/**
 * 판매글 삭제
 * DELETE /api/shop/:shopId
 */
export const deleteShop = async shopId => {
  try {
    const response = await axiosInstance.delete(`/api/shop/${shopId}`);
    return response.data;
  } catch (error) {
    console.error('판매글 삭제 API 호출 중 에러:', error);
    throw new Error(
      error.response?.data?.message || error.message || '알 수 없는 오류',
    );
  }
};
