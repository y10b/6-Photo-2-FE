import {getNotification} from '@/lib/api/notificationApi';
import {useQuery} from '@tanstack/react-query';

export const useNotificationQuery = () => {
  const accessToken = localStorage.getItem('accessToken');

  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotification(accessToken),
    enabled: !!accessToken,
  });
};
