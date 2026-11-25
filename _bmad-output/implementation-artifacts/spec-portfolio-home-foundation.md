---
title: '포트폴리오 사이트 뼈대 + 홈 메인(히어로 · Work · Contact band)'
type: 'feature'
created: '2026-10-16'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'e09a48931534fba7632fb458162dfeef2c83fe0f'
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-anseojin-portfolio-2026-10-16/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-anseojin-portfolio-2026-10-16/EXPERIENCE.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-anseojin-portfolio-2026-10-16/mockups/home.html'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 현행 포트폴리오는 탭형 번들 HTML이라 첫 화면에 정체성과 증거가 보이지 않고, 프로젝트가 탭 뒤에 숨어 있다. 확정된 UX 스파인과 승인된 홈 목업은 있지만 실제 사이트 코드는 아직 없다.

**Approach:** 저장소 루트에 정적 사이트 프로젝트를 세운다. DESIGN.md 토큰, 공용 컴포넌트, 레이아웃을 만들고 홈 첫 구간(내비 + 섹션 진행 바, 히어로, Work 카드 8개, Contact band, toast)과 모션 4종을 스파인대로 구현한다. 이후의 상세 페이지, 홈 하단 섹션, 배포 작업은 이 뼈대를 그대로 재사용한다.

**Decisions (사용자, 2026-10-16):**
- 스택은 Astro + TypeScript, 스타일은 CSS custom properties로 한다(Tailwind는 쓰지 않는다).
- DevOops 카드 기간은 "2025.04 – 2025.10"이다(PDF p17 상세 기준).
- NEW:LEARN 카드 스택은 스파인 가정대로 "React · TypeScript · SEED Design · D3.js"이다.
- 스펙 분량이 권장치를 넘지만(약 3,300토큰) 나누지 않고 그대로 진행한다.

## Boundaries & Constraints

**Always:**
- 스파인(DESIGN.md · EXPERIENCE.md)이 목업보다 우선한다. 색·타입·간격·반경·그림자는 DESIGN.md 토큰(CSS custom properties)으로만 쓴다.
- 히어로와 카드의 문구·수치는 EXPERIENCE.md 표를 그대로 쓰고, 수치를 지어내지 않는다.
- 점진적 향상을 따른다. 모든 콘텐츠는 JS 없이도 보여야 하고, 리빌용 숨김은 JS가 클래스를 붙였을 때만 적용한다. 모션은 Interaction Primitives 표를 따르고(1초 이하, 1회), 모션 감소 설정에서는 감소 열을 적용한다.
- 외부 링크는 새 탭으로 열고 ↗와 스크린리더용 "(새 창)"을 붙인다. 내부 링크는 base 경로를 거쳐 만든다(하위 경로 호스팅 대비).
- 루트의 `anseojin-portfolio.pdf`는 제자리에 둔다(README raw 링크가 가리킴). 빌드할 때 사이트로 복사해 `download` 링크로 제공한다.

