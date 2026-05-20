# TODO — my-first-web

## 1단계: 기본 구조 (Ch7~8)

- [x] ARCHITECTURE.md 작성
- [x] copilot-instructions.md 작성
- [x] shadcn/ui 초기화 + 테마 설정
- [x] 헤더/푸터 레이아웃
- [x] 홈 페이지
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 작성

## 2단계: 핵심 기능 (Ch9~10)

- [x] 포스트 목록 페이지
- [ ] 포스트 상세 페이지
- [ ] 포스트 작성 (CRUD)
- [x] 회원가입 구현
- [x] 로그인 구현
- [x] 로그아웃 구현
- [x] Header 로그인 상태 분기
- [x] /posts/new 보호
- [x] npm run build 검증
- [x] Vercel 배포 URL 검증
 
## Ch10 준비 TODO (우선순위)

- [ ] `lib/supabase/client.ts` 존재 및 사용처 확인
- [ ] `contexts/AuthContext.tsx` / `useAuth`가 프로젝트에 통합되어 있는지 검증
- [ ] `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가 (비공개 키는 서버 전용)
- [ ] posts CRUD 구현: API 엔드포인트(`app/api/posts/route.ts`) 및 프론트엔드 폼(`components/NewPostForm.tsx`, `app/posts/[id]/edit`) 확인
- [ ] posts 스키마 컬럼 검증 및 문서 반영(Ch8 기준)
- [ ] RLS 정책(Ch11) 적용 전, 수정/삭제 UI는 프론트엔드로만 노출

## Ch9 과제 TODO

- 회원가입 구현
- 로그인 구현
- 로그아웃 구현
- Header 로그인 상태 분기
- /posts/new 보호
- npm run build 검증
- Vercel 배포 URL 검증

## 3단계: 고급 기능 (Ch11~12)

- [ ] 마이페이지
- [ ] 댓글 기능

## 진행률: 7/12 (58%)

## Ch11 RLS 작업 (설계 단계)

- [ ] RLS 적용 대상 확정: `posts` 테이블의 권한 설계 (`author_id` 또는 `user_id` 대 `auth.uid()`)
- [ ] 마이그레이션 템플릿 준비(정책 SQL은 아직 커밋하지 않음) — `supabase/migrations/`에 남길 계획
- [ ] 프론트엔드 분기 검토: UI는 분기만 수행하고, 권한 검증은 RLS로 보장
- [ ] 배포 체크리스트: `SUPABASE_SERVICE_ROLE_KEY`가 서버 전용인지 재확인

주의: 이 단계에서는 SQL Editor에 직접 정책을 붙여넣지 않습니다. 실제 정책은 마이그레이션 파일로 생성하여 버전 관리를 합니다.