# Deferred Work

- source_spec: none
  summary: 프로젝트 상세 페이지 8개(/projects/<slug>)와 project-pager, Not found 화면을 mockups/project-ourwish.html 기준으로 구현한다.
  evidence: 2026-10-16 bmad-build 첫 실행에서 '사이트 전체 구현'을 독립 배포 가능한 4개 목표로 나누고, 사용자가 A(사이트 뼈대 + 홈 메인)부터 진행하기로 해 분리함. A의 토큰·컴포넌트·레이아웃에 의존.
- source_spec: none
  summary: 홈 하단 섹션 Experience(Skills tech-chip 펼침·기술 경험 타임라인) · Activities · About(프로필 사진·학력·Awards·연락처 블록)를 EXPERIENCE.md 표 기준으로 구현한다.
  evidence: 2026-10-16 bmad-build 첫 실행에서 '사이트 전체 구현'을 독립 배포 가능한 4개 목표로 나누고, 사용자가 A(사이트 뼈대 + 홈 메인)부터 진행하기로 해 분리함. 시안 없이 스파인 표만으로 구현하는 영역.
- source_spec: none
  summary: 배포·호환 작업으로 레거시 해시 경로(#/about, #/projects/<slug>, #/tech, #/activities) 리다이렉트, 페이지별 title·OG 미리보기, 호스팅 설정을 마무리한다.
  evidence: 2026-10-16 bmad-build 첫 실행에서 '사이트 전체 구현'을 독립 배포 가능한 4개 목표로 나누고, 사용자가 A(사이트 뼈대 + 홈 메인)부터 진행하기로 해 분리함. 기존 지원서 링크 형태(EXPERIENCE.md Open Questions 6)에 따라 범위가 정해짐.
- source_spec: `_bmad-output/implementation-artifacts/spec-portfolio-home-foundation.md`
  summary: 파비콘(과 apple-touch-icon 등 탭 아이콘)을 정해 BaseLayout에 연결한다.
  evidence: 리뷰 BH-5·VQ-10. /favicon.ico가 404라 탭에 기본 아이콘이 보이고 콘솔 오류가 남는다. DESIGN.md가 점-선-점 모티프를 내비·섹션 라벨 외에는 쓰지 못하게 해서 아이콘 디자인은 사용자 결정이 필요하다. 페이지 메타·OG 작업(D)과 함께 처리한다. → 2026-10-16 해결: 사용자 결정으로 primary 둥근 사각형 + 흰 "SJ"(Pretendard 700). `node scripts/og/render-favicon.cjs`로 다시 그린다.
- source_spec: `_bmad-output/implementation-artifacts/spec-portfolio-home-foundation.md`
  summary: 이미 추적 중인 루트 `.DS_Store`를 git 추적에서 빼고(`git rm --cached`), untracked로 남은 18MB `Anseojin Portfolio.html`의 보관 방침을 정한다.
  evidence: 리뷰 BH-14. 새 `.gitignore`에 `.DS_Store`가 있지만 이 작업 전부터 추적 중이라 효과가 없다. 이전 사이트 번들은 실수로 `git add .` 하면 커밋될 수 있다. 둘 다 VCS 정리 작업이라 사용자가 요청할 때 진행한다.
