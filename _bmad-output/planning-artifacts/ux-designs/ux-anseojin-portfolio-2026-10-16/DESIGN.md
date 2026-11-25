---
name: Anseojin Portfolio
description: 'UX를 중시하는 프론트엔드 개발자 안서진의 채용용 포트폴리오(기획 직무 지원에도 사용). 라이트 모드 전용, Pretendard 단일 서체, 채도를 낮춘 슬레이트 블루 단일 액센트.'
status: final
sources:
  - Anseojin Portfolio.html
  - anseojin-portfolio.pdf
updated: 2026-10-16
colors:
  # 색 테마 1 슬레이트 블루(사용자 결정, .working/color-themes-1.html t1 세트 그대로). 현행 #1F5EEB는 채도 과다로 교체. 라이트 모드 전용[ASSUMPTION]이라 dark 쌍 없음.
  surface-base: '#FFFFFF'
  surface-subtle: '#F3F5F8'
  surface-inverse: '#1C2333'
  ink-primary: '#1C2333'
  ink-secondary: '#4B5566'
  ink-tertiary: '#677182'
  ink-on-inverse: '#EEF1F5'
  ink-on-inverse-muted: '#A9B2C0'
  # 2026-10-16 사용자 결정(V2): "답답하다"는 피드백으로 한 단계 밝힘. 이전 값 #3D5C9C / #2F4A82 / #EDF1F8 / #DCE3F0 / #7A93C8.
  primary: '#406ABF'
  primary-pressed: '#33579E'
  primary-weak: '#EEF3FB'
  primary-tint: '#DFE7F6' # 히어로 키워드 밑줄 띠 전용 장식색(사용자 결정). 텍스트·아이콘·상태에 쓰지 않음.
  on-primary: '#FFFFFF'
  primary-on-inverse: '#A3B9E3'
  primary-light: '#8AA4D8' # 점-선-점 모티프 전용 장식색. 텍스트·아이콘·상태에 쓰지 않음.
  border-hairline: '#E4E8EE'
  border-strong: '#CED5DF'
typography:
  # [ASSUMPTION] Pretendard 유지, 스케일 재정의.
  display:
    fontFamily: Pretendard
    fontSize: 60px
    fontWeight: '700'
    lineHeight: '1.22'
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Pretendard
    fontSize: 34px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline:
    fontFamily: Pretendard
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-mobile:
    fontFamily: Pretendard
    fontSize: 26px
    fontWeight: '700'
    lineHeight: '1.35'
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Pretendard
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  title:
    fontFamily: Pretendard
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.45'
  body-lg:
    fontFamily: Pretendard
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body:
    fontFamily: Pretendard
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.7'
  caption:
    fontFamily: Pretendard
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
  label:
    fontFamily: Pretendard
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.08em
  metric:
    fontFamily: Pretendard
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
rounded:
  sm: 8px
  md: 12px
  lg: 20px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  '8': 64px
  '9': 96px
  '10': 160px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 20px
  nav-height: 64px
