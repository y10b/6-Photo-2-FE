const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

/**
 * 기본 fetch 클라이언트 - 인증이 필요 없는 일반 요청용
 */

// fetch(url, options)
// defaultFetch(url, options)
export const defaultFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    // Next.js 기본 캐싱 활성화
    cache: 'force-cache',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${baseURL}${url}`, mergedOptions);

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const json = await response.json();
      message = json.message || message;
    } catch { }
    throw new Error(message);
  }

  return response.json();
};

/**
 * 쿠키 인증 fetch 클라이언트 - 쿠키 기반 인증이 필요한 요청용
 */
export const cookieFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    // 쿠키 전송을 위한 설정
    credentials: 'include',
    // 서버 컴포넌트에서도 매번 재검증
    cache: 'no-store',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${baseURL}${url}`, mergedOptions);
  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const json = await response.json();
      message = json.message || message;
    } catch { }
    throw new Error(message);
  }

  return response.json();
};

/**
 * 토큰 인증 fetch 클라이언트 - 헤더에 토큰을 포함하는 요청용
 */
export const tokenFetch = async (url, options = {}) => {
  let accessToken;

  // 클라이언트 사이드인 경우에만 localStorage 접근
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
  }

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    // 페이지 방문마다 재검증 (ISR 패턴)
    next: { revalidate: 60 }, // 60초마다 재검증
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  // URL이 http:// 또는 https://로 시작하면 그대로 사용, 아니면 baseURL 추가
  const fullUrl = url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `${baseURL}${url}`;

  const response = await fetch(fullUrl, mergedOptions);

  if (response.status === 401 && typeof window !== 'undefined') {
    // 토큰 만료 처리 - 리프레시 토큰으로 새 토큰 요청 로직
    // 서버 컴포넌트에서는 이 로직이 실행되지 않음
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshResponse.ok) {
        const { accessToken: newAccessToken } = await refreshResponse.json();
        localStorage.setItem('accessToken', newAccessToken);

        // 새 토큰으로 원래 요청 재시도
        mergedOptions.headers.Authorization = `Bearer ${newAccessToken}`;
        return fetch(`${baseURL}${url}`, mergedOptions).then(res => res.json());
      } else {
        // 리프레시 실패 시 로그아웃
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        throw new Error('Authentication failed');
      }
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  } else if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const json = await response.json();
      message = json.message || message;
    } catch { }
    throw new Error(message);
  }

  return response.json();
};

/**
 * 동적 데이터 fetch 클라이언트 - SSR 없이 클라이언트에서만 사용하는 요청용
 */
export const dynamicFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    // Next.js에게 이 요청은 캐시하지 말라고 지시
    cache: 'no-store',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${baseURL}${url}`, mergedOptions);

  if (!response.ok) {
    let message = `API error: ${response.status}`;
    try {
      const json = await response.json();
      message = json.message || message;
    } catch { }
    throw new Error(message);
  }

  return response.json();
};
