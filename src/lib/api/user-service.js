import {tokenFetch} from '@/lib/fetchClient';

export const userService = {
  /**
   * 사용자 정보 가져오기
   */
  getUserInfo: async () => {
    const res = await tokenFetch('/api/users/me');

    if (res) {
      localStorage.setItem('user', JSON.stringify(res));
    }

    return res;
  },

  /**
   * 사용자 정보 업데이트
   */
  updateUserInfo: async userData => {
    const res = await tokenFetch('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {...currentUser, ...res};
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return res;
  },

  /**
   * 포인트 뽑기 쿨타임 확인
   */
  checkPointCooldown: async () => {
    return await tokenFetch('/api/users/me/point/check');
  },

  /**
   * 포인트 뽑기 요청
   */
  drawPoint: async () => {
    return await tokenFetch('/api/users/me/point/draw', {
      method: 'POST',
    });
  },

  /**
   * (개발용) 쿨타임 리셋
   */
  setPointCooldown: async remainSeconds => {
    return await tokenFetch('/api/users/set-point-cooldown', {
      method: 'PATCH',
      body: JSON.stringify({remainSeconds}),
    });
  },
};
