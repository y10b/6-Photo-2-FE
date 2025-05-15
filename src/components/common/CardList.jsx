import Card from "@/components/common/Card";

export default function CardList({ cards }) {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 pc:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          type={card.type}
          title={card.title}
          price={card.price}
          imageUrl={card.imageUrl}
          cardGrade={card.cardGrade}
          CardGenre={card.CardGenre}
          nickname={card.nickname}
          quantityLeft={card.quantityLeft}
          quantityTotal={card.quantityTotal}
          description={card.description} // 있을 경우
          saleStatus={card.saleStatus} // for_sale 일 경우
        />
      ))}
    </div>
  );
}
