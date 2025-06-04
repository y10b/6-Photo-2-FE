export default function ExchangeInfo({price, cardGenre, cardGrade, type}) {
  const displayPrice = typeof price === 'number' ? price.toLocaleString() : '0';

  return (
    <div className="flex flex-col gap-1">
      {type !== 'exchange_btn2' && (
        <div className="text-lg font-semibold">{displayPrice}원</div>
      )}
      <div className="flex gap-2">
        <Badge variant="secondary">{cardGenre}</Badge>
        <Badge variant="secondary">{cardGrade}</Badge>
      </div>
    </div>
  );
}
