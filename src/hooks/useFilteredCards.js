import {useEffect, useState} from 'react';

export default function useFilteredCards(myCards, search, filter) {
  const [filteredCards, setFilteredCards] = useState([]);
  const [filterCounts, setFilterCounts] = useState({grade: {}, genre: {}});

  useEffect(() => {
    const counts = {grade: {}, genre: {}};
    const mapped = myCards.map(card => {
      console.log('매핑할 카드 데이터:', card);
      
      const grade = card.grade ?? card.cardGrade;
      const genre = card.genre ?? card.cardGenre;
      const name = card.name ?? card.title ?? '';
      const userCardId = card.userCardId;
      const photoCardId = card.photoCardId;

      counts.grade[grade] = (counts.grade[grade] || 0) + 1;
      counts.genre[genre] = (counts.genre[genre] || 0) + 1;

      console.log('매핑된 ID 정보:', {
        userCardId,
        photoCardId,
        final: userCardId
      });

      return {
        id: userCardId, // userCardId를 id로 사용
        userCardId: userCardId,
        photoCardId: photoCardId,
        title: name,
        cardGrade: grade,
        cardGenre: genre,
        nickname: card.nickname ?? card.ownerNickname ?? 'me',
        price: card.price ?? 0,
        quantityLeft: card.remainingQuantity ?? card.quantityLeft ?? 1,
        quantityTotal: card.initialQuantity ?? card.quantityTotal ?? 1,
        imageUrl: card.imageUrl ?? '/images/fallback.png',
        description: card.description ?? '',
        status: card.status ?? card.saleStatus ?? 'IDLE',
        type: 'exchange_big',
      };
    });

    const filtered = mapped.filter(card => {
      const matchesSearch = card.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesFilter =
        !filter.type || !filter.value
          ? true
          : filter.value
              .split(',')
              .includes(
                filter.type === 'grade' ? card.cardGrade : card.cardGenre,
              );
      return matchesSearch && matchesFilter;
    });

    setFilteredCards(filtered);
    setFilterCounts(counts);
  }, [myCards, search, filter]);

  return {filteredCards, filterCounts};
}
