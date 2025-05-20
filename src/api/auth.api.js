import axiosInstance from "./axiosInstance";

// 회원가입
export const signUp = async ({ email, nickname, password }) => {
  const res = await axiosInstance.post("/auth/signup", {
    email,
    nickname,
    password,
  });
  return res.data;
};

// 로그인
export const signIn = async ({ email, password }) => {
  const res = await axiosInstance.post("/auth/signin", {
    email,
    password,
  });
  return res.data;
};

// 로그아웃 (클라이언트 사이드)
export const signOut = () => {
  localStorage.removeItem("accessToken");
  // 필요시 서버에 로그아웃 요청 추가
  // return axiosInstance.post("/auth/signOut");
};

// 토큰 존재 여부 확인
export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

// 현재 저장된 토큰 가져오기
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};