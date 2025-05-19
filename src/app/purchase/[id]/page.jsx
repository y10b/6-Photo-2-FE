"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NoHeader from "@/components/layout/NoHeader";
import CardProfile from "@/components/ui/card/cardProfile/CardProfile";
import Image from "next/image";

async function fetchPurchase(id) {
  const res = await fetch(`http://localhost:5005/api/purchase/${id}`, {
    next: { revalidate: 0 },
  });

  if (!res.ok) throw new Error("포토카드 정보를 불러올 수 없습니다");

  const result = await res.json();
  return result.data;
}

function PurchasePage() {
  const { id } = useParams();
  const [photoCard, setPhotoCard] = useState(null);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        const data = await fetchPurchase(id);
        setPhotoCard(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [id]);

  if (!photoCard) {
    return <div className="text-white text-center mt-10">로딩 중...</div>;
  }

  const { name, description, imageUrl, grade, genre, shops } = photoCard;

  const cards = shops.map((shop) => ({
    cardGrade: grade,
    CardGenre: genre,
    nickname: shop.sellerNickname,
    photoDescription: description,
    price: shop.price,
    quantityLeft: shop.remainingQuantity,
    quantityTotal: shop.initialQuantity,
  }));

  return (
    <div className="w-full max-w-[744px] tablet:max-w-[1200px] pc:max-w-[1380px] mx-auto px-[20px] tablet:px-[40px] pc:px-0">
      <NoHeader title="마켓플레이스" />

      <div className="mt-5 mb-[26px] tablet:mb-12 pc:mb-[70px]">
        <h3 className="mb-[10px] font-bold text-2xl text-white">{name}</h3>
        <hr />
      </div>
      {/* 반응형 레이아웃 */}
      <div className="flex flex-col tablet:flex-row gap-5 pc:gap-20 mb-30">
        {/* 이미지 */}
        <div className="w-[345px] tablet:w-[342px] pc:w-240 h-[258.75px] tablet:h-[256.5px] pc:h-180 relative">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>

        {/* 카드 컴포넌트 */}
        <div className="w-full tablet:flex-1">
          <CardProfile type="buyer" cards={cards} />
        </div>
      </div>
    </div>
  );
}

export default PurchasePage;
