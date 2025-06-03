import {useMemo} from 'react';

export default function useLocalUser() {
  return useMemo(() => {
    if (typeof window === 'undefined') return {id: null, nickname: null};
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : {id: null, nickname: null};
  }, []);
}
