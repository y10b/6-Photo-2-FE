export function countFilterValues(cards) {
  const counts = {
    grade: {},
    genre: {},
    method: {sale: 0, exchange: 0},
    soldOut: {},
  };

  cards.forEach(card => {
    // 등급
    counts.grade[card.cardGrade] = (counts.grade[card.cardGrade] || 0) + 1;

    // 장르
    counts.genre[card.cardGenre] = (counts.genre[card.cardGenre] || 0) + 1;

    // 판매 방식
    if (card.saleStatus === 'sale' || card.saleStatus === 'exchange') {
      counts.method[card.saleStatus]++;
    }

    // 매진 여부
    const isSoldOut = card.quantityLeft === 0 ? 'true' : 'false';
    counts.soldOut[isSoldOut] = (counts.soldOut[isSoldOut] || 0) + 1;
  });

  return counts;
}
