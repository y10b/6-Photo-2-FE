'use client';

import Link from 'next/link';
import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {useModal} from '@/components/modal/ModalContext';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {openModal} = useModal();

  const handleChange = e => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));

    // 입력 시 해당 필드의 에러 제거
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!form.email.includes('@')) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!form.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      // TODO: API 연동
      console.log('로그인 데이터:', form);

      // 임시 성공 처리
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

      openModal({
        title: '로그인 성공',
        description: '환영합니다!\n메인 페이지로 이동합니다.',
        button: {
          label: '확인',
          onClick: () => {
            window.location.href = '/';
          },
        },
      });
    } catch (error) {
      console.error('로그인 에러:', error);
      openModal({
        title: '로그인 실패',
        description: '이메일 또는 비밀번호가\n올바르지 않습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = form.email && form.password;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* 로고 */}
        <div className="text-center mb-10">
          <h1 className="font-baskin text-[48px] text-main mb-2">최애의포토</h1>
          <p className="font-noto text-gray300 text-[16px]">
            다시 만나서 반갑습니다
          </p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <Input
              label="이메일"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요"
              error={errors.email}
            />

            <Input
              label="비밀번호"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해주세요"
              error={errors.password}
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full h-[60px] bg-main text-black font-noto font-bold text-[18px] rounded-xs mt-10 disabled:bg-gray400 disabled:text-gray300 hover:opacity-90 transition-opacity"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-8 text-center">
          <span className="font-noto text-gray300 text-[16px]">
            아직 계정이 없으신가요?{' '}
          </span>
          <Link
            href="/auth/signup"
            className="font-noto text-main text-[16px] underline hover:opacity-80"
          >
            회원가입
          </Link>
        </div>

        {/* 비밀번호 찾기 (선택사항) */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/forgot-password"
            className="font-noto text-gray400 text-[14px] hover:text-white transition-colors"
          >
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div>
    </main>
  );
}
