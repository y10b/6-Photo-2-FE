'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useModal} from '@/components/modal/ModalContext';
import {useAuth} from '@/providers/AuthProvider';

export default function OAuthCallback() {
  const router = useRouter();
  const {openModal} = useModal();
  const {getUser} = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      getUser().then(() => {
        router.push('/market');
      });
    } else {
      router.push('/auth/login');
    }
  }, []);

  return null;
}
