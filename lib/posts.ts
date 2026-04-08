export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "React 19 새 기능 정리",
    content: "React 19에서 달라진 점들을 정리합니다. 주로 성능 개선과 새로운 훅(suspense 관련) 변화에 대해 다룹니다.",
    author: "김코딩",
    date: "2026-03-30",
  },
  {
    id: 2,
    title: "Tailwind CSS 4 변경사항",
    content: "Tailwind CSS 4의 핵심 변경사항과 마이그레이션 포인트를 요약합니다.",
    author: "이디자인",
    date: "2026-03-28",
  },
  {
    id: 3,
    title: "Next.js 16 App Router 가이드",
    content: "Next.js 16의 App Router 사용법과 주요 패턴을 예제로 설명합니다.",
    author: "박개발",
    date: "2026-03-25",
  },
];
