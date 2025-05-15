import Card from "@/components/common/Card";

export default function Home() {
  return (
    <div>
      <h1 className="font-baskin text-3xl text-pink-500">배스킨라빈스</h1>
      <p className="font-noto">노토 산스 코리아</p>
      <Card
        type="original"
        title="오리지널 카드"
        price={10000}
        imageUrl="/images/image1.png"
        cardGrade="COMMON"
        CardGenre="여행"
        nickname="카드수집가짱"
        quantityLeft={3}
        quantityTotal={10}
      />
      <Card
        type="soldout"
        title="품절 카드"
        price={15000}
        imageUrl="/images/image1.png"
        cardGrade="RARE"
        CardGenre="여행"
        nickname="카드수집가짱"
        quantityLeft={10}
        quantityTotal={10}
      />
      <Card
        type="exchange"
        title="교환 카드"
        price={0}
        imageUrl="/images/image1.png"
        cardGrade="SUPER_RARE"
        CardGenre="여행"
        nickname="카드수집가짱"
        description="이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중 이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중"
      />
      <Card
        type="for_sale"
        title="판매 중 카드"
        saleStatus="교환 제시 대기 중"
        price={20000}
        imageUrl="/images/image1.png"
        cardGrade="LEGENDARY"
        CardGenre="여행"
        nickname="카드수집가짱"
        quantityLeft={3}
        quantityTotal={10}
      />
      <Card
        type="for_sale"
        saleStatus="판매 중"
        title="내 카드"
        price={25000}
        imageUrl="/images/image1.png"
        cardGrade="COMMON"
        CardGenre="여행"
        nickname="카드수집가짱"
        quantityLeft={3}
      />
      <Card
        type="for_sale_soldout"
        title="판매 완료 카드"
        price={25000}
        imageUrl="/images/image1.png"
        cardGrade="COMMON"
        CardGenre="여행"
        nickname="카드수집가짱"
        quantityLeft={10}
        quantityTotal={10}
      />
      <Card
        type="my_card"
        title="내 카드"
        price={25000}
        imageUrl="/images/image1.png"
        cardGrade="COMMON"
        CardGenre="여행"
        nickname="카드수집가짱"
        quantityLeft={3}
      />
    </div>
  );
}
