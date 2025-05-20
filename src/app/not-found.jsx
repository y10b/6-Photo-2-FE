import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotfoundPage() {
  const router = useRouter;
  return (
    <div className="flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-6xl font-bold font-baskin mb-4">404</h1>
      <p className="text-xl mb-6`">페이지를 찾을 수 없습니다.</p>
      <Button onClick={() => router.push("/")}>홈으로 이동</Button>
    </div>
  );
}
