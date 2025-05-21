"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

// 로그인된 사용자만 접근 가능한 경로
const protectedPaths = [
  // 추가 보호 경로들...
];

// 미인증 사용자만 접근 가능한 경로
const publicPaths = [
  "/",
  "/login",
  "/signup",
  // 추가 공개 경로들...
];

export default function RouteGuard({ children }) {
  const { user } = useAuth(); // 로그인 상태를 가져오는 훅
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // pathname을 경로와 쿼리 부분으로 분리
    const path = pathname.split("?")[0];

    // 정확한 경로 매칭 또는 하위 경로 매칭
    const isProtectedRoute = protectedPaths.some(
      (route) =>
        path === route || (path.startsWith(route + "/") && route !== "/")
    );

    // 정확한 경로 매칭 또는 하위 경로 매칭 (단, '/'는 정확히 일치할 때만)
    const isPublicRoute = publicPaths.some(
      (route) =>
        path === route || (path.startsWith(route + "/") && route !== "/")
    );

    // 사용자의 인증 상태에 따른 리다이렉트 처리
    if (isProtectedRoute && !user) {
      router.push("/login");
    } else if (isPublicRoute && user) {
      if (path === "/login" || path === "/signup" || path === "/") {
        router.push("/items");
      } else {
        setIsLoading(false); // ✔️ 로그인된 상태에서 공개 경로 접근 허용 시 로딩 종료
      }
    } else {
      setIsLoading(false); // ✔️ 보호/공개 경로 외 기타 접근 허용
    }
  }, [user, pathname, router]);

  // 리다이렉트 중이거나 인증 확인 중일 때는 컨텐츠를 표시하지 않음
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return children;
}
