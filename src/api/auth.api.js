import axiosInstance from './axiosInstance';

// 회원가입
export const signUp = async ({email, nickname, password}) => {
  try {
    const res = await axiosInstance.post('/auth/signup', {
      email,
      nickname,
      password,
    });
    return res.data;
  } catch (error) {
    console.error('회원가입 실패:', error);
    throw error; // 오류를 던져서 React Query나 try-catch에서 처리할 수 있게 함
  }
};

// 로그인
export const signIn = async ({email, password}) => {
  try {
    const res = await axiosInstance.post('/auth/signin', {
      email,
      password,
    });
    // 응답에서 토큰 저장
    if (res.data.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);

      // 사용자 정보가 있으면 저장
      if (res.data.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    }

    return res.data;
  } catch (error) {
    throw error;
  }
};

// 로그아웃 (서버 요청 포함)
export const signOut = async () => {
  try {
    // 서버에 로그아웃 요청 (리프레시 토큰 무효화)
    await axiosInstance.post('/auth/signout');
  } catch (error) {
    console.error('서버 로그아웃 실패:', error);
  } finally {
    // 클라이언트 측 로그아웃 처리는 항상 수행
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

// 토큰 존재 여부 확인
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false; // SSR 고려
  return !!localStorage.getItem('accessToken');
};

// 현재 저장된 토큰 가져오기
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null; // SSR 고려
  return localStorage.getItem('accessToken');
};