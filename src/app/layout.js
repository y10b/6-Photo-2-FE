import './globals.css';
import { ModalProvider } from '@/components/modal/ModalContext';
import WrapperLayout from '@/components/layout/WrapperLayout';
import AuthProvider from '@/providers/AuthProvider';
import RouteGuard from '@/providers/RouteGuard';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import ModalRenderer from '@/components/modal/ModalRenderer';
import PointModalRenderer from '@/components/modal/PointModalRenderer';

export const metadata = {
  title: '최애의 포토',
  description: '디지털 포토카드를 사고팔고 교환할 수 있는 팬 컬렉터블 플랫폼. K-POP, 스포츠 등 다양한 분야의 포토카드를 거래하며 나만의 디지털 앨범을 완성해보세요. 실시간 거래, 포인트 시스템, 교환 기능, 알림 시스템 등 다양한 기능을 통해 새로운 수집 문화를 경험할 수 있습니다.',
  icons: {
    icon: "/icons/ic_pavicon.svg"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="font-noto">
      <body>
        <ReactQueryProvider>
          <AuthProvider>
            <ModalProvider>
              <RouteGuard>
                <WrapperLayout>
                  <PointModalRenderer /> 
                  <ModalRenderer />
                  {children}
                </WrapperLayout>
              </RouteGuard>
            </ModalProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
