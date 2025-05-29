import Card from "./CardOverview";

export default function CardList({ cards, className, onCardClick }) {
  return (
    <div className={`${className}`}>
      {cards.map((card, index) => (
        <Card key={card.id || index} card={card} onCardClick={onCardClick} />
      ))}
    </div>
  );
}