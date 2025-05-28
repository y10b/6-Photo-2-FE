'use client';

export default function LoadingSpinner({message = '페이지를 로딩중입니다.'}) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
      {/* 타이틀 텍스트 */}
      <div className="flex font-baskin text-white text-7xl font-bold space-x-1 mb-4">
        {'최애의 포토'.split('').map((char, i) => (
          <span
            key={i}
            className={`inline-block animate-bounce ${
              char === '의' ? 'text-main' : ''
            }`}
            style={{animationDelay: `${i * 0.1}s`}}
          >
            {char}
          </span>
        ))}
      </div>

      {/* 서브 메시지 */}
      {message && (
        <p className="text-gray300 text-xl mt-6 tracking-wide flex items-center gap-5 animate-pulse">
          {/* <span className="w-4 h-4 border-2 border-gray300 border-t-transparent rounded-full animate-spin" /> */}
          {message}
        </p>
      )}
    </div>
  );
}