**Never:**
- 상세 페이지·Not found, Experience/Activities/About 섹션, 레거시 해시 리다이렉트·OG·호스팅은 이번 범위가 아니다(deferred-work.md B·C·D). 카드 링크(`/projects/<slug>`)와 내비 앵커(#experience · #activities · #about)는 대상이 아직 없어도 그대로 둔다.
- 목업 전용 요소(`.anno-*`, `--anno`, `.is-state`, 고정된 progress 폭·aria-current, 리뷰 주석)는 옮기지 않는다.
- 기술 필터 버튼, 두 번째 액센트 색, 그라데이션(키워드 밑줄 띠 제외), 금지 목록에 있는 모션은 쓰지 않는다.
- `README.md`, `_bmad*/`, `.claude/`, 기획 산출물은 수정하지 않는다. 커밋·푸시는 사용자가 요청할 때만 한다.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| 첫 화면 | 1440×900 | h1(키워드 3개는 primary + 밑줄 띠), proof-chip 2개, 기둥 3개. 하단에 WORK 라벨과 NEW:LEARN·FINCH 카드 윗부분 | N/A |
| 카드 그리드 | 홈 로드 | 8개 최신순, 2열×4행 같은 높이, 슬롯 위치 정렬, 수상 없는 카드는 배지 자리를 비움 | N/A |
| JS 꺼짐 | JavaScript 비활성 | 모든 텍스트·카드가 보이고 metric은 최종값, 앵커는 일반 링크로 동작 | N/A |
| 모션 감소 | `prefers-reduced-motion: reduce` | 리빌·카운트업·카드 이동/확대 없음, 테두리·그림자만 | N/A |
| 복사 성공 | "이메일 복사" 클릭 | toast "이메일 주소를 복사했어요." 2.5초, `role=status`, 포커스 유지 | N/A |
| 복사 실패 | 클립보드 권한 거부 | 주소 텍스트를 선택 상태로 둠 | toast "복사하지 못했어요. 선택된 주소를 직접 복사해 주세요." |
| 이미지 실패 | 카드 이미지 404 | 16:10 프레임 유지, 가운데에 프로젝트명(caption · ink-secondary), alt 유지 | 레이아웃 이동 없음 |
| 좁은 화면 | 폭 375 / 320px | 1열, display-mobile. "메뉴" 패널은 Esc·바깥 클릭·링크로 닫히고 포커스가 버튼으로 돌아옴. 열린 동안 본문 스크롤 잠금. 가로 스크롤 없음 | N/A |
| 앵커 딥링크 | `/#work` 직접 진입 | nav 높이만큼 띄워 이동, 활성 내비 동기화 | 대상이 없는 앵커는 스크롤 스파이가 무시 |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/ux-designs/ux-anseojin-portfolio-2026-10-16/mockups/home.html` -- 승인된 시각 기준. :root 색 토큰 17개(DESIGN.md 이름 그대로), 히어로 8+4 그리드, 카드 마크업을 재사용한다. 스크립트, 미디어 쿼리, skip link, focus 스타일은 목업에 없으니 새로 만든다. 스파인과 다른 부분은 스파인으로 맞춘다: 기둥 제목은 h3가 아닌 강조 텍스트, 두 번째 칩은 `/projects/msp`, 전화번호는 `tel:` 링크, PDF는 `button-secondary` "포트폴리오 PDF 받기 (약 15MB)", 내비 테두리는 스크롤한 뒤에만, 로고 20px, 모티프는 6px 사각형·1.5px 선·폭 24px·간격 8px, 섹션 간격 160px, 카드 패딩 32px에 배지 자리 예약, MSP 라벨 "월 조회수(2025.03)".
- `…/mockups/img/` -- 카드 이미지: newlearn-timeline.png(NEW:LEARN), bf967772.png + a388dcf3.png(FINCH 기기 화면 2장), 46946496.jpg(방긋), cc881bec.jpg(OURWISH), 91621dc5.jpg(Boogle, 세로형), 7df56994.jpg(Moa), b5583697.png(DevOops), 2bf9f4b9.png(MSP, 943KB). alt는 목업 문구를 재사용한다.
- `…/mockups/home-fold.png`, `home-full.png` -- 시각 비교 기준.
- Pretendard: `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css`
- 연락처(PDF p2): seojini00@naver.com · 010-5465-2165 · https://github.com/xxj15 · https://velog.io/@xxj15/posts
- 도구: node 24 / npm 11. Playwright는 브라우저를 내려받지 않고 설치된 Edge(`channel: 'msedge'`)를 쓴다.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` -- Astro 최신 안정판 + TS strict, npm 스크립트 dev/build/preview/check/test, predev·prebuild에서 PDF 복사. gitignore에는 node_modules, dist, .astro, public/anseojin-portfolio.pdf, test-results -- 뼈대
- [x] `scripts/copy-pdf.mjs` -- 루트 PDF를 `public/`으로 복사 -- 원본 위치 유지
- [x] `src/styles/tokens.css`, `src/styles/global.css` -- DESIGN.md 토큰 전부와 기본 규칙(keep-all, `color-scheme: light`, focus-visible 링, scroll-padding-top, reduced-motion) -- 이후 작업 공용
- [x] `src/data/projects.ts`, `src/data/site.ts`, `src/assets/projects/*` -- 프로젝트 8개(slug·기간·수상/진행 중·한 줄·역할·성과·스택·이미지/alt), 히어로·칩·기둥·연락처 데이터. 이미지 9장은 의미 있는 이름으로 복사 -- 콘텐츠의 단일 출처(B·C에서 재사용)
- [x] `src/layouts/BaseLayout.astro`, `src/components/{Nav,SectionLabel,Hero,ProjectCard,MetricStat,ContactBand,Toast}.astro` -- DESIGN.md Components와 EXPERIENCE.md Component Patterns를 따름 -- 재사용 컴포넌트
- [x] `src/scripts/*.ts` -- 리빌, 카운트업, 진행 바 + 스크롤 스파이, 모바일 메뉴, 복사 + toast, 이미지 실패 대체 -- 서로 독립적이며, 실패해도 콘텐츠에 영향 없음
- [x] `src/pages/index.astro` -- 내비 → 히어로 → Work → Contact band 조립, 고유한 `<title>`·description
- [x] `playwright.config.ts`, `tests/home.spec.ts` -- I/O 매트릭스 시나리오 전부와 아래 AC를 preview 서버 대상으로 자동 검증

**Acceptance Criteria:**
- Given 키보드 사용자, when 첫 Tab을 누르면, then "본문으로 건너뛰기"가 보이고, 이후 Tab 순서가 읽기 순서와 같으며, 모든 상호작용 요소에 2px 포커스 링이 sticky 내비에 가리지 않고 보인다.
- Given 홈, when 문서 구조를 읽으면, then header/nav/main/footer 랜드마크, h1 1개, h2 섹션 제목, `lang="ko"`, 활성 내비의 `aria-current="location"`, 메뉴 버튼의 `aria-expanded`·`aria-controls`가 있다.
- Given metric 카드가 50% 보이면, then 1회 카운트업하고, DOM 텍스트는 처음부터 최종값이며, 애니메이션 레이어는 `aria-hidden`이다.
- Given hover 가능한 기기, when 카드에 hover 또는 focus-visible, then 미디어가 1.04배 확대되고 카드가 −4px 올라가며 테두리가 strong으로 바뀌고 hover 그림자가 생긴다(240ms). hover가 없는 기기에서는 hover 효과가 없다.

## Implementation Notes

- 2026-10-16 구현(서브에이전트 1회 디스패치). 버전: Astro 7.4, TypeScript 6.0(strict), @playwright/test 1.64(설치된 Edge `channel: 'msedge'`). 커밋하지 않음.
- 추가한 공용 모듈: `src/lib/paths.ts`(`withBase`, `projectPath` — 내부 링크는 모두 이걸 거침), `src/data/types.ts`(조각 텍스트 `RichText`), `src/components/{Icon,Motif,RichText}.astro`. `ASTRO_BASE` 환경 변수로 base 경로를 바꿀 수 있다(하위 경로 빌드 시 내부 링크 31개 모두 base 적용을 확인함).
- 스파인이 정하지 않았거나 서로 부딪힌 지점에서 정한 것:
  - 섹션 간격 160px은 Contact band 위에만 쓴다. 히어로와 Work 사이는 승인 목업 간격(히어로 하단 32px + Work 상단 32px)을 유지했다. 160px을 쓰면 첫 화면에 카드 윗부분이 보여야 한다는 요구(I/O 매트릭스 첫 화면)를 지킬 수 없다. 1440×900에서 첫 행 카드는 y≈798부터 시작한다(목업은 806).
  - Contact band의 "이메일 복사"와 PDF 버튼은 둘 다 `button-secondary`로 했다. DESIGN.md에 어두운 띠용 고스트 버튼이 없기 때문이다.
  - 토큰에 없는 목업 수치는 가장 가까운 토큰으로 바꿨다. 이메일 크기는 32px 대신 headline-mobile(26px)이고, 모바일에서는 title-lg를 쓴다.
  - 어두운 띠 위에서도 toast의 윤곽이 보이도록 ink-on-inverse 16% 테두리를 더했다.
  - JS가 없으면 이메일 복사 버튼과 메뉴 버튼을 숨기고, 768px 미만에서는 내비 앵커 4개를 내비 안에서 가로로 넘겨 보게 한다.
  - 로고는 `/#top`으로 이동한다(새로고침 없이 최상단으로).
  - 폴백 폰트는 Malgun Gothic에 size-adjust 89.6%를 줬다(Edge에서 실측). 이 보정은 Windows에서만 적용된다.
- 구현 중 고친 문제:
  - 모바일 메뉴의 링크로 닫을 때 Chromium이 앵커 이동 중에 포커스를 비워 버린다. 그래서 같은 문서의 앵커는 스크립트가 직접 이동시키고 포커스를 버튼으로 돌린다.
  - 리빌 전인 카드에 Tab으로 들어가면 포커스 링이 내비 밑으로 들어갔다. 이제 포커스를 받으면 즉시 리빌하고 다음 프레임에 위치를 다시 맞춘다.
- 알려진 위험:
  - 앵커의 부드러운 스크롤은 브라우저 기본 `scroll-behavior`에 맡긴다. Edge 실측 300–600ms이고, 600ms 상한을 코드로 강제하지는 않는다.
  - 폭 768–930px에서 MoonSunPower의 긴 수상명이 두 줄로 바뀌어 그 행의 한 줄 슬롯 위치가 어긋난다. 데스크톱 정렬만 테스트로 확인했다.
  - Astro 7은 preview 서버를 하나만 허용하므로 다른 preview가 떠 있으면 `npm test`가 실패한다.
  - Pretendard는 jsDelivr CDN에서 불러오므로 오프라인이면 시스템 폰트로 보인다.
- 리뷰 1회차 패치 P1–P22를 같은 구현 서브에이전트가 반영했다. 재검증 결과는 `npm run check` 오류 0, `npm run build` 성공, `npm test` 24/24 통과(새 테스트: 스크롤 리빌, 하위 경로 빌드).
  - 반응형 화면 재비교(서브에이전트, 1440·1024·768·375·320) 결과, 요청한 9개 항목이 모두 고쳐졌다. 1440 첫 화면은 이전 빌드와 같다. 가로 넘침은 없고, 콘솔 오류는 파비콘 404(D1)뿐이다.
  - 남은 low 항목(받아들임):
    - 768–959px: 배지 자리를 두 줄 높이로 고정해 배지가 없는 행(Boogle·Moa)에 약 21px 빈 공간이 늘었다. 행 정렬과 맞바꾼 결과다.
    - 1024px 3행(Boogle 스택 두 줄)과 768px 1행(NEW:LEARN 성과 두 줄)에서 성과 구분선이 10–21px 어긋난다(EC-7과 같은 종류).
    - 1024px 기둥 02의 "관련" 줄이 두 줄이다(VQ-14).
    - 320px에서 h1이 6줄이고 버튼 폭이 서로 다르다(VQ-22·25).
    - 1열에서는 카드 높이를 같게 맞추므로 짧은 카드에 빈 공간이 생긴다(스펙 규칙).

## Spec Change Log

## Review Triage Log

리뷰 1회차(2026-10-16). 출처: VG = verification-gap, BH = blind-hunter, EC = edge-case-hunter, VQ = step-03 화면 비교 서브에이전트. 처리 열의 P·D 번호는 아래 묶음을 가리킨다.

| # | 위치 | 주장 | 판정 | 근거 | 처리 |
|---|---|---|---|---|---|
| VG-1 | `tests/home.spec.ts`, `src/scripts/reveal.ts` | JS 켜짐에서 스크롤 리빌·히어로 줄 리빌을 확인하는 테스트가 없음 | medium | 사전 검증된 공백 보고. 최종 상태만 보는 assert라 `initReveal`이 일찍 끝나도 전부 통과함 | patch P1 |
| VG-2 | `tests/home.spec.ts` | JS 꺼짐에서 "이메일 복사" 숨김을 확인하지 않음 | low | 사전 검증. 메뉴 버튼만 확인함(:254). 고치는 건 assert 한 줄 | patch P2 |
| VG-3 | `src/lib/paths.ts`, 테스트 | `ASTRO_BASE` 하위 경로 링크가 자동 검증되지 않음 | medium | 사전 검증. base `/`에서는 `withBase`가 깨져도 출력이 같음. 깃허브 Pages 하위 경로 배포 가능성이 높음 | patch P3 |
| VG-4 | `scripts/copy-pdf.mjs`, 테스트 | PDF 검사가 gitignore된 남은 사본으로도 통과함 | low | 사전 검증. HEAD 200만 확인하고 크기는 비교하지 않음 | patch P4 |
| VG-5 | `src/scripts/countup.ts:47-58` | 인쇄 후 아직 안 본 metric이 보이면 카운트업이 최종값 위에 겹침 | low | `finishAll`이 observer를 끊지 않고, 콜백도 `countupDone`을 보지 않음. 고치는 건 한 줄 | patch P5 |
| VG-6 | `playwright.config.ts:28` | 4322에 서버가 떠 있으면 빌드 없이 옛 결과물을 테스트함 | low | `reuseExistingServer: !CI`이고 CI가 없음. 고치는 건 값 하나 | patch P6 |
| BH-1 | `src/components/Nav.astro` | 진행 바가 활성 내비 밑줄을 덮어 활성 표시가 사라짐 | medium | 밑줄(`bottom: -10px`)과 진행 바(`bottom: 0`, z-index 1)가 둘 다 헤더 맨 아래 62–64px에 같은 색으로 겹침 | patch P7 |
| BH-2 | `src/components/ProjectCard.astro` | 카드 링크 이름이 카드 전체 텍스트 | medium | `<a>`에 aria-labelledby가 없어 alt·기간·이름·한 줄·역할·성과·스택이 모두 이름이 됨 | patch P8 |
| BH-3 | `src/components/Hero.astro` | `ol.pillars`에 `role="list"`가 없음 | low | 다른 두 목록에는 있음. `list-style: none`인 Safari는 목록 의미를 버림. 고치는 건 속성 하나 | patch P9 |
| BH-4 | Hero 눈썹, 영문 라벨 | 눈썹이 "안서진FRONTEND"로 붙어 읽히고 영문 라벨에 lang이 없음 | low | 점 span이 aria-hidden이고 앞뒤 공백 텍스트가 없음. 전체에 `lang="en"`이 0개 | patch P10 |
| BH-5 | `BaseLayout.astro` | 파비콘 없음(/favicon.ico 404) | low | 실제로 없음. 다만 아이콘 디자인이 필요하고, 모티프는 내비·라벨 외 사용 금지(DESIGN.md)라 브랜드 결정이 필요함. 페이지 메타·OG와 함께 D로 넘김 | defer D1 |
| BH-6 | `BaseLayout.astro` | Pretendard CSS가 렌더 차단 | medium | head의 일반 stylesheet라 CDN 응답 전까지 첫 페인트가 막힘. 사내망 페르소나(Flow 2)와 "텍스트 즉시 렌더링" 규칙에 어긋남 | patch P11 |
| BH-7 | `src/data/site.ts`, `types.ts` | `toPlainText` 미사용, 메타 문구와 GitHub URL 중복 | low | `toPlainText`는 B에서 쓸 공용 유틸이라 피해 없음. 메타 파생은 구조 변경이라 거절. GitHub URL 중복만 직접 수정 | patch P12(URL만) |
| BH-8 | `src/data/site.ts` | PDF 용량 "(약 15MB)" 하드코딩 | low | 실제로 하드코딩됨. 다만 "약" 표기이고 용량이 크게 바뀔 때만 틀리며, 빌드 시 계산은 복잡도를 더함 | 거절 |
| BH-9 | `src/data/projects.ts` | NEW:LEARN "진행 중"이 만료돼도 감지 못 함 | low | 현재 값은 정확함. 11/18 이후 갱신은 스펙 규칙(Status pill)과 메모로 추적하는 콘텐츠 작업이고, 빌드 경고는 복잡도 추가 | 거절 |
| BH-10 | 테스트 | 하위 경로 hosting이 수동 확인뿐 | medium | VG-3과 같은 원인 | patch P3 |
| BH-11 | `playwright.config.ts` | 768–1023px와 비Chromium이 테스트되지 않음 | low | 태블릿 결함 자체는 P14·P16으로 고침. WebKit·Firefox는 브라우저를 내려받아야 해서 환경 밖 | 거절 |
| BH-12 | `Hero.astro` | 히어로 리빌이 900ms 예산을 꽉 채우는데 상한 검증이 없음 | low | 지금은 7×60+480=900ms로 규칙을 지킴. 줄이 늘면 깨지므로 P1 테스트에 상한 assert를 넣음 | patch P1 |
| BH-13 | `src/scripts/menu.ts` | 바깥 클릭 시 포커스가 무조건 버튼으로 감, iOS에서 document click 누락 | false | 포커스 복귀는 EXPERIENCE.md Nav bar가 "바깥 클릭으로 닫히고, 닫히면 포커스가 버튼으로 돌아온다"고 명시함. iOS 부분은 여기서 확인할 수 없고(maybe-false), 맞더라도 low | 거절 |
| BH-14 | 저장소 | `.DS_Store`가 이미 추적됨, 18MB HTML이 untracked | low | 이 작업 전부터 있던 상태. untracked HTML은 사용자 파일 | defer D2 |
| BH-15 | 전역 CSS | 강제 색상 모드에서 진행 바·밑줄·배지 바탕이 사라짐 | low | 실제로 background만 씀. 다만 사용 빈도가 낮고 별도 미디어 쿼리 규칙을 더해야 함. 접근성 기준(스펙)에 없는 항목 | 거절 |
| EC-1 | `countup.ts:47-58` | 인쇄 후 카운트업 겹침 | low | VG-5와 같은 결함 | patch P5 |
| EC-2 | `MetricStat.astro:58-60` | beforeprint 없는 인쇄나 도중에 모션 감소를 켜면 0이 보임 | low | 현행 브라우저는 모두 beforeprint를 보내고, 설정을 도중에 바꾸는 경우는 드묾. CSS 블록을 더해야 함 | 거절 |
| EC-3 | `src/scripts/reveal.ts:34-55` | 뷰포트 높이 약 1,930px 이상이면 연락처 행이 영구 투명 | medium | 최대 스크롤에서 dl 위쪽이 vh−289px이라 vh ≥ 1,927이면 하단 15% 선을 넘지 못함. 큰 모니터나 축소 보기에서 실제로 발생 | patch P13 |
| EC-4 | `reveal.ts:65-76` | 마우스 포커스에도 카드 가운데로 스크롤 점프 | low | 리빌 중인(480ms) 카드를 Ctrl+클릭할 때만 일어나고, 가드를 더해야 함 | 거절 |
| EC-5 | `ProjectCard.astro:53-60` | 진행 중과 수상이 함께 있으면 수상이 빠짐 | false | 현재 데이터에 둘 다 가진 프로젝트가 없고, 그런 데이터를 만드는 호출도 없음 | 거절 |
| EC-6 | `ProjectCard.astro:196-221` | 768–약 960px에서 배지가 두 줄인 카드만 슬롯이 높아져 같은 행 한 줄 위치가 어긋남 | medium | VQ 측정에서 배지 자리 높이가 29·29·50·50·29·29·29·50이고, 4행(DevOops 29 / MSP 50)이 어긋남. 스펙 슬롯 규칙 위반 | patch P14 |
| EC-7 | `ProjectCard.astro:267-275` | 태블릿에서 성과 문장이 두 줄이면 구분선 위치가 어긋남 | low | 실제로 10px 안팎 어긋남. PC 우선 범위 밖 폭이고, 슬롯별 높이 규칙을 여러 개 더해야 함 | 거절 |
| EC-8 | `src/pages/index.astro:77,94-96` | 1열에서 `1fr`로 모든 카드가 가장 긴 카드 높이로 늘어남 | false | 스펙이 "카드 높이는 모두 같게 맞추고(가장 긴 카드 기준)"라고 요구함 | 거절 |
| EC-9 | `BaseLayout.astro:25-27` | 인라인 스크립트는 돌고 모듈만 실패하면 메뉴·복사 버튼이 동작하지 않음 | low | 그 경우 실제로 그렇다. 다만 드물고, 준비 클래스로 바꾸면 모든 모바일 로드에서 내비가 깜빡임 | 거절 |
| EC-10 | `ProjectCard.astro:31` | 카드 8개와 칩이 404로 감 | false | frozen Never가 "대상이 아직 없어도 그대로 둔다"고 정함. 의도된 범위 밖 | 거절 |
| EC-11 | `playwright.config.ts:28` | 옛 서버 재사용 | low | VG-6과 같은 결함 | patch P6 |
| EC-12 | `playwright.config.ts:25-32` | 셸에 `ASTRO_BASE`가 있으면 assert가 실패함 | false | 테스트가 조용히 통과하는 게 아니라 크게 실패하므로 올바른 동작 | 거절 |
| EC-13 | `scripts/copy-pdf.mjs:14` | 크기가 같고 mtime이 더 오래된 원본이면 낡은 사본이 남음 | low | 조건이 드물지만 비교 자체를 없애면(항상 복사, 15MB) 직접 해결됨 | patch P4 |
| EC-14 | `src/lib/format.ts:2-6` | 소수 metric이 반올림됨 | false | 현재 metric 4개는 모두 정수이고 소수를 넘기는 호출이 없음 | 거절 |
| EC-15 | `src/scripts/menu.ts:82-87` | 메뉴 스크립트가 실패하면 모바일 내비를 잃음 | low | EC-9와 같은 근거 | 거절 |
| EC-16 | `Nav.astro:197-201` | JS 없는 모바일 내비에서 첫·끝 링크 포커스 링이 잘림 | low | `overflow-x: auto`에 안쪽 여백이 0이라 링 4px가 잘림. 고치는 건 CSS 여백 한 줄 | patch P15 |
| VQ-1 | `Hero.astro` 1440 | 눈썹·h1·칩이 목업보다 4–8px 아래 | false | 목업의 28·20px가 간격 토큰에 없어 가장 가까운 토큰을 씀(스파인 우선) | 거절 |
| VQ-2 | `Hero.astro` 1440 | 히어로 아래가 16px 촘촘함 | false | 같은 이유(56·20·72px는 토큰이 아님). 첫 화면 카드 노출은 오히려 늘어남 | 거절 |
| VQ-3 | `Nav.astro` 1440 | 내비 링크 16px(목업 15px) | false | 15px는 타입 토큰이 아니고 body 16px을 씀 | 거절 |
| VQ-4 | `ContactBand.astro` 1440 | 간격·이메일 굵기가 목업과 다름 | false | headline-mobile 토큰(700, −0.01em)과 간격 토큰을 그대로 쓴 결과 | 거절 |
| VQ-5 | 배지 1440 | 배지 높이 29px(목업 28px) | false | caption 토큰 높이와 간격 토큰으로 계산된 값 | 거절 |
| VQ-6 | proof-chip 1440 | 왼쪽 패딩 12px(목업 14px) | false | 14px는 간격 토큰이 아님 | 거절 |
| VQ-7 | `MetricStat.astro` | 단위가 2px 더 오른쪽 | false | 간격 토큰 4px | 거절 |
| VQ-8 | 카드 성과 블록 | 높이 110px(목업 116px) | false | 간격 토큰으로 계산된 값 | 거절 |
| VQ-9 | 기둥 본문 | 행간 1.7(목업 1.65) | false | body 토큰 행간 1.7 | 거절 |
| VQ-10 | `BaseLayout.astro` | 파비콘 404 | low | BH-5와 같음 | defer D1 |
| VQ-11 | `Nav.astro` | #experience·#activities·#about 대상이 없음 | false | frozen Never가 정한 의도된 상태 | 거절 |
| VQ-12 | `Hero.astro` 1024 | h1이 60px 그대로 621px 열에서 5줄로 깨지고 카드가 첫 화면 밖으로 밀림 | medium | 1024–1279px에서 8컬럼 폭이 792px 미만이 되어 세 줄 문장이 줄 안에서 다시 줄바꿈됨. 125% 배율 노트북(1366→1093px)에서 흔함 | patch P16 |
| VQ-13 | `Hero.astro` 1024 | 버튼 두 개가 두 줄로 쌓임 | low | 버튼 폭 합(299px)이 오른쪽 단 폭과 같아 줄바꿈됨 | patch P17 |
| VQ-14 | `Hero.astro` 1024 | 기둥 02의 "관련" 줄만 두 줄이라 22px 높음 | low | 실제로 그렇다. 외관 차이이고, 맞추려면 구조 변경(subgrid)이 필요함 | 거절 |
| VQ-15 | `ProjectCard.astro` 768 | 배지가 두 줄일 때 "(1위)" 같은 고아 꼬리 | low | 줄바꿈 균형이 없음. 고치는 건 CSS 한 줄 | patch P18 |
| VQ-16 | `ProjectCard.astro` 768 | 4행 정렬이 어긋남 | medium | EC-6과 같은 결함 | patch P14 |
| VQ-17 | `Hero.astro` 768 | h1이 4줄이고 "이해하고,"가 고아 줄 | medium | VQ-12와 같은 원인(display 고정 60px) | patch P16 |
| VQ-18 | `ProjectCard.astro` 768 | 스택 줄이 "·"로 시작함 | low | 스택이 ' · '로 이은 한 문자열이라 구분점 앞에서 줄바꿈됨 | patch P19 |
| VQ-19 | `ProjectCard.astro` 375 | 1열에서 수상 없는 카드의 빈 배지 자리가 틈으로 보임 | low | 정렬할 옆 카드가 없는 폭에서도 29px를 비워 둠 | patch P20 |
| VQ-20 | 카드 375 | 텍스트가 카드 안쪽 32px라 문장이 촘촘함 | false | 스펙의 카드 패딩(32px) | 거절 |
| VQ-21 | `ContactBand.astro` 320 | PDF 버튼 글자가 "(약 / 15MB)"로 쪼개짐 | medium | 280px 버튼에 글자·아이콘·패딩이 287px라 넘침. 지원 최소 폭에서 가장 눈에 띄는 깨짐 | patch P21 |
| VQ-22 | `Hero.astro` 320 | h1이 6줄이고 "기획과"가 혼자 남음 | low | 키워드 안 줄바꿈 금지 규칙 때문에 생기며, 최소 폭에서만 나타남 | 거절 |
| VQ-23 | 배지 320 | 배지 고아 꼬리 | low | VQ-15와 같은 원인 | patch P18 |
| VQ-24 | 스택 320 | "SEED / Design"처럼 기술명이 쪼개짐 | low | VQ-18과 같은 원인 | patch P19 |
| VQ-25 | `Hero.astro` 320 | 버튼이 서로 다른 폭으로 쌓임 | low | 최소 폭에서만 나타나는 외관 차이 | 거절 |
| VQ-26 | 카드 역할·성과 320 | "FE", "검색" 같은 한 단어 고아 줄 | low | 역할·성과에 `text-wrap: pretty`가 없음. 고치는 건 CSS 한 줄 | patch P22 |

## Design Notes

- 기간은 목업처럼 "YYYY.MM – YYYY.MM"으로 표기한다. NEW:LEARN은 "2026.10 – 2026.11"에 `status-pill` "진행 중"을 붙인다.
- NEW:LEARN 카드 이미지는 승인된 목업의 v3 캡처를 유지한다.
- 이미지는 빌드 단계에서 최적화한다(폭·높이 지정, 첫 화면 밖은 lazy).

## Verification

**Commands:**
- `npm run check` -- expected: 오류 0
- `npm run build` -- expected: 성공. `dist/index.html`에 h1 문장과 카드 링크 8개가 정적 HTML로 들어 있음
- `npm test` -- expected: Playwright 테스트 전부 통과

**Manual checks (if no CLI):**
- 서브에이전트가 Edge 헤드리스로 1440×900·1024·768·375·320 폭을 캡처해 `home-fold.png`·`home-full.png`와 비교하고, 차이를 글로만 보고한다(메인 스레드에서는 PNG를 열지 않는다).
