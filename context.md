# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-04-29
- 완료된 작업: 홈 페이지, 헤더/푸터 레이아웃, 포스트 목록, DB 스키마 초안, Supabase 설정 문서
- 진행 중: Supabase 프로젝트 생성 및 연동, 포스트 상세 페이지 (데이터 로딩 미완)
- 미착수: 마이페이지

## 기술 결정 사항

- 인증: Supabase Auth (Email)
- 상태관리: React Context (AuthProvider)
- 이미지: Supabase Storage 사용 예정

## 새로 추가된 항목

- Supabase 초기 마이그레이션 스크립트: `db/001_init.sql`
- 클라이언트 인증 컴포넌트: `components/AuthForm.tsx` (OTP 이메일 방식)
- 로그인 페이지: `app/login/page.tsx`
- 포스트 편집 템플릿: `app/posts/[id]/edit/page.tsx` (플레이스홀더)

## 해결된 이슈

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체

## 변경 파일

- `docs/DB_SCHEMA.md`: Supabase용 DB 스키마 초안 추가
- `docs/SUPABASE_SETUP.md`: Supabase 설정 및 마이그레이션 가이드 추가
- `.env.local.example`: Supabase 환경변수 예시 추가
- `.github/copilot-instructions.md`: 세션 컨텍스트 로드 규칙 추가
- `lib/supabase.ts`: Supabase 클라이언트 래퍼 추가
- `app/api/posts/route.ts`: POST 엔드포인트를 Supabase로 통합(환경변수 없을 때는 스텁 유지)
- `components/NewPostForm.tsx`: 클라이언트 작성 폼 추가
- `app/posts/[id]/page.tsx`: Supabase에서 포스트 로드 시도 로직 추가

## 최근 작업 요약 (2026-04-29)

- `ARCHITECTURE.md` 보강: 페이지 맵에 `/signup` 추가 및 데이터 모델 정리
- `copilot-instructions.md` 생성: 디자인 토큰과 컴포넌트 규칙 명시
- `.env.local` 예시 생성: 로컬 개발용 Supabase 키 자리표시자 추가
- 개발 서버 이슈 해결: 중복 실행 중인 Next dev 프로세스 종료 및 런타임 에러(supabaseUrl missing) 대응

## 다음 단계
- dev 서버 정상화 확인 및 브라우저에서 화면 검증
- Supabase 실제 키를 `.env.local`에 설정하여 통합 테스트 실행
- 와이어프레임(디자인 산출물) 이미지 생성 또는 외부 도구(v0.dev)로 시각화

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용
- Supabase 연동 준비: 로컬 환경에 `.env.local` 또는 배포 환경의 환경변수로 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 설정 필요