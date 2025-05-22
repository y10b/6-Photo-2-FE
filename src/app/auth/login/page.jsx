'use client';

import Link from 'next/link';
import {useState} from 'react';
import {Input} from '@/components/ui/input';
import {useModal} from '@/components/modal/ModalContext';
import Button from '@/components/common/Button';
import Image from 'next/image';
import GoogleButton from '@/components/common/GoogleButton';
import {useAuth} from '@/providers/AuthProvider';
import {useRouter} from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const {openModal} = useModal();
  const {login} = useAuth();
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

    if (!form.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validate()) return;

    try {
      console.log('로그인 시도:', form);

      const success = await login(form.email, form.password);

      if (success) {
        openModal({ //type, alert로 사용!
          title: '로그인 성공',
          description: '환영합니다!\n마켓페이지로 이동합니다.',
          button: {
            label: '확인',
            onClick: () => {
              router.push('/market');
            },
          },
        });
      } else {
        throw new Error('로그인 실패');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      openModal({
        title: '로그인 실패',
        description: '이메일 또는 비밀번호가\n올바르지 않습니다.',
      });
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google 로그인 시도');
  };

  const isFormValid = form.email && form.password;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-[345px] tablet:max-w-[440px] pc:max-w-[520px]">
        {/* 로고 */}
        <div className="flex justify-center mb-20">
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

        {/* 로그인 폼 */}
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
              label="비밀번호"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력해 주세요"
              error={errors.password}
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
            로그인
          </Button>

          <GoogleButton onClick={handleGoogleLogin} />
        </form>

        {/* 회원가입 링크 */}
        <div className="mt-11 text-center text-[14px] font-[400] pc:text-[16px]">
          <span className="text-white mr-3">최애의 포토가 처음이신가요?</span>
          <Link
            href="/auth/signup"
            className="text-main underline hover:opacity-80"
          >
            회원가입하기
          </Link>
        </div>
      </div>
    </main>
  );
}
