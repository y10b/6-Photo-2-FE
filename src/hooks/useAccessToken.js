export function useAccessToken() {
    if (typeof window === 'undefined') return null; // SSR 방지

    try {
        const token = localStorage.getItem('accessToken');
        return token;
    } catch (error) {
        console.error('accessToken을 가져오는 중 오류 발생:', error);
        return null;
    }
}