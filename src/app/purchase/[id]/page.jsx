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
    <div className="mobile:max-w-[345px] w-full mx-auto">
      <NoHeader title="마켓플레이스" />
      <div className="mt-5 mb-[26px]">
        <h3 className="mb-[10px] font-bold text-2xl text-white">{name}</h3>
        <hr />
      </div>

      {/* 반응형 레이아웃 */}
      <div className="flex flex-col tablet:flex-row gap-6">
        {/* 이미지 */}
        <div className="relative w-full h-[258.75px] tablet:w-[342px] tablet:h-[256.5px]">
          <div className="relative aspect-[4/3] w-full h-full">
            <Image src={imageUrl} alt={name} fill className="object-cover" />
          </div>
        </div>

        {/* 카드 컴포넌트 */}
        <div className="w-full tablet:w-1/2">
          <CardProfile type="buyer" cards={cards} />
        </div>
      </div>
    </div>
  );
}

export default PurchasePage;
