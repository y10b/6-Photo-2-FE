"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NoHeader from "@/components/layout/NoHeader";
import CardProfile from "@/components/ui/card/cardProfile/CardProfile";
import Image from "next/image";
import { fetchPurchase } from "@/lib/api/purchase";

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

  const {
    name,
    description,
    imageUrl,
    grade,
    genre,
    sellerNickname,
    price,
    initialQuantity,
    remainingQuantity,
  } = photoCard;

  const cards = [
    {
      cardGrade: grade,
      cardGrade: genre,
      nickname: sellerNickname,
      photoDescription: description,
      price: price,
      quantityLeft: remainingQuantity,
      quantityTotal: initialQuantity,
    },
  ];

  return (
    <div className="max-w-[744px] m-auto px-5 tablet:max-w-300 tablet:px-10 pc:px-0">
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
