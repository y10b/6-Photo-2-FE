import { useModal } from '@/components/modal/ModalContext';
import { postPurchase } from '@/lib/api/purchase';
import { useRouter } from 'next/navigation';

export const useBuyerCardHandlers = (card, quantity) => {
    const { openModal, closeModal } = useModal();
    const router = useRouter();

    const handlePurchaseCheck = () => {
        openModal({
            type: 'alert',
            title: '포토카드 구매',
            description: `[${card.grade} | ${card.name}] ${quantity}장을 구매하시겠습니까?`,
            button: {
                label: '구매하기',
                onClick: async () => {
                    try {
                        const accessToken = localStorage.getItem('accessToken');
                        if (!accessToken) {
                            alert('로그인이 필요합니다.');
                            return;
                        }

                        await postPurchase({
                            shopId: card.id,
                            quantity,
                            accessToken,
                        });

                        openModal({
                            type: 'success',
                            title: '구매',
                            result: '성공',
                            description: `[${card.grade} | ${card.name}] ${quantity}장 구매에 성공했습니다!`,
                            button: {
                                label: '마이갤러리에서 확인하기',
                                onClick: () => {
                                    closeModal();
                                    router.push('/my-gallery');
                                },
                            },
                        });
                    } catch (error) {
                        console.error('구매 실패:', error);
                        openModal({
                            type: 'fail',
                            title: '구매',
                            result: '실패',
                            description: `[${card.grade} | ${card.name}] ${quantity}장 구매에 실패했습니다.`,
                            button: {
                                label: '마켓플레이스로 돌아가기',
                                onClick: () => {
                                    closeModal();
                                    router.replace('/market');
                                },
                            },
                        });
                    }
                },
            },
        });
    };

    return { handlePurchaseCheck };
};
