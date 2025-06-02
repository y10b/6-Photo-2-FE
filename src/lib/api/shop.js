import {tokenFetch} from '@/lib/fetchClient';

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

    const data = await tokenFetch(url, {cache: 'no-store'});
    return data;
  } catch (error) {
    console.error('포토카드 조회 실패:', error);
    throw new Error(error.message || '알 수 없는 오류');
  }
};

/**
 * 판매 등록
 * POST /api/shop
 */
export const registerSale = async saleData => {
  try {
    const data = await tokenFetch('/api/shop', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
    return data;
  } catch (error) {
    console.error('판매 등록 API 호출 중 에러:', error);
    throw new Error(error.message || '알 수 없는 오류');
  }
};

/**
 * 판매글 수정
 * PUT /api/shop/:shopId
 */
export const updateShop = async (shopId, updateData) => {
  try {
    const data = await tokenFetch(`/api/shop/${shopId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return data;
  } catch (error) {
    console.error('판매글 수정 API 호출 중 에러:', error);
    throw new Error(error.message || '알 수 없는 오류');
  }
};

/**
 * 판매글 삭제
 * DELETE /api/shop/:shopId
 */
export const deleteShop = async shopId => {
  try {
    const data = await tokenFetch(`/api/shop/${shopId}`, {
      method: 'DELETE',
    });
    return data;
  } catch (error) {
    console.error('판매글 삭제 API 호출 중 에러:', error);
    throw new Error(error.message || '알 수 없는 오류');
  }
};

/**
 * 판매 포토카드 목록 조회
 * GET /api/mypage/sales
 */
export const fetchMySalesCards = async ({
  filterType = '',
  filterValue = '',
  keyword = '',
  page = 1,
  take = 10,
}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      take: take.toString(),
    });

    if (filterType) queryParams.append('filterType', filterType);
    if (filterValue) queryParams.append('filterValue', filterValue);
    if (keyword) queryParams.append('keyword', keyword);

    const url = `/api/mypage/sales?${queryParams.toString()}`;
    const data = await tokenFetch(url, {cache: 'no-store'});
    return data;
  } catch (error) {
    console.error('판매 포토카드 조회 실패:', error);
    throw new Error(error.message || '판매 포토카드 조회 실패');
  }
};

/**
 * 판매글 상세 조회
 * GET /api/shop/:shopId
 */
export const fetchShopDetail = async shopId => {
  try {
    const data = await tokenFetch(`/api/shop/${shopId}`, {
      cache: 'no-store',
    });
    return data;
  } catch (error) {
    console.error('판매글 상세 조회 실패:', error);
    throw new Error(error.message || '판매글 상세 조회 실패');
  }
};