components:
  nav-bar:
    background: '{colors.surface-base}'
    foreground: '{colors.ink-secondary}'
    foreground-active: '{colors.ink-primary}'
    indicator: '{colors.primary}'
    border: '{colors.border-hairline}'
    height: '{spacing.nav-height}'
  section-progress:
    fill: '{colors.primary}'
    height: 2px
  section-label:
    typography: '{typography.label}'
    foreground: '{colors.primary}'
    motif-start: '{colors.primary-light}'
    motif-end: '{colors.primary}'
    motif-gap: '{spacing.2}'
  button-primary:
    background: '{colors.primary}'
    background-pressed: '{colors.primary-pressed}'
    foreground: '{colors.on-primary}'
    radius: '{rounded.md}'
    height: 48px
  button-secondary:
    background: '{colors.surface-base}'
    foreground: '{colors.ink-primary}'
    border: '{colors.border-strong}'
    radius: '{rounded.md}'
    height: 48px
  hero:
    typography: '{typography.display}' # 세 줄 h1 60px, mockups/home.html 승인(사용자 결정)
    typography-mobile: '{typography.display-mobile}'
    foreground: '{colors.ink-primary}'
    highlight: '{colors.primary}'
    highlight-underline: '{colors.primary-tint}'
  keyword-pillar:
    number: '{typography.label}'
    number-color: '{colors.primary}'
    title: '{typography.title-lg}'
    title-color: '{colors.ink-primary}'
    body: '{typography.body}'
    body-color: '{colors.ink-secondary}'
    related: '{typography.caption}'
    related-label-color: '{colors.ink-tertiary}'
    related-color: '{colors.ink-primary}'
    divider: '{colors.border-strong}' # V2(사용자 결정): 굵은 검정 선 → 얇은 회색 선
    divider-width: 1px
    gap: '{spacing.gutter}'
  proof-chip:
    background: '{colors.surface-subtle}'
    foreground: '{colors.ink-primary}'
    radius: '{rounded.full}'
    typography: '{typography.caption}'
  project-card:
    background: '{colors.surface-base}'
    media-background: '{colors.surface-subtle}'
    border: '{colors.border-hairline}'
    border-hover: '{colors.border-strong}'
    radius: '{rounded.lg}'
    padding: '{spacing.6}'
    title: '{typography.title-lg}'
  award-badge:
    background: '{colors.primary-weak}'
    foreground: '{colors.primary-pressed}'
    radius: '{rounded.full}'
    typography: '{typography.caption}'
  status-pill:
    background: '{colors.surface-subtle}'
    foreground: '{colors.ink-secondary}'
    radius: '{rounded.full}'
    typography: '{typography.caption}'
  metric-stat:
    value: '{typography.metric}'
    value-color: '{colors.primary}'
    label: '{typography.caption}'
    label-color: '{colors.ink-tertiary}'
  tech-chip:
    background: '{colors.surface-base}'
    foreground: '{colors.ink-secondary}'
    border: '{colors.border-hairline}'
    background-active: '{colors.primary-weak}'
    foreground-active: '{colors.primary-pressed}'
    radius: '{rounded.full}'
  case-block:
    background: '{colors.surface-subtle}'
    label: '{typography.label}'
    label-color: '{colors.primary}'
    radius: '{rounded.lg}'
    padding: '{spacing.6}'
  timeline-row:
    date: '{typography.caption}'
    date-color: '{colors.ink-tertiary}'
    divider: '{colors.border-hairline}'
  project-pager:
    background: '{colors.surface-base}'
    border: '{colors.border-hairline}'
    border-hover: '{colors.border-strong}'
    radius: '{rounded.lg}'
  contact-band:
    background: '{colors.surface-inverse}'
    foreground: '{colors.ink-on-inverse}'
    foreground-muted: '{colors.ink-on-inverse-muted}'
    link: '{colors.primary-on-inverse}'
  toast:
    background: '{colors.surface-inverse}'
    foreground: '{colors.ink-on-inverse}'
    radius: '{rounded.md}'
  focus-ring:
    color: '{colors.primary}'
    color-on-inverse: '{colors.primary-on-inverse}'
    width: 2px
    offset: 2px
---

## Brand & Style

채용 담당자와 FE 리드가 30초~2분 [ASSUMPTION] 안에 "기획과 UI/UX 디자인을 이해하고, 사용자 경험과 흐름을 설계하는 프론트엔드 개발자"를 기억하고 떠나게 만드는 사이트다. 기획 직무 지원에도 같은 사이트를 쓰므로 첫인상에 기획 · UI/UX 디자인 · 사용자 경험 세 단어가 보여야 한다(사용자 결정). 세 단어는 직무를 둘로 나누는 트랙이 아니라 한 개발자의 근거로 읽히게 한다. 화면을 채우는 것은 장식이 아니라 증거다. 정체성 문장과 숫자(1위 수상 2회, 588개 조건 조합 대조, 월 조회수 9,400회)가 시각적 액센트를 맡는다.

스타일은 타입 주도의 에디토리얼 미니멀이다 [ASSUMPTION]. 넓은 여백, 큰 한글 디스플레이, 채도를 낮춘 슬레이트 블루 하나로 이뤄진다. "동적"은 화려함이 아니라 반응성으로 표현한다. 스크롤에 맞춰 드러나는 섹션, 세어 올라가는 숫자, 커서에 반응하는 카드가 그 예다(동작 규칙은 EXPERIENCE.md). 출발점은 현재 상태(`imports/current-about-hero.png`, 영문 이름이 최대 요소인 히어로)에서 벗어나는 것이다. 현행에서 유일하게 이어받는 브랜드 마크는 점-선-점 모티프(작은 둥근 사각형 두 개를 짧은 선으로 이은 것)다. "연결하는 사람"이라는 서명으로, 내비 로고와 영문 섹션 라벨 앞 두 곳에서만 작게 쓴다(위임받은 코치 결정). 미감은 사용자의 핵심 요구다. 홈 목업 [mockups/home.html](mockups/home.html)은 색 테마 1과 히어로 A+B 혼합을 합친 것으로, 사용자가 승인했다(사용자 결정). 상세 화면의 기준 목업은 [mockups/project-ourwish.html](mockups/project-ourwish.html)이다. 목업과 이 문서가 충돌하면 이 문서가 우선한다.

