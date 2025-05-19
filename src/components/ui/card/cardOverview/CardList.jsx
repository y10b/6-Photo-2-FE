import Card from "./CardOverview";

export default function CardList({ cards }) {
  return (
    <div>
      {cards.map((card, index) => (
        <Card key={index} card={card} />
      ))}
    </div>
  );
}
