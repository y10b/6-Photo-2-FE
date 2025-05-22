'use client';

import {signUp, signIn, signOut} from '@/api/auth.api';
import {createContext, useContext, useEffect, useState} from 'react';

const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  user: null,
  updateUser: () => {},
  register: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({children}) {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      // 현재는 user API가 없으므로 토큰에서 유저 정보 추출하는 임시 방법 사용
      // 향후 getMyUserInfo API가 구현되면 해당 API 호출로 대체
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    } catch (error) {
      console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      setUser(null);
      // 토큰이 유효하지 않으면 제거
      localStorage.removeItem('accessToken');
    }
  };

  const register = async (nickname, email, password, passwordConfirmation) => {
    try {
      if (password !== passwordConfirmation) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      await signUp({email, nickname, password});
      return true;
    } catch (error) {
      console.error('AuthProvider 회원가입 실패:', error);
      throw error; // 에러를 다시 throw하여 컴포넌트에서 처리할 수 있도록 함
    }
  };

  const login = async (email, password) => {
    try {
      console.log('AuthProvider 로그인 시도:', {email});

      const response = await signIn({email, password});
      console.log('AuthProvider 로그인 응답:', response);

      // 액세스 토큰 저장
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }

      // 사용자 정보 저장 (임시)
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      await getUser();

      console.log('AuthProvider 로그인 성공');
      return true;
    } catch (error) {
      console.error('AuthProvider 로그인 실패:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);

      // 로컬 스토리지 정리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // 랜딩페이지로 이동
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 로그아웃 실패해도 클라이언트 상태는 초기화
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // 랜딩페이지로 이동
      window.location.href = '/';
    }
  };

  const updateUser = async userData => {
    // 현재는 updateMyUserInfo API가 없으므로 임시로 로컬 스토리지 업데이트
    // 향후 API가 구현되면 해당 API 호출로 대체
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const updatedUser = {...currentUser, ...userData};
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  useEffect(() => {
    // 토큰이 있으면 사용자 정보 가져오기
    const token = localStorage.getItem('accessToken');
    if (token) {
      getUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{user, login, logout, updateUser, register}}>
      {children}
    </AuthContext.Provider>
  );
}
