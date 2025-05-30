'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {authService} from '../lib/api/auth-service';
import {userService} from '../lib/api/user-service';

const AuthContext = createContext({
  login: () => {},
  logout: () => {},
  user: null,
  updateUser: () => {},
  register: () => {},
  getUser: () => {},
  loading: true,
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
  const [loading, setLoading] = useState(true);

  // 사용자 정보 불러오기
  const getUser = async () => {
    try {
      const userData = await userService.getUserInfo();
      setUser(userData);
    } catch (error) {
      console.error('사용자 정보를 가져오는데 실패했습니다:', error);
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  // 회원가입
  const register = async (nickname, email, password, passwordConfirmation) => {
    if (password !== passwordConfirmation) {
      throw new Error('비밀번호가 일치하지 않습니다.');
    }
    await authService.signUp({email, nickname, password});
    return true;
  };

  // 로그인
  const login = async (email, password) => {
    try {
      const response = await authService.signIn({email, password});

      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        await getUser();
      }

      return true;
    } catch (error) {
      console.error('AuthProvider 로그인 실패:', error);
      return false;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.warn('서버 로그아웃 실패:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  };

  // 사용자 정보 수정
  const updateUser = async userData => {
    try {
      const updatedUser = await userService.updateUserInfo(userData);
      setUser(updatedUser);
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
    }
  };

  // 초기 실행
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{user, login, logout, updateUser, register, getUser, loading}}
    >
      {children}
    </AuthContext.Provider>
  );
}