## Colors

채도를 낮춘 슬레이트 블루 하나와 차가운 중립 톤만 쓴다. 색은 "여기가 증거·행동"이라는 신호로만 쓴다. 장식에 쓰는 색은 점-선-점 모티프의 `primary-light`와 히어로 키워드 밑줄 띠의 `primary-tint` 두 가지뿐이다. 팔레트는 색 테마 1 슬레이트 블루 세트를 그대로 채택했다(사용자 결정, `.working/color-themes-1.html`). 첫 목업에 쓴 현행 블루 `#1F5EEB`(HSL 221° / S84% / L52%)가 "쨍하다"는 피드백을 받아, 색상각은 그대로 두고 채도와 명도를 낮췄다(primary HSL 220° / S44% / L43%).

- **2026-10-16 V2 갱신(사용자 결정)**: primary를 `#406ABF`(흰 바탕 5.2:1, `surface-subtle` 4.8:1, 흰 글자 5.2:1)로 한 단계 밝혔고, 나머지 primary 계열도 함께 바꿨다(frontmatter 참고). 아래 문단과 대비 표의 primary 수치는 이전 값 기준이며, 새 값도 모든 텍스트 조합에서 AA를 통과한다.
- **Primary Slate Blue (`#406ABF`, 이전 `#3D5C9C`)**: 쓰는 곳은 주 CTA, 히어로 문장의 강조 키워드, 영문 섹션 라벨, `case-block` 라벨, `keyword-pillar` 번호, `metric-stat` 숫자, 활성 내비 표시, `section-progress`, 타임라인 "자세히 보기" 토글, 포커스 링이다. 눌림 상태는 **Pressed (`#2F4A82`)**다.
- **Primary Weak (`#EDF1F8`)**: 수상 배지와 활성 기술 칩 바탕에 쓰고, 그 위 글자는 `primary-pressed`로 쓴다 [ASSUMPTION].
- **Primary Tint (`#DCE3F0`)**: 히어로 강조 키워드 아래 형광펜 모양 밑줄 띠에만 쓰는 장식색이다(사용자 결정). 텍스트, 아이콘, 상태 표시에는 쓰지 않는다.
- **Ink 3단계 (`#1C2333` / `#4B5566` / `#677182`)**: 현행 `#222B30`을 대체하는, 슬레이트 블루에 맞춘 중립 톤이다(테마 1 세트). 제목·본문은 primary, 보조 설명은 secondary, 날짜·메타는 tertiary로 쓴다. tertiary 아래 단계의 글자색은 두지 않는다.
- **Surface (`#FFFFFF` / `#F3F5F8`)**: 페이지는 흰색이다. subtle은 카드 미디어 프레임, `case-block`, `proof-chip`, `status-pill` 바탕에 쓴다 [ASSUMPTION].
- **Inverse (`#1C2333`)**: 페이지 끝 `contact-band`와 `toast`에만 쓰는 어두운 띠다. 라이트 모드 안의 마침표 역할이며 다크 모드가 아니다 [ASSUMPTION].
- **Hairline / Strong (`#E4E8EE` / `#CED5DF`)**: 각각 카드·구분선의 기본 테두리와 hover 테두리다.
- **Primary Light (`#7A93C8`)**: 점-선-점 모티프의 왼쪽 사각형에만 쓰는 순수 장식색이다(테마 1 세트). 텍스트, 아이콘, 상태 표시에는 절대 쓰지 않는다.

피할 것: 그라데이션 배경, 두 번째 액센트 색(수상용 금색 등), 기술 스택별 색 코딩.

주요 대비(WCAG 2.2 AA, 본문 4.5:1 · 비텍스트 3:1):

