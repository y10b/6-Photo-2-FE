import axios from "axios";

// 환경 변수에서 baseURL 가져오기
const baseURL = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  process.env.REACT_APP_API_BASE_URL || 
  "http://localhost:5005"; // 기본값

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 크로스 도메인 요청에 쿠키 포함
});

// 요청 시 토큰 자동 주입
axiosInstance.interceptors.request.use((config) => {
  const token = 
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 추가: 401 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response, // 응답이 정상일 경우 그대로 반환
  async (error) => {
    const originalRequest = error.config;
    
    // 401 오류 발생 시, Access Token이 만료된 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 요청을 중복해서 보내지 않도록 플래그 설정
      
      try {
        // 리프레시 토큰은 쿠키에 저장되어 있으므로 별도 전송 불필요
        // baseURL을 포함한 전체 URL 사용
        const response = await axios.post(
          `${baseURL}/auth/refresh`, // 전체 URL 사용
          {}, // 빈 body (쿠키에서 리프레시 토큰 읽음)
          { withCredentials: true } // 쿠키 포함
        );
        
        // 새로운 Access Token을 localStorage에 저장
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        
        // 기존 요청을 새로운 Access Token으로 재시도
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest); // axiosInstance 사용
      } catch (err) {
        // Refresh Token 요청 실패 시 로그인 페이지로 리다이렉트
        console.error("Refresh Token Error", err);
        localStorage.removeItem("accessToken"); // 만료된 토큰 제거
        window.location.href = "/auth/login"; // auth 폴더 경로로 수정
        return Promise.reject(err);
      }
    }
    
    // 401 외의 오류는 그대로 처리
    return Promise.reject(error);
  }
);

export default axiosInstance;