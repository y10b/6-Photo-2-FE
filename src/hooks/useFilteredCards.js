import { useEffect, useState } from 'react';

export default function useFilteredCards(myCards, search, filter) {
    const [filteredCards, setFilteredCards] = useState([]);
    const [filterCounts, setFilterCounts] = useState({ grade: {}, genre: {} });

    useEffect(() => {
        const counts = { grade: {}, genre: {} };
        const mapped = myCards.map(card => {
            const grade = card.grade ?? card.cardGrade;
            const genre = card.genre ?? card.cardGenre;
            const name = card.name ?? card.title ?? '';

            counts.grade[grade] = (counts.grade[grade] || 0) + 1;
            counts.genre[genre] = (counts.genre[genre] || 0) + 1;

            return {
                userCardId: card.userCardId ?? card.id,
                title: name,
                cardGrade: grade,
                cardGenre: genre,
                nickname: card.nickname ?? card.ownerNickname ?? 'me',
                price: card.price ?? 0,
                quantityLeft: card.remainingQuantity ?? card.quantityLeft ?? 1,
                quantityTotal: card.initialQuantity ?? card.quantityTotal ?? 1,
                imageUrl: card.imageUrl ?? '/images/fallback.png',
                description: card.description ?? '',
                status: card.status ?? 'UNKNOWN',
                type: 'original',
            };
        });

        const filtered = mapped.filter(card => {
            const matchesSearch = card.title.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = !filter.type || !filter.value
                ? true
                : filter.value.split(',').includes(
                    filter.type === 'grade' ? card.cardGrade : card.cardGenre,
                );
            return matchesSearch && matchesFilter;
        });

        setFilteredCards(filtered);
        setFilterCounts(counts);
    }, [myCards, search, filter]);

    return { filteredCards, filterCounts };
}
