'use client';

import Link from 'next/link';
import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {useModal} from '@/components/modal/ModalContext';
import Button from '@/components/common/Button';

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
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

    if (!form.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (form.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상 입력해주세요.';
    }

    if (!form.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (form.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상 입력해주세요.';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
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
      console.log('회원가입 데이터:', form);

      // 임시 성공 처리
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

      openModal({
        title: '회원가입 완료',
        description: '회원가입이 완료되었습니다.\n로그인 페이지로 이동합니다.',
        button: {
          label: '확인',
          onClick: () => {
            window.location.href = '/auth/login';
          },
        },
      });
    } catch (error) {
      console.error('회원가입 에러:', error);
      openModal({
        title: '회원가입 실패',
        description: '회원가입 중 오류가 발생했습니다.\n다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    form.email && form.nickname && form.password && form.confirmPassword;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* 로고 */}
        <div className="text-center mb-10">
          <h1 className="font-baskin text-[48px] text-main mb-2">최애의포토</h1>
          <p className="font-noto text-gray300 text-[16px]">
            새로운 계정을 만들어보세요
          </p>
        </div>

        {/* 회원가입 폼 */}
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
              label="닉네임"
              name="nickname"
              type="text"
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력해주세요"
              error={errors.nickname}
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

            <Input
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력해주세요"
              error={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            role="default"
            variant="primary"
            fullWidth={true}
            className="mt-10"
          >
            {isLoading ? '가입 중...' : '가입하기'}
          </Button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-8 text-center">
          <span className="font-noto text-gray300 text-[16px]">
            이미 계정이 있으신가요?{' '}
          </span>
          <Link
            href="/auth/login"
            className="font-noto text-main text-[16px] underline hover:opacity-80"
          >
            로그인
          </Link>
        </div>
      </div>
    </main>
  );
}
