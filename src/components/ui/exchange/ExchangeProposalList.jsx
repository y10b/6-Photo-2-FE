// components/exchange/ExchangeProposalList.jsx
import CardList from "@/components/card/CardList";

export default function ExchangeProposalList({ exchangeCards }) {
  if (exchangeCards.length === 0) {
    return (
      <p className="text-gray300 text-center py-10">
        아직 들어온 교환 제안이 없습니다.
      </p>
    );
  }

  const cardsWithType = exchangeCards.map((card) => ({
    ...card,
    type: "exchange", // 승인/거절 버튼을 보여주기 위한 type 설정
  }));

  return <CardList cards={cardsWithType} />;
}
