import {defaultFetch} from '@/lib/fetchClient';

export const fetchMarketCards = async ({
  filterType = '',
  filterValue = '',
  keyword = '',
  sort = 'latest',
  page = 1,
  take = 12,
}) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
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
    console.error('마켓 카드 목록 조회 실패:', error);
    throw new Error(error.message || '마켓 카드 목록 조회 실패');
  }
};
