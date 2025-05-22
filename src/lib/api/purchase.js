/* 임시 로컬로 */
const BASE_URL = `http://localhost:5005/api`

export async function fetchPurchase(id) {
    const res = await fetch(`${BASE_URL}/purchase/${id}`, {
        next: { revalidate: 0 },
    });

    if (!res.ok) {
        throw new Error("포토카드 정보를 불러올 수 없습니다");
    }

    const result = await res.json();
    return result.data;
}