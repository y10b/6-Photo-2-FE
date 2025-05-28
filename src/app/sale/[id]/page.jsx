import CardDetailSection from '@/components/common/TransactionSection';
import ExchangeSuggest from '@/components/exchange/ExchangeSuggest';

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
  const suggestedCards = [
    {
      type: 'exchange',
      title: '교환 카드',
      price: 0,
      imageUrl: '/images/image1.png',
      cardGrade: 'SUPER_RARE',
      CardGenre: '여행',
      nickname: '카드수집가짱',
      description:
        '이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중 이거슨 설명 이거슨 설명이거슨 설명이거슨 설명 설명 길게 작성중 설명 진짜 길게 작성중',
    },
  ];
  const photoCard = cards[0];

  /* 일단 하드 코딩 방식으로 스타일만 지정 */
  return (
    <div className="mb-30 w-full">
      <CardDetailSection
        type="seller"
        photoCard={photoCard}
        exchangeCard={exchangeCard}
      />
      <ExchangeSuggest cards={suggestedCards} />
    </div>
  );
}

export default SalePage;
