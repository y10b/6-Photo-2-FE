export const fetchMyCards = async (params = {}) => {
  const {
    filterType = "",
    filterValue = "",
    keyword = "",
    page = 1,
    take = 10,
  } = params;

  try {
    const queryParams = new URLSearchParams();

    if (filterType) queryParams.append("filterType", filterType);
    if (filterValue) queryParams.append("filterValue", filterValue);
    if (keyword) queryParams.append("keyword", keyword);

    queryParams.append("page", page);
    queryParams.append("take", take);

    const url = `http://localhost:5005/mypage/idle-cards?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("포토카드 조회 실패:", error);
    throw error;
  }
};
