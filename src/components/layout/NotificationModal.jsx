'use client';

import {getNotification, patchNotification} from '@/lib/api/notificationApi';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useRouter} from 'next/navigation';

const NotificationModal = ({isActive}) => {
  const router = useRouter();
  const accessToken = localStorage.getItem('accessToken');
  const queryClient = useQueryClient();

  const {data, isPending, error} = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotification(accessToken),
    enabled: !!accessToken,
  });

  const {mutate} = useMutation({
    mutationFn: patchNotification,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);

      router.push('/');
    },
    onError: err => {
      console.error('알림 읽음 처리 실패', err);
    },
  });

  const handleClick = (notificationId, relatedShopId) => {
    console.log(notificationId, relatedShopId);
    mutate(notificationId);
  };

  return (
    <>
      {/* 테블릿 & 웹*/}
      <div className="absolute top-[22px] right-0 w-[300px] bg-gray500 z-[10] mobile:hidden tablet:block">
        {isPending ? (
          <div className="p-[20px] bg-[#212121]">불러오는 중...</div>
        ) : error ? (
          <div className="p-[20px] bg-[#212121]">
            알림을 불러오지 못 했습니다.
          </div>
        ) : data?.length === 0 ? (
          <div className="p-[20px] bg-[#212121]">알림이 없습니다.</div>
        ) : (
          data?.slice(0, 5).map(alarm => (
            <div
              key={alarm.id}
              onClick={() => handleClick(alarm.id, alarm.relatedShopId)}
              className={`p-[20px] border-b border-b-gray400 cursor-pointer ${
                alarm.isRead ? '' : 'bg-[#212121]'
              }`}
            >
              <p className="text-[14px]">{alarm.content}</p>
              <p className="text-[12px] text-gray300 mt-[10px]">
                {alarm.formattedTime}
              </p>
            </div>
          ))
        )}
      </div>
      {/* 모바일 */}
      <div className="fixed inset-0 w-full bg-gray500 z-[20] tablet:hidden">
        <div className="flex items-center justify-between h-[60px] px-[20px]">
          <img
            src="/icons/ic_m_close.svg"
            alt="뒤로가기"
            className="cursor-pointer"
            onClick={() => isActive(prev => !prev)}
          />
          <p className="text-[20px] font-baskin">알림</p>
          <p></p>
        </div>
        <section>
          {isPending ? (
            <div className="p-[20px] bg-[#212121]">불러오는 중...</div>
          ) : error ? (
            <div className="p-[20px] bg-[#212121]">
              알림을 불러오지 못 했습니다.
            </div>
          ) : data?.length === 0 ? (
            <div className="p-[20px] bg-[#212121]">알림이 없습니다.</div>
          ) : (
            data.slice(0, 5).map(alarm => (
              <div
                key={alarm.id}
                onClick={() => handleClick(alarm.id, alarm.relatedShopId)}
                className={`p-[20px] border-b border-b-gray400 cursor-pointer ${
                  alarm.isRead ? '' : 'bg-[#212121]'
                }`}
              >
                <p className="text-[14px]">{alarm.content}</p>
                <p className="text-[12px] text-gray300 mt-[10px]">
                  {alarm.formattedTime}
                </p>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
};

export default NotificationModal;
