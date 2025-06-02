'use client';

import Link from 'next/link';
import Image from 'next/image';
import {AuthInput} from '@/components/ui/input';
import {useModal} from '@/components/modal/ModalContext';
import Button from '@/components/common/Button';
import {useAuth} from '@/providers/AuthProvider';
import GoogleButton from '@/components/common/GoogleButton';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {SignUpSchema} from '@/schemas/signup.schema';

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    mode: 'onChange',
  });

  const {register: registerUser} = useAuth();
  const {openModal} = useModal();
  const router = useRouter();

  const onSubmit = async data => {
    const {confirmPassword, ...sendData} = data; // 제거
    try {
      await registerUser(sendData);

      openModal({
        type: 'alert',
        title: '회원가입 완료',
        description: '회원가입이 완료되었습니다!\n로그인 페이지로 이동합니다.',
        button: {
          label: '확인',
          onClick: () => router.push('/auth/login'),
        },
      });
    } catch (error) {
      openModal({
        type: 'alert',
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
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    window.location.href = `${baseURL}/auth/google`;
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8 w-full">
            <AuthInput
              label="이메일"
              name="email"
              type="email"
              placeholder="이메일을 입력해 주세요"
              {...register('email')}
              error={errors.email?.message}
            />

            <AuthInput
              label="닉네임"
              name="nickname"
              type="text"
              placeholder="닉네임을 입력해 주세요"
              {...register('nickname')}
              error={errors.nickname?.message}
            />

            <AuthInput
              label="비밀번호"
              name="password"
              type="password"
              placeholder="8자 이상 입력해 주세요"
              {...register('password')}
              error={errors.password?.message}
            />

            <AuthInput
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호를 한번 더 입력해 주세요"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            disabled={!isValid}
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
