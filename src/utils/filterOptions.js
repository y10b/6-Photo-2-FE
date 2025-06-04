export const GRADE_OPTIONS = [
  {label: 'COMMON', value: 'COMMON'},
  {label: 'RARE', value: 'RARE'},
  {label: 'SUPER RARE', value: 'SUPER_RARE'},
  {label: 'LEGENDARY', value: 'LEGENDARY'},
];

export const GENRE_OPTIONS = [
  {label: '여행', value: 'TRAVEL'},
  {label: '풍경', value: 'LANDSCAPE'},
  {label: '인물', value: 'PORTRAIT'},
  {label: '사물', value: 'OBJECT'},
];

export const SOLDOUT_OPTIONS = [
  {label: '판매 중', value: 'false'},
  {label: '품절', value: 'true'},
];

export const METHOD_OPTIONS = [
  {label: '판매', value: 'sale'},
  {label: '교환', value: 'exchange'},
];

export const SORT_OPTIONS = [
  {label: '최신순', value: 'latest'},
  {label: '오래된순', value: 'oldest'},
  {label: '낮은 가격순', value: 'price-asc'},
  {label: '높은 가격순', value: 'price-desc'},
];

export const FILTER_TAB_CONFIG = {
  grade: {
    label: '등급',
    options: ['COMMON', 'RARE', 'SUPER_RARE', 'LEGENDARY'],
  },
  genre: {
    label: '장르',
    options: ['TRAVEL', 'LANDSCAPE', 'PORTRAIT', 'OBJECT'],
  },
  method: {
    label: '판매 방법',
    options: ['sale', 'exchange'],
  },
  soldOut: {
    label: '매진 여부',
    options: ['false', 'true'],
  },
};

export const FILTER_LABEL_MAP = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  SUPER_RARE: 'SUPER RARE',
  LEGENDARY: 'LEGENDARY',
  TRAVEL: '여행',
  LANDSCAPE: '풍경',
  PORTRAIT: '인물',
  OBJECT: '사물',
  sale: '판매',
  exchange: '교환',
  true: '판매 완료',
  false: '판매 중',
};
