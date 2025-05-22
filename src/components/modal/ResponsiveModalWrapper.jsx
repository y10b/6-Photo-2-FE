'use client';

import useMediaQuery from '@/hooks/useMediaQuery';
import DesktopModal from './layout/DesktopModal';
import BottomSheetModal from './layout/BottomSheetModal';
import FullScreenModal from './layout/FullScreenModal';

export default function ResponsiveModalWrapper({
  children,
  onClose,
  variant = 'bottom', // 모바일 전용 바텀시트 or 전체화면 모달
}) {
  const isMobile = useMediaQuery('(max-width: 743px)');
  const isTablet = useMediaQuery('(min-width: 744px) and (max-width: 1199px)');
  const isDesktop = useMediaQuery('(min-width: 1200px)');

  if (isDesktop) {
    return <DesktopModal onClose={onClose}>{children}</DesktopModal>;
  }

  // 모바일인데 전체화면 모달일 경우
  if (variant === 'full' && isMobile) {
    return <FullScreenModal onClose={onClose}>{children}</FullScreenModal>;
  }

  return <BottomSheetModal onClose={onClose}>{children}</BottomSheetModal>;
}
