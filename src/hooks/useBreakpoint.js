import { useState, useEffect } from 'react';

export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState({
        isMobile: false,
        isTablet: false,
        isPC: false,
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setBreakpoint({
                isMobile: width < 768,
                isTablet: width >= 768 && width < 1280,
                isPC: width >= 1280,
            });
        };

        // 초기 실행
        handleResize();

        // 리사이즈 이벤트 리스너 등록
        window.addEventListener('resize', handleResize);

        // 클린업
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return breakpoint;
} 