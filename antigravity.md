# antigravity.md

이 프로젝트를 만드는 AI 에이전트가 지킬 규칙. 디자인은 DESIGN.md를 따른다. AI 에이전트는 한국어로 답변할 것. 

## 기술 스택 (고정)
- React + Vite (이미 세팅됨 — 프로젝트 스캐폴딩/초기화 하지 말 것)
- 라우팅: react-router-dom
- 데이터: Supabase (@supabase/supabase-js)

## 환경 변수
- VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 사용.
- 키를 코드에 하드코딩 금지. .env는 커밋하지 말고 .env.example만 커밋.

## 데이터 접근 규칙
- Supabase 클라이언트는 src/lib/supabase.js 한 곳에서만 생성.
- 글 조회: is_published = true + created_at 내림차순. 카테고리는 tag 필터.
- anon key로 읽기만. 글쓰기/삭제/로그인/관리자 기능은 만들지 않는다(글은 Supabase 대시보드에서 직접 입력).
- 네트워크 실패 시 사용자에게 보이는 에러/빈 상태 처리 필수.

## 코드 규칙
- 컴포넌트는 역할 단위로 분리(Cover, FolderShelf, FolderCard, PostCard, Header).
- 표지 카피 등 정적 콘텐츠는 코드에, 글(posts)은 Supabase에서.
- 접근성: 이미지 alt, heading 위계, 키보드 포커스.

## 하지 말 것
- React 프로젝트를 새로 만들지 말 것(이미 있음).
- 글 내용을 더미로 하드코딩하지 말 것.
- 디자인을 임의로 바꾸지 말 것 — 필요하면 먼저 제안하고 확인받기.

## 완료 기준
- Supabase에서 글이 정상적으로 보인다.
- 표지 → 보관함 스크롤 전환이 자연스럽다.
- 카테고리·글 상세 라우팅이 동작한다.
- 라이트/다크 모드, 모바일에서 깨지지 않는다.
- Vercel 배포 후 동일하게 동작한다.