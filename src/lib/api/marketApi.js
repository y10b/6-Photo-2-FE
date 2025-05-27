const BASE_API = process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:5005';

export async function fetchMarketCards({
  pageParam = 1,
  take = 3,
  keyword = '',
  sort = 'latest',
  filterType = '',
  filterValue = '',
}) {
  const params = new URLSearchParams({page: pageParam, take, keyword, sort});
  if (filterType && filterValue) {
    params.append('filterType', filterType);
    params.append('filterValue', filterValue);
  }

  const response = await fetch(`${BASE_API}/api/cards?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API 요청 실패');
  }

  return response.json();
}
