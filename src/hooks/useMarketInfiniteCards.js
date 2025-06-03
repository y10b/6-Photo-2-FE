'use client';

import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchMarketCards} from '@/lib/api/marketApi';

export default function useMarketInfiniteCards({keyword, sort, filter}) {
  return useInfiniteQuery({
    queryKey: ['marketCards', keyword, sort, filter],
    queryFn: ({pageParam = 1}) =>
      fetchMarketCards({
        pageParam,
        take: 12,
        keyword,
        sort,
        filterType: filter.type,
        filterValue: filter.value,
      }),
    getNextPageParam: lastPage =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
  });
}
