// const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/notification`;
const BASE_URL = `http://localhost:5005/api/notification`;

// 알림 조회
export const getNotification = async accessToken => {
  const res = await fetch(`${BASE_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('알림 조회 실패했습니다.');
  }

  const data = await res.json();
  return data;
};

//알림 읽음
export const patchNotification = async id => {
  const res = await fetch(`${BASE_URL}/${id}/read`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('알림을 불러오지 못 했습니다');
  }

  return res.json();
};
