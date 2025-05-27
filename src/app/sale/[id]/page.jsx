import CardDetailSection from '@/components/common/CardDetailSection';

function SalePage() {
  const cards = [
    {
      name: '우리집 앞마당',
      grade: 'COMMON',
      genre: 'K-POP',
      imageUrl: '/images/image1.png',
      description: '방탄소년단 포토카드',
      sellerNickname: 'seller123',
      price: 5000,
      remainingQuantity: 10,
      initialQuantity: 20,
    },
  ];

  const exchangeCard = [
    {
      grade: 'RARE',
      genre: '환경',
      description: '안녕하세요',
    },
  ];

  const photoCard = cards[0];

  /* 일단 하드 코딩 방식으로 스타일만 지정 */
  return (
    <div>
      <CardDetailSection
        type="seller"
        photoCard={photoCard}
        exchangeCard={exchangeCard}
      />
    </div>
  );
}

export default SalePage;
