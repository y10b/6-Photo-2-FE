"use client";

import { useEffect, useState } from "react";
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

function PurchasePage({ params }) {
  const [photoCard, setPhotoCard] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPurchase(params.id);
        setPhotoCard(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [params.id]);

  if (!photoCard) {
    return <div className="text-white text-center mt-10">로딩 중...</div>;
  }

  const { name, description, imageUrl, grade, genre, shops } = photoCard;

  // shops 배열을 CardProfile에서 필요한 형식으로 변환
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
    <div className="w-[345px] mx-auto">
      <NoHeader title="마켓플레이스" />
      <div className="mt-5 mb-[26px]">
        <h3 className="mb-[10px] font-bold text-2xl text-white">{name}</h3>
        <hr />
      </div>
      <div className="mb-[20.25px] relative w-[345px] h-[258.75px] object-cover">
        <Image src={imageUrl} alt={name} fill />
      </div>
      <div>
        <CardProfile type="buyer" cards={cards} />
      </div>
    </div>
  );
}

export default PurchasePage;