| 조합 | 대비 |
|---|---|
| `ink-primary` / `surface-base` | 15.7:1 |
| `ink-secondary` / `surface-subtle` (`status-pill` 포함) | 6.9:1 |
| `ink-tertiary` / `surface-base` · `surface-subtle` | 4.9:1 · 4.5:1 |
| `primary` / `surface-base` · `surface-subtle` | 6.5:1 · 6.0:1 |
| `primary` / `primary-tint` (히어로 키워드 밑줄 띠) | 5.1:1 |
| `on-primary` / `primary` | 6.5:1 |
| `primary-pressed` / `primary-weak` | 7.7:1 |
| `ink-on-inverse` · `ink-on-inverse-muted` / `surface-inverse` | 13.9:1 · 7.3:1 |
| `primary-on-inverse` / `surface-inverse` (링크·포커스 링) | 7.9:1 |
| `primary-light` / `surface-base` (장식 전용, 기준 비적용) | 3.1:1 |

모든 텍스트 조합이 AA를 통과한다. 다만 `ink-tertiary` / `surface-subtle`은 4.51:1로 기준선에 붙어 있다. 그래서 `surface-subtle` 면 위의 글자는 가능하면 `ink-secondary`를 쓰고, tertiary는 날짜·메타에만 둔다 [ASSUMPTION].

## Typography

서체는 Pretendard 하나다(현행 유지) [ASSUMPTION]. 폴백 스택은 `-apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`이다.

- `display`(모바일 `display-mobile`): 페이지당 한 번만 쓴다. 홈에서는 히어로 정체성 문장, 상세에서는 프로젝트명이다. 히어로 문장이 세 줄이어서, 오른쪽 단과 높이가 맞도록 60px / 행간 1.22로 정했다([홈 목업](mockups/home.html) 승인, 사용자 결정).
- `headline`: 섹션 제목(한국어)에 쓴다. 바로 위에 영문 `label`이 붙는다(예: `WORK` / 프로젝트).
- `title-lg`: 프로젝트 카드 이름, 히어로 `keyword-pillar` 제목(h1보다 확실히 작게). `title`: 상세 소제목, `project-pager`의 프로젝트명.
- `body-lg`: 히어로 보조 문장과 상세 리드 문단, `body`: 그 외 본문.
- `caption`: 날짜, 역할, 스택, 칩 글자.
- `label`: 영문 섹션 라벨, `case-block` 라벨(원문 라벨 그대로. 예: WHY · VALIDATION · CALCULATION · HOW · RESULT, ISSUE · APPROACH · RESULT), `keyword-pillar` 번호(01–03). 대문자로 쓴다.
- `metric`: `metric-stat`의 숫자 전용이다. `font-variant-numeric: tabular-nums`로 카운트업 중 폭이 흔들리지 않게 한다.

규칙은 세 가지다. 한글 제목·본문은 `word-break: keep-all`을 써서 어절 단위로 줄바꿈한다. 긴 본문 한 줄은 680px를 넘기지 않는다. 굵기는 400 / 500 / 600 / 700만 쓴다 [ASSUMPTION].

## Layout & Spacing

간격은 4 기반 스케일(`{spacing.1}`~`{spacing.10}`)이다. 데스크톱은 12컬럼, 최대 폭 `{spacing.container-max}`, 거터 `{spacing.gutter}`이고 좌우 여백은 데스크톱 `{spacing.margin-desktop}`, 모바일 `{spacing.margin-mobile}`이다 [ASSUMPTION].

- 섹션 간 간격은 데스크톱 `{spacing.10}`, 모바일 `{spacing.9}`이다. 섹션 사이 여백은 넉넉하게, 카드 내부는 촘촘하게 잡는다.
- 히어로 상단은 12컬럼 2단(정체성 문장 8컬럼 + 보조 문장·`proof-chip`·CTA 4컬럼, 아래 정렬)이고, 그 아래 `keyword-pillar` 3개가 12컬럼 전폭을 3등분(각 4컬럼)한다 [ASSUMPTION].
- 히어로 여백(V2, 2026-10-16 사용자 결정): 히어로 위 96px · 아래 64px, 기둥 위 80px, Work 위 64px. "답답하다"는 피드백으로 넓혔다. 1440×900 첫 화면은 WORK 라벨과 "프로젝트" 제목에서 끝나고 카드는 그 아래에서 시작한다. 예전의 "첫 행 카드 윗부분 노출" 결정은 이것으로 대체한다. 히어로 높이는 여전히 뷰포트의 88% 이하로 둔다.
- 프로젝트 카드 8개는 모두 같은 크기, 같은 슬롯이다(사용자 결정). 데스크톱은 2열×4행 그리드(카드당 6컬럼)로 빈 칸이 없고, 768px 미만은 1열이다 [ASSUMPTION]. 그리드 행 높이는 모두 같다.
- 상세 페이지 상단은 요약 5컬럼 + 미디어 7컬럼이고, `case-block`은 전체 폭으로 세로로 쌓는다.
- 브레이크포인트별 재배치는 EXPERIENCE.md의 Responsive & Platform을 따른다.

