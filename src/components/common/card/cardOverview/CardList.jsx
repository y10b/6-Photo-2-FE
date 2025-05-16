import Card from "@/components/common/card/cardOverview/CardOverview";

export default function CardList({ cards }) {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 pc:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </div>
  );
}
