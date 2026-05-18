# Supabase 설정 가이드

이 가이드는 프로젝트에 Supabase를 연동하고 `docs/DB_SCHEMA.md`에 있는 스키마를 적용하는 단계별 안내입니다.

## 1. 사전 준비
- Supabase 계정 생성(https://app.supabase.com)
- 로컬에 `supabase` CLI 설치 (권장)

```bash
# Homebrew (macOS) 예시
brew install supabase/tap/supabase

# npm (모든 플랫폼)
npm install -g supabase
```

## 2. Supabase 프로젝트 생성
1. 웹 대시보드에서 새 프로젝트 생성
2. DB 비밀번호와 리전에 유의

또는 CLI로 로컬에서 연결할 수 있지만, 프로젝트 생성은 대시보드가 간편합니다.

## 3. 로컬 환경 설정
- 프로젝트 루트에 `.env.local`을 생성하여 다음 값을 설정하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key  # 서버 전용
```

- Vercel 등 배포 환경에도 위 변수들을 설정하세요.

## 4. 스키마 적용
- 빠르게 적용하려면 Supabase 대시보드 -> SQL Editor에 `docs/DB_SCHEMA.md`의 SQL을 붙여넣고 실행하세요.
- 마이그레이션 관리 방법(권장): `supabase` CLI의 migrations 기능 사용

```bash
# supabase 로그인
supabase login

# 프로젝트에 연결 (로컬에서 작업 시)
supabase link --project-ref your-project-ref

# 마이그레이션 생성
supabase migration new init_schema
# 생성된 파일에 docs/DB_SCHEMA.md의 SQL을 옮겨 적음

# 마이그레이션 적용
supabase db push
```

### 로컬에서 SQL 파일로 바로 적용하는 간단 방법

프로젝트 루트에 `db/001_init.sql` 파일이 있습니다. CLI가 설치되어 있고 프로젝트가 `supabase link`로 연결된 상태라면 아래처럼 실행할 수 있습니다.

```bash
# supabase가 프로젝트에 링크되어 있다고 가정
supabase db remote set <DB_CONNECTION_STRING>  # 필요 시
psql "postgres://postgres:password@db-host:5432/postgres" -f db/001_init.sql
```

대부분은 Supabase 대시보드의 SQL Editor에 `db/001_init.sql` 내용을 붙여넣고 실행하는 것이 가장 쉽습니다.


## 5. RLS(보안 정책)
- RLS(행 수준 보안)를 활성화하고, 인증된 사용자만 작성/수정 가능하도록 정책을 추가하세요.
- 예: `posts` 테이블은 `published = true`면 공개 읽기 허용, 작성/수정은 `auth.uid() = author_id`로 제한

## 6. Next.js와 연동
- `@supabase/supabase-js` 설치

```bash
npm install @supabase/supabase-js
```

- 서버/클라이언트 환경에 따라 클라이언트 인스턴스 생성 예시를 `lib/supabase.ts`로 추가하세요 (서버 전용 키 사용 금지).

## 추가 참고
- 배포 전 `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용으로만 사용하세요.
- 이미지 업로드는 Supabase Storage 사용을 권장합니다.

---
더 도와드릴까요? 예: `lib/supabase.ts` 클라이언트 구현 또는 마이그레이션 파일 생성 지원을 해드릴게요.