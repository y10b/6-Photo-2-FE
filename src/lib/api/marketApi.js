import {defaultFetch} from '@/lib/fetchClient';

export const fetchMarketCards = async ({
  filterType = '',
  filterValue = '',
  keyword = '',
  sort = 'latest',
  pageParam = 1,
  take = 12,
}) => {
  try {
    const queryParams = new URLSearchParams({
      page: pageParam.toString(),
      take: take.toString(),
      sort,
      keyword,
    });

    if (filterType) queryParams.append('filterType', filterType);
    if (filterValue) queryParams.append('filterValue', filterValue);

    const url = `/api/cards?${queryParams.toString()}`;
    const data = await defaultFetch(url, {cache: 'no-store'});
    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      '마켓 카드 목록 조회 중 오류가 발생했습니다.';
    throw new Error(message);
  }
};
