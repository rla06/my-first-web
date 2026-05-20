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

## Ch11 준비 TODO (RLS)

- [ ] Supabase CLI 마이그레이션으로 RLS 정책 추가: `posts` 테이블의 `user_id`(또는 `author_id`)와 `auth.uid()` 기준 정책 작성
- [ ] 절대 콘솔 SQL Editor에서 영구 정책만 직접 적용하지 않도록 주의(모든 변경은 마이그레이션으로 남김)
- [ ] `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트 코드나 환경에 노출되지 않도록 검증
- [ ] `posts.user_id` 컬럼 존재 여부 확인 및 필요 시 마이그레이션 계획 수립(데이터 이전 고려)
- [ ] RLS 적용 후 프론트엔드에서 보이는 분기(버튼/메뉴)는 UX용임을 문서화

## Ch11 마무리 TODO

- [x] posts RLS 마이그레이션 생성
- [ ] `npx supabase db push`로 원격 적용
- [ ] 다른 계정 우회 테스트(사용자 B가 A 글 수정/삭제 시도)
- [ ] 보안 키 노출 grep(`service_role`, `sb_secret_`, `sbp_` 등)
- [ ] 빌드/배포 검증(npm run build, 배포 확인)


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