## Elevation & Depth

기본은 평면이다. 위계는 그림자가 아니라 여백, 타입, `border-hairline`으로 만든다 [ASSUMPTION].

- **Hover 그림자**: 카드와 `project-pager`가 hover·포커스 상태일 때만 `0 16px 40px rgba(28, 35, 51, 0.10)`을 쓴다.
- **스크롤된 내비**: 흰색 92% 불투명 + `backdrop-filter: blur(12px)`에 아래 `border-hairline`을 더한다. 페이지 최상단에서는 테두리가 없다.
- **Toast**: `0 8px 24px rgba(28, 35, 51, 0.16)`.
- 그 밖의 그림자, 내부 그림자, 글로우는 쓰지 않는다.

## Shapes

`{rounded.lg}`(20px)는 카드, `case-block`, `project-pager`, 프로필 사진에 쓴다. `{rounded.md}`(12px)는 버튼, 카드 안 미디어, toast에 쓴다. `{rounded.sm}`(8px)는 `case-block` 안 작은 이미지와 모바일 메뉴 패널에 쓴다. `{rounded.full}`은 `proof-chip`, `award-badge`, `status-pill`, `tech-chip`에만 쓴다 [ASSUMPTION]. 이미지는 컨테이너 모서리를 그대로 따른다.

## Components

- **Nav bar**: 높이 `{spacing.nav-height}`, 상단 고정. 왼쪽 로고는 점-선-점 모티프(폭 28px) + "안서진"(`title` 700)이다. 오른쪽에 영문 앵커 4개(About · Projects · Experience · Activities, About이 맨 앞이고 Work는 Projects로 바꿈 — 2026-10-16 사용자 결정)를 둔다. 활성 항목은 `ink-primary`에 아래 2px `primary` 밑줄을 긋는다. 바로 아래 `section-progress`가 붙는다. 768px 미만에서는 앵커 대신 "메뉴" 텍스트 버튼을 두고, 패널은 내비 바로 아래에 전폭으로 열린다(`surface-base` 바탕, 하단 모서리 `{rounded.sm}`, 항목 높이 48px) [ASSUMPTION]. "본문으로 건너뛰기" 링크는 포커스를 받을 때만 좌상단에 `button-primary` 모양으로 나타난다.
- **Section progress**: 내비 하단 경계에 2px `primary` 바를 두고, 트랙은 투명하다.
- **Section label**: 홈 각 섹션의 `headline` 바로 위에 둔다. 점-선-점 모티프(폭 24px) + `{spacing.2}` 간격 + `label` 대문자 영문(`primary`, 예: `WORK`)으로 구성한다. 모티프는 사각형 6px(모서리 2px) 두 개를 1.5px 선으로 잇고, 왼쪽 사각형은 `primary-light`, 선과 오른쪽 사각형은 `primary`다. 크기는 [ASSUMPTION]이다. `contact-band` 위에서는 선과 오른쪽 사각형을 `primary-on-inverse`로 그린다 [ASSUMPTION]. 섹션 라벨 앞과 내비 로고 외에는 모티프를 쓰지 않는다.
- **Button**: primary는 블루 면에 흰 글자, secondary는 흰 면에 `border-strong` 테두리다. 높이 48px, 좌우 `{spacing.5}` 패딩. 외부 링크 버튼은 라벨 뒤에 ↗ 아이콘 16px를 붙인다.
- **Hero**: 시안 A(한 문장)와 B(세 개의 기둥)를 섞는다. 구성은 [홈 목업](mockups/home.html)으로 확정했다(사용자 결정). 상단 2단의 왼쪽 8컬럼에 `label` 눈썹("안서진 · FRONTEND DEVELOPER")과 `display` 정체성 문장 「기획과 UI/UX 디자인을 이해하고, 사용자 경험과 흐름을 설계하는 프론트엔드 개발자」를 둔다. 문장 안의 세 키워드("기획" · "UI/UX 디자인" · "사용자 경험")만 `primary`로 칠하고, 키워드 안에서는 줄을 바꾸지 않는다. 세 키워드에는 형광펜 모양의 `primary-tint` 단색 밑줄 띠를 깐다: `background: linear-gradient(transparent 74%, primary-tint 74%, primary-tint 92%, transparent 92%)`(시안 A의 키워드 액센트 밑줄, 사용자 결정). 오른쪽 4컬럼에는 `body-lg` 보조 문장 → `proof-chip` 2개(폭이 좁아 세로로 쌓임) 를 아래 정렬로 둔다(버튼은 2026-10-16 사용자 결정으로 없앰). 그 아래에 전폭 `keyword-pillar` 3개가 온다. 강조 키워드와 기둥 제목은 1:1로 같은 단어다.
- **Keyword pillar** (2026-10-16 최종 사용자 결정: 유지하되 기둥은 01 기획 / 02 UI/UX 디자인 / 03 개발. h1 강조어는 기획 · UI/UX 디자인 · 사용자 경험 그대로라 03은 1:1 대응이 아니다. 03 근거 "React·TypeScript로 화면 구현부터 상태 관리, API 연동까지 이어지는 프론트엔드 개발을 해왔습니다.", 관련 FINCH · Boogle · DevOops. 히어로 보조 문장(body-lg)도 기둥과 겹쳐 없앴다 — 히어로는 눈썹 + h1(8컬럼) + 기둥): 히어로 안의 전폭 3열이다(각 4컬럼, 사이 `{spacing.gutter}`). 기둥마다 위쪽 1px `border-strong` 선(V2, 사용자 결정) → `label` 번호(`01`, `primary`, `tabular-nums`) → `title-lg` 제목(기획 / UI/UX 디자인 / 사용자 경험) → `body` 근거 한 줄(`ink-secondary`, 최대 372px) → `caption` "관련" 줄 순서로 쌓는다. "관련" 줄은 기둥 하단에 고정하고, "관련"은 `ink-tertiary`, 프로젝트명은 `ink-primary`로 쓴다. 세 기둥은 같은 선과 같은 색을 쓰고, 아이콘, 배경 면, 카드 테두리, 기둥별 색을 두지 않아 독립된 카드나 직무 트랙으로 보이지 않게 한다 [ASSUMPTION]. 768px 미만에서는 세로로 쌓는다.
- **Proof chip** (2026-10-16 최종 사용자 결정: 히어로에서 칩을 모두 없앰. 오른쪽 단은 보조 문장만. 아래는 기록용): `surface-subtle` 알약 모양이다. 트로피 또는 차트 아이콘 16px + `caption` 한 줄(예: "SSAFY 프로젝트 1위 2회")로 구성하며 2개만 둔다.
- **Project card**: 위쪽은 16:10 미디어 프레임이다. `surface-subtle` 바탕에 스크린샷을 `contain`으로 넣어 세로형 모바일 화면도 잘리지 않게 한다 [ASSUMPTION]. 아래 텍스트 슬롯 순서는 `caption` 기간 → `title-lg` 이름 → `award-badge` 자리 → `body` 한 줄 → `caption` 역할 → 성과 슬롯 → `caption` 스택(카드 하단에 고정)이다. 성과 슬롯은 `metric-stat` 또는 `body` 600 성과 문장을 담으며 두 경우의 높이가 같다. 수상이 없는 카드는 배지 자리를 같은 높이의 빈칸으로 둬서, 같은 행에 놓인 카드끼리 한 줄 슬롯의 위치를 맞춘다 [ASSUMPTION]. 진행 중인 프로젝트(NEW:LEARN)는 배지 자리에 `status-pill`을 둔다.
- **Award badge**: `primary-weak` 알약 모양에 트로피 14px + 수상명. 카드와 상세 헤더에 쓴다.
- **Status pill**: `surface-subtle` 알약에 `ink-secondary` `caption` "진행 중"만 쓴다. 트로피나 다른 아이콘을 넣지 않아 수상과 구분되며, `award-badge`와 같은 자리, 같은 높이를 쓴다 [ASSUMPTION].
- **Metric stat**: `metric` 숫자(`primary`) 아래에 `caption` 설명(`ink-tertiary`)을 둔다. 단위(개·건·원·회·명)는 숫자와 같은 줄에 `title` 크기로 쓴다.
- **Tech chip**: 흰 알약에 `border-hairline` 테두리, 기술명 + 사용 프로젝트 수(`ink-tertiary`). 활성 상태는 `primary-weak` 바탕이다. 카테고리(Frontend · App / Real-time · Backend / Languages · Design & Collaboration · AI / Platform)별 행으로 묶는다.
- **Case block**: `surface-subtle` 면 위에 `label` 라벨과 `body` 목록을 둔다. 라벨은 원문 라벨을 그대로 쓴다(예: WHY · VALIDATION · CALCULATION · HOW · RESULT, ISSUE · APPROACH · RESULT). RESULT가 있으면 항상 마지막이다. RESULT 문단은 `ink-primary` 600으로 강조한다. 다이어그램은 블록 안에 전체 폭으로 넣는다.
- **Timeline row**: 왼쪽에 `caption` 날짜, 오른쪽에 내용을 두고 행 사이에 hairline을 긋는다. Awards, 활동, 기술 경험 목록에 쓴다. "자세히 보기" 토글은 `primary` 텍스트 + 펼침 방향 셰브런 16px로 표시하며, 버튼 테두리는 없다 [ASSUMPTION].
- **Project pager**: 상세 하단의 2칸 카드로, "이전 프로젝트" / "다음 프로젝트" `caption` 아래에 `title` 프로젝트명을 둔다.
- **Contact band** (2026-10-16 사용자 결정으로 모든 페이지에서 제거. 연락처는 About 섹션에만 둔다. 아래는 기록용): 페이지 끝의 `surface-inverse` 전폭 띠다. 위계는 `headline` 한 줄 → 이메일(크게) → 나머지 연락 항목 순이다(항목 목록은 EXPERIENCE.md의 Contact band). PDF 버튼은 이메일 옆의 `button-secondary`다 [ASSUMPTION]. 링크와 포커스 링은 `primary-on-inverse`로 쓴다. About의 연락처 블록은 흰 바탕에 `body` 크기로 쓰고, 같은 PDF 버튼을 둔다.
- **Toast**: 화면 하단 중앙의 `surface-inverse` 바탕에 `caption` 한 줄을 담는다. 아이콘은 넣지 않는다.
- **Focus ring**: 2px `primary` + 2px 오프셋이며, 어두운 띠 위에서는 `primary-on-inverse`로 쓴다. 모든 상호작용 요소에 같은 링을 쓴다.

