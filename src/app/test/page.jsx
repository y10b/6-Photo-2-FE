import CardList from '@/components/ui/card/cardOverview/CardList';
import React from 'react';

function page() {
  const cards = [
    {
      type: 'original',
      title: '오리지널 카드',
      price: 10000,
      imageUrl: '/images/image1.png',
      createdAt: '2025-05-30T05:03:04.193Z',
      cardGrade: 'SUPER_RARE',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      quantityLeft: 3,
    }, //포토카드 교환하기 모달, 나의 포토카드 판매하기 모달,  마이 갤러리
    {
      type: 'exchange_btn1',
      title: '교환 카드',
      price: 10000,
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      description:
        '이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중 이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중',
    }, // 교환 원버튼
    {
      type: 'exchange_btn2',
      title: '교환 카드',
      price: 10000,
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      description:
        '이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중 이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중',
    }, // 교환 투버튼
    {
      type: 'exchange_big',
      title: '교환 카드',
      price: 10000,
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      quantityLeft: 3,
    }, // 교환 큰 버전

    {
      type: 'original',
      title: '내 카드',
      price: 25000,
      saleStatus: 'exchange',
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      saleStatus: 'exchange',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      quantityLeft: 3,
    }, // 마이 갤러리 (교환 제시 중)
    {
      type: 'original',
      title: '내 카드',
      saleStatus: 'soldout',
      price: 25000,
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      saleStatus: 'soldout',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      quantityLeft: 3,
    }, // 마이 갤러리 (솔드 아웃)
    {
      type: 'original',
      title: '내 카드',
      saleStatus: 'sale',
      price: 25000,
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      quantityLeft: 3,
    }, // 마이 갤러리 (판매중)
    {
      type: 'market',
      title: '내 카드',
      price: 25000,
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      quantityLeft: 3,
      quantityTotal: 5,
    }, // 마켓플레이스
    {
      type: 'my_sale',
      title: '내 카드',
      price: 25000,
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      cardGenre: '여행',
      nickname: '카드수집가짱',
      quantityLeft: 3,
      quantityTotal: 5,
    }, // 나의 판매 포토카드
  ];
  return (
    <div>
      <CardList cards={cards} />
    </div>
  );
}

export default page;
