import Card from "./CardOverview";

export default function CardList({ cards, className, onCardClick = () => {} }) {
  return (
    <div className={`${className}`}>
      {cards.map((card, index) => (
        <Card
          key={index}
          card={card}
          onClick={() => onCardClick(card)} 
        />
      ))}
    </div>
  );
}
