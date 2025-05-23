'use client';

import Link from 'next/link';
import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {useModal} from '@/components/modal/ModalContext';
import Button from '@/components/common/Button';
import {useAuth} from '@/providers/AuthProvider';
import Image from 'next/image';
import GoogleButton from '@/components/common/GoogleButton';
import {useRouter} from 'next/navigation';

export default function SignUpPage() {
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const {register} = useAuth();
  const {openModal} = useModal();
  const router = useRouter();

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

    try {
      await register(
        form.nickname,
        form.email,
        form.password,
        form.confirmPassword,
      );

      openModal({
        type: 'alert', // 🔥 type 추가
        title: '회원가입 완료',
        description: '회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.',
        button: {
          label: '확인',
          onClick: () => {
            router.push('/auth/login');
          },
        },
      });
    } catch (error) {
      openModal({
        type: 'alert', // 🔥 type 추가
        title: '회원가입 실패',
        description:
          error.message ||
          '회원가입 중 오류가 발생했습니다.\n다시 시도해주세요.',
        button: {
          label: '확인',
        },
      });
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google 로그인 시도');
  };

  const isFormValid =
    form.email && form.nickname && form.password && form.confirmPassword;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-[345px] tablet:max-w-[440px] pc:max-w-[520px]">
        {/* 로고 */}
        <div className="flex justify-center mb-15">
          <Link href={'/'}>
            <figure className="relative w-[189px] h-[35px] tablet:w-[331px] tablet:h-[60px]">
              <Image
                src={'/logo.svg'}
                fill
                className="object-cover fill"
                alt="로고"
              />
            </figure>
          </Link>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8 w-full">
            <Input
              label="이메일"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력해 주세요"
              error={errors.email}
            />

            <Input
              label="닉네임"
              name="nickname"
              type="text"
              value={form.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력해 주세요"
              error={errors.nickname}
            />

            <Input
              label="비밀번호"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="8자 이상 입력해 주세요"
              error={errors.password}
            />

            <Input
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호를 한번 더 입력해 주세요"
              error={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            disabled={!isFormValid}
            role="default"
            variant="primary"
            fullWidth={true}
            className="mt-11 mb-4"
          >
            가입하기
          </Button>

          <GoogleButton onClick={handleGoogleLogin} />
        </form>

        {/* 로그인 링크 */}
        <div className="mt-10 text-center text-[14px] font-[400]">
          <span className="text-white mr-3">이미 최애의포토 회원이신가요?</span>
          <Link
            href="/auth/login"
            className="text-main underline hover:opacity-80"
          >
            로그인하기
          </Link>
        </div>
      </div>
    </main>
  );
}
