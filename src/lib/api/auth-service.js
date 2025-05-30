import { defaultFetch, cookieFetch, tokenFetch } from '@/lib/fetchClient';

export const authService = {
  /**
   * 회원가입 - 인증 필요 없음
   */
  signUp: ({ email, nickname, password }) =>
    defaultFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, nickname, password }),
    }),

  /**
   * 로그인 - 쿠키 인증 사용 + accessToken 저장
   */
  signIn: async ({ email, password }) => {
    const res = await cookieFetch('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.accessToken) {
      localStorage.setItem('accessToken', res.accessToken);
    }
    if (res.user) {
      localStorage.setItem('user', JSON.stringify(res.user));
    }

    return res;
  },

  /**
   * 로그아웃 - 쿠키 인증 사용 + 클라이언트 상태 초기화
   */
  signOut: async () => {
    try {
      await cookieFetch('/auth/signout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('서버 로그아웃 실패:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * 로그인 여부 확인
   */
  isAuthenticated: () =>
    typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),

  /**
   * 현재 저장된 accessToken 가져오기
   */
  getAccessToken: () =>
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
};