## Do's and Don'ts

| Do | Don't |
|---|---|
| 정체성 문장을 첫 화면 최대 요소로 | 영문 이름이나 증명사진을 히어로 최대 요소로 (페인포인트) |
| h1 강조 키워드와 `keyword-pillar` 제목을 같은 단어로 1:1 대응 | 기둥을 아이콘·색·카드 면으로 나눠 별도 직무 트랙처럼 보이게 하기 [ASSUMPTION] |
| 카드 첫 줄에 문제→해결 한 줄, 스택은 마지막 `caption`으로 | 스택 나열을 카드의 유일한 정보로 (페인포인트) |
| 8개 카드 모두 같은 크기·같은 슬롯, 위계는 숫자·수상으로 (사용자 결정) | 카드마다 다른 구성, 높이가 들쭉날쭉한 그리드 |
| 숫자·수상을 시각적 액센트로 (`metric-stat`, `award-badge`) | 장식용 일러스트, 그라데이션, 두 번째 액센트 색 [ASSUMPTION] |
| 기술 스택은 HTML 칩으로 | 기술 스택을 이미지 1장으로 (페인포인트) |
| 그림자는 hover·포커스에만 | 상시 그림자, 카드 겹겹이 쌓기 [ASSUMPTION] |
| 한글은 `keep-all` 어절 단위 줄바꿈 | 제목이 어절 중간에서 끊기는 줄바꿈 |
| 점-선-점 모티프는 내비 로고와 섹션 라벨 앞에만, 작게 | 모티프를 구분선·배경·로딩·카드 장식으로 쓰거나 크게 키우기, `primary-light`를 텍스트에 쓰기 |
