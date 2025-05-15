import CardList from '@/components/common/CardList';
import React from 'react'

function cardtext() {
  const cards = [
    {
      type: "original",
      title: "오리지널 카드",
      price: 10000,
      imageUrl: "/images/image1.png",
      cardGrade: "COMMON",
      CardGenre: "여행",
      nickname: "카드수집가짱",
      quantityLeft: 3,
      quantityTotal: 10,
    },
    {
      type: "for_sale",
      title: "한정판 카드",
      price: 15000,
      imageUrl: "/images/image1.png",
      cardGrade: "RARE",
      CardGenre: "음악",
      nickname: "photo_lover",
      quantityLeft: 0,
      quantityTotal: 10,
      saleStatus: "교환 제시 대기 중",
      description: "희귀한 카드입니다.",
    }, {
      type: "soldout",
      title: "품절 카드",
      price: 15000,
      imageUrl: "/images/image1.png",
      cardGrade: "RARE",
      CardGenre: "여행",
      nickname: "카드수집가짱",
      quantityLeft: 10,
      quantityTotal: 10,
    }, {
      type: "exchange",
      title: "교환 카드",
      price: 0,
      imageUrl: "/images/image1.png",
      cardGrade: "SUPER_RARE",
      CardGenre: "여행",
      nickname: "카드수집가짱",
      description: "이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중 이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중"
    }, {
      type: "for_sale",
      title: "판매 중 카드",
      saleStatus: "판매중",
      price: 2000,
      imageUrl: "/images/image1.png",
      cardGrade: "LEGENDARY",
      CardGenre: "여행",
      nickname: "카드수집가짱",
      quantityLeft: 3,
      quantityTotal: 10
    }, {
      type: "for_sale_soldout",
      title: "판매 완료 카드",
      price: 25000,
      imageUrl: "/images/image1.png",
      cardGrade: "COMMON",
      CardGenre: "여행",
      nickname: "카드수집가짱",
      quantityLeft: 10,
      quantityTotal: 10,
    }, {
      type: "my_card",
      title: "내 카드",
      price: 25000,
      imageUrl: "/images/image1.png",
      cardGrade: "COMMON",
      CardGenre: "여행",
      nickname: "카드수집가짱",
      quantityLeft: 3,
    }
  ]; // 이렇게 데이터가 들어올 것 
  return (
    <div>
      <CardList cards={cards} />
    </div>
  )
}

export default cardtext