// components/layout/AppInitializer.jsx
'use client';

import {useEffect} from 'react';
import {useModal} from '@/components/modal/ModalContext';
import {useAuth} from '@/providers/AuthProvider';
import {checkPointCooldown} from '@/api/user.api';
import PointDrawModal from '@/components/common/PointDrawModal';

export default function AppInitializer() {
  const {user} = useAuth();
  const {openModal} = useModal();

  useEffect(() => {
    if (!user) return;

    checkPointCooldown().then(data => {
      console.log('쿨타임 확인 결과:', data);
      if (!data.canDraw && data.remainSeconds > 0) {
        setTimeout(() => {
          openModal({
            type: 'point',
            children: <PointDrawModal />,
          });
        }, data.remainSeconds * 1000); // 이게 자동 모달 예약
      } else if (data.canDraw) {
        openModal({
          type: 'point',
          children: <PointDrawModal />,
        });
      }
    });
  }, [user]);

  return null;
}
