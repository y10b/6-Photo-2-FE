import axiosInstance from './axiosInstance';

// 사용자 정보 가져오기
export const getUserInfo = async () => {
  try {
    const res = await axiosInstance.get('/api/users/me');

    // 사용자 정보 로컬 스토리지에 저장
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
    }

    return res.data;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};

// 사용자 정보 업데이트
export const updateUserInfo = async userData => {
  try {
    const res = await axiosInstance.patch('/api/users/me', userData);

    // 로컬 스토리지의 사용자 정보 업데이트
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {...currentUser, ...res.data};
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return res.data;
  } catch (error) {
    console.error('사용자 정보 업데이트 실패:', error);
    throw error;
  }
};