---
name: Anseojin Portfolio
status: final
sources:
  - Anseojin Portfolio.html
  - anseojin-portfolio.pdf
updated: 2026-10-16
---

# 안서진 포트폴리오 — Experience Spine

## Foundation

대상 표면은 반응형 웹 하나다. PC·노트북을 우선하고, 모바일은 깨지지 않는 수준까지만 보장한다(사용자 결정). 지정된 UI 시스템이 없어 컴포넌트를 자체 제작하며, 프레임워크는 아키텍처 단계에서 정한다. 시각 정체성은 `DESIGN.md`가, 경험은 이 문서가 기준이다. 라이트 모드만 다룬다 [ASSUMPTION].

1차 독자는 채용 담당자(비개발 직군·기획 직무 포함)와 FE 리드이고, 페이지당 체류는 30초~2분이다 [ASSUMPTION]. 대상 기업 규모는 대기업·스타트업·중소기업을 가리지 않는다(사용자 결정). 포지셔닝은 "UX를 중시하는 개발자" 하나다(사용자 결정). 기획·UI/UX 경험은 별도 트랙으로 세우지 않고, 사용자를 아는 개발자라는 근거로 각 프로젝트에 녹인다. 기획 직무에 지원할 때도 같은 포트폴리오를 쓰므로(사용자 결정), 히어로는 기획 · UI/UX 디자인 · 사용자 경험을 h1 강조어와 키워드 기둥(`keyword-pillar`)으로 첫인상에 보여준다.

확정된 목업은 [mockups/home.html](mockups/home.html)(홈 · Work · Contact band)과 [mockups/project-ourwish.html](mockups/project-ourwish.html)(상세 헤더 · `case-block` · pager)이다. 그 밖의 화면(Experience · Activities · About, NEW:LEARN 등 나머지 상세, Not found, 모바일)은 이 문서의 표만으로 구현한다(사용자 결정). 현재 상태 캡처(`imports/`)나 목업이 두 스파인(`DESIGN.md`와 이 문서)과 충돌하면 스파인이 우선한다.

## Information Architecture

탭형 SPA를 한 페이지 스크롤 홈과 프로젝트별 상세 페이지로 바꾼다 [ASSUMPTION]. 홈 섹션 순서는 고정이다. 상단 고정 내비(About · Work · Experience · Activities, About이 맨 앞 — 2026-10-16 사용자 결정)는 섹션 앵커로 동작한다. 2026-10-16 사용자 결정으로 홈 섹션 순서는 히어로 → About → Work → Experience → Activities다(About을 맨 위로, 내비 순서와 같음). 아래 표의 행 순서보다 이 문장이 우선한다. 같은 날 사용자 결정으로 "Work"는 "Projects"로 바꿨다(내비 라벨 · 섹션 라벨 PROJECTS · 앵커 `/#projects`, 카드 앵커 `/#project-<slug>`). 아래 표의 `/#work`는 `/#projects`로 읽는다. 최종 내비·섹션 순서(사용자 결정)는 About · Tech Stack(`/#tech-stack`, Experience에서 Skills를 분리) · Projects · Experience · Activities이고, 레거시 `#/tech`는 `/#tech-stack`으로 보낸다. About 연락처의 "이메일 복사" 버튼과 toast도 없앴다(메일 링크와 PDF 받기만 둔다).

| Surface | Reached from | Purpose |
|---|---|---|
| Home · Hero `/` | 지원서·이력서 링크, 로고 | 정체성 문장(세 키워드 강조), 키워드 기둥 3개, 수상·성과 증거(`proof-chip` 2개), 첫 화면은 WORK 라벨·"프로젝트" 제목에서 끝남(V2 여백, 2026-10-16 사용자 결정) |
| Home · Work `/#work` | 히어로 CTA, 내비 Work, `proof-chip`, 스크롤 | 프로젝트 카드 8개, 최신순 |
| Home · Experience `/#experience` | 내비 Experience | Skills 칩 그룹, DAILY TICK · 데이터베이스시스템 프로젝트 · 싸피레이스(기술 경험으로는 유지, 수상에서만 제외 — 사용자 결정) |
| Home · Activities `/#activities` | 내비 Activities | UI/UX Design 작업물(맨 앞), 콘텐츠 기획·제작, 동아리 활동 |
| Home · About & Contact `/#about` | 내비 About, 스크롤 끝 | 프로필 사진(히어로에서 이동, 사용자 결정), 학력·교육·어학, Awards 전체, 연락처(이메일 · 휴대폰 · PDF 받기), Archive 링크, `contact-band` |
| `/projects/newlearn` | 카드, pager, 칩 펼침 목록, 직접 링크 | 진행 중 프로젝트: 서비스 소개 → PRD(BMAD) → SEED Design 기반 디자인 시스템 → 프로토타입, 이후 진행에 따라 갱신. 상세 헤더에 "프로토타입 보기 ↗" |
| `/projects/finch` | 〃 | 기획·디자인 시스템 → Kakao OAuth·JWT 인증과 안정성 개선 |
| `/projects/banggoot` | 〃 | React Native 구현 → WebRTC 실시간 검수 연동·실기기 검증 |
| `/projects/ourwish` | 〃 | 세후 수령액 추천 기준(588개 조합 검증) → AI 챗봇 스트리밍 → FE 구조 |
| `/projects/boogle` | 〃 | 외부 API 45개 제한 대응 데이터 수집 → 환경별 소셜 로그인 문제 해결 |
| `/projects/moa` | 〃 | 요약과 트러블슈팅만 있는 짧은 상세(케이스 블록 없음) |
| `/projects/devoops` | 〃 | 회고 작성 플로우 → 변경분만 자동 저장 → API 타입 관리 |
| `/projects/msp` | 〃 | 약 1년 운영 성과(GA 지표)와 수상 |
| Not found | 잘못된 slug·경로 | 전체 프로젝트로 돌려보내기 |

홈 카드, 상세 페이지, pager 순서는 모두 최신순이다: NEW:LEARN → FINCH → 방긋 → OURWISH → Boogle → Moa → DevOops → MoonSunPower [ASSUMPTION]. slug는 기존 값을 유지하고, NEW:LEARN은 `newlearn`이다. 상세 페이지도 같은 내비를 쓰며, 내비 항목은 `/#section`으로 이동한다.

## Project Card Content Model

카드 8개는 모두 같은 크기, 같은 슬롯이다(사용자 결정). 카드는 스택 목록이 아니라 문제 → 역할 → 정량 성과를 보여준다 [ASSUMPTION].

### 카드 슬롯 규칙

슬롯 순서는 기간 → 이름 → `award-badge` 자리 → **한 줄**(문제와 해결) → 역할 → **성과 슬롯** → 스택(최대 4개, 마지막 줄)이다. 성과 슬롯은 원문에 수치가 있으면 `metric-stat`(FINCH 20 · 방긋 21 · OURWISH 588 · MoonSunPower 9,400)으로, 없으면 성과 문장으로 채우되 두 경우의 높이를 같게 둔다. 카드 높이는 모두 같게 맞추고(가장 긴 카드 기준), 문장을 잘라서 높이를 맞추지 않는다. 수치를 지어내지 않는다.

### 카드별 콘텐츠

| 프로젝트 · 기간 · 수상 | 문제 | 역할 | 성과(원문 근거) | 성과 슬롯 |
|---|---|---|---|---|
| NEW:LEARN · 2026.10.06–11.18(진행 중) · `status-pill` "진행 중" | 흩어진 뉴스로는 이슈의 흐름과 변화를 파악하기 어려움 [ASSUMPTION — PRD 기반 요약] | UI/UX 디자인 · 기획 · FE | BMAD로 PRD 작성, 당근 SEED Design으로 디자인 시스템 구현, 프로토타입 제작 완료, 이후 FE 구현 예정(수치 없음) | 문장 두 줄 "PRD 작성 → 디자인 시스템 구현 → 프로토타입 완성" / "FE 구현 진행 중" |
| FINCH · 2026.08–09 | 보유종목·투자 기록 기반 투자 판단 | PM, UI/UX·디자인 시스템, 인증, FE | 화면 20개 프로토타입, 인증 요청 경합·배포 중 비정상 로그아웃 해결 | `metric-stat` `20` 화면 프로토타입 |
| 방긋 · 2026.07–08 · SSAFY 2학기 공통 우수상(1위) | 임대인·세입자 간 하자 분쟁 | 기획·UI/UX, React Native FE, WebRTC 검수 연동·실기기 검증 | 공용 UI 컴포넌트 37종 중 21종 구현 | `metric-stat` `21` 공용 컴포넌트 구현(37종 중) |
| OURWISH · 2026.05–06 · SSAFY 1학기 관통 최우수상(1위) | 공시금리만으로는 실제 혜택 비교 불가 | 기획·UI/UX, FE, AI 챗봇 UI·프롬프트 | FE·BE 588개 조건 조합 대조, 8건의 1원 차이 원인(Decimal·부동소수점 절사 경계) 규명 | `metric-stat` `588` FE·BE 조건 조합 대조 |
| Boogle · 2026.01–07 | 카카오 Local API 지점별 최대 45개 조회 제한 | 기획·UI/UX, FE | 5개 중심점 분산 + `Promise.all` 병렬 검색으로 후보 범위 확대 | 문장 |
| Moa · 2025.09–11 | 가족 그림·사진·일상 공유(webOS 스탠바이미) | 팀장, 기획·UI/UX, FE | 스티커 이동 중 저장 제거로 인터랙션 지연 해소(수치 없음) | 문장 |
| DevOops · 기간 확인 필요 · Mash UP 동아리 1위 | 자동 저장이 변경 없는 답변까지 반복 요청 | 기획, FE | 변경된 답변만 3초 무입력 후 병렬 저장(감소 수치 없음) | 문장 |
| MoonSunPower · 2024.09–2025.09 · 서강 융합기술 특별상(AI/SW·인기상) | 개인 맞춤 문해력 학습 | 기획·UI/UX, FE, 서비스 운영 | 약 1년 운영, 2025.03 기준 월 조회수 9,400회·활성 사용자 318명 | `metric-stat` `9,400` 월 조회수(2025.03) |

### 카드 한 줄

원문을 다시 쓴 문장이므로 모두 [ASSUMPTION]이다.

1. **NEW:LEARN**: 흩어진 뉴스를 사건 단위로 묶어 이슈의 흐름을 보여 주는 AI 뉴스 서비스에서, BMAD로 PRD를 쓰고 SEED Design 기반 디자인 시스템과 프로토타입을 만들었습니다.
2. **FINCH**: PM으로 화면 20개 프로토타입과 디자인 시스템을 세우고, 배포 중 사용자가 로그아웃되던 인증 문제를 직접 해결했습니다.
3. **방긋**: 임대인과 세입자가 만나지 않고도 하자를 확인하도록, 검수 진입부터 실시간 영상·종료까지 하나의 앱 흐름으로 이었습니다.
4. **OURWISH**: 공시금리 대신 '내가 실제로 받을 세후 수령액'으로 예·적금을 비교하게 만들고, 588개 조건 조합을 대조해 1원 차이의 원인까지 찾았습니다.
5. **Boogle**: 카카오 API의 지점당 45개 조회 제한을 5개 지점 분산·병렬 검색으로 넘어, 카페 밀집 지역의 후보 범위를 넓혔습니다.
6. **Moa**: 팀장으로 webOS 스탠바이미용 가족 공유 홈 화면을 만들고, 스티커를 옮기는 동안 반복되던 저장을 없애 반응 속도를 개선했습니다.
7. **DevOops**: PR로 회고 질문을 만드는 서비스에서, 바뀐 답변만 골라 저장하도록 자동 저장을 고쳐 불필요한 API 요청을 줄였습니다.
8. **MoonSunPower**: 생성형 AI 문해력 학습 서비스를 약 1년간 직접 운영했고, 2025년 3월 기준 월 조회수 9,400회·활성 사용자 318명을 기록했습니다.

### NEW:LEARN 메모

따로 표시하지 않은 내용은 모두 [ASSUMPTION]이다. 서비스 설명의 출처는 팀 PRD다("뉴스 기사를 AI로 구조화해 마인드맵으로 제공하고, 관련 기사를 사건 단위로 연결해 이슈의 전개와 주요 변화를 시각적으로 탐색하는 AI 뉴스 서비스"). 카드 스택은 React · TypeScript · SEED Design · D3.js 4개다(D3.js 표기 여부는 Open Questions 4). 미디어는 프로토타입 v3 이슈 타임라인 캡처다(팀 프로토타입 화면 공개 가능, 사용자 결정). 상세의 예정 스택(React · TypeScript · Vite · TailwindCSS · SEED Design · D3.js · TanStack Query · Zustand · Axios · React Router) 중 아직 쓰지 않은 기술은 "사용 예정"으로 표시한다.

### 히어로 콘텐츠(proof-chip · keyword-pillar) — 2026-10-16 최종: proof-chip은 없앴고, keyword-pillar는 01 기획 / 02 UI/UX 디자인 / 03 개발로 유지(사용자 결정, DESIGN.md Keyword pillar 참고). 히어로 h1은 54px(상세 제목은 60px 유지). 아래 표는 기록용

`proof-chip` 2개 [ASSUMPTION]: "SSAFY 프로젝트 1위 2회"(→ `/#work`) · "직접 운영한 서비스 월 조회수 9,400회"(→ `/projects/msp`). 싸피레이스(자율주행 경진대회 278팀 중 2위)는 수상으로 내세우지 않는다(사용자 변경). 빈자리를 다른 수상으로 채우지 않는다.

`keyword-pillar` 3개 [ASSUMPTION]. 제목은 h1 강조 키워드와 1:1이고, 근거 문장은 About · Activities 원문에서 옮기되, 같은 개발자의 행동으로 쓰고 "기획자로서" 같은 직함을 붙이지 않는다(Voice and Tone의 "기획자이자 개발자" 금지와 같은 이유).

| # | 제목 | 근거 한 줄 | 관련 |
|---|---|---|---|
| 01 | 기획 | FINCH에서 PM을 맡았고, 캐치테이블 재구축에서 서비스 구조와 기능을 설계했습니다. (2026-10-16 정정: 사용자 불편 분석·구조 설계는 캐치테이블 재구축, PDF p29) | FINCH · NEW:LEARN · 캐치테이블 재구축 |
| 02 | UI/UX 디자인 | Figma로 와이어프레임과 주요 화면 흐름을 설계하고, 개발 핸드오프까지 직접 진행했습니다. | NEW:LEARN · OURWISH · Boogle · MoonSunPower |
| 03 | 사용자 경험 | 사용자의 관점에서 문제를 발견하고, 사용자 경험과 데이터의 정확성을 함께 고민합니다. | 방긋 · OURWISH · MoonSunPower |

## Voice and Tone

UI 문구와 본문 문체 규칙을 다룬다. 아래 규칙은 모두 [ASSUMPTION]이다.

| Do | Don't |
|---|---|
| 본문은 합니다체, 짧은 UI 피드백은 해요체: "이메일 주소를 복사했어요." | "Copied!" / "복사 완료!!" |
| CTA는 한국어 동사구: "프로젝트 보기", "서비스 바로가기 ↗" | "Projects →", "더 알아보기" |
| 파일 버튼은 받을 것을 한국어 동사구로: "포트폴리오 PDF 받기" (2026-10-16 사용자 결정: 용량 표기 뺌) | "Download", "PDF" 한 단어 |
| 전화번호는 숫자 그대로 링크로: "010-5465-2165" | "Call me", 번호를 숨긴 "전화하기" 버튼 |
| 숫자로 말하기: "FE·BE 588개 조건 조합 대조" | 숫자 없는 형용사: "꼼꼼하게 검증했습니다" |
| "기획·UI/UX 설계부터 구현까지": 기획은 근거로 쓴다 | "기획자이자 개발자": 정체성을 둘로 표기 |
| 영문은 라벨류(섹션 라벨 · 내비 앵커 · 히어로 눈썹 · `case-block` 라벨)와 고유명사(GitHub 등)에만 | 영문 문장으로 된 본문, 한영이 섞인 문장 |
| "찾는 프로젝트가 없어요." + "전체 프로젝트 보기" | "404 Not Found" |
| 이모지·느낌표 없이 | "열정 가득한 🔥 개발자!" |

## Component Patterns

동작 규칙만 다룬다. 시각 명세는 `DESIGN.md`의 Components에 있다.

| Component | Use | Behavioral rules |
|---|---|---|
| Nav bar | 전 페이지 상단 고정 | 로고(점-선-점 모티프 + "안서진")를 누르면 홈 최상단으로 간다. 항목을 누르면 해당 앵커로 이동하고 해시를 history에 push하므로, 뒤로 가기로 돌아올 수 있다. 스크롤 스파이는 URL을 바꾸지 않고 활성 항목만 갱신한다. 768px 미만에서는 "메뉴" 버튼이 패널을 연다. 패널은 링크 클릭, Esc, 바깥 클릭으로 닫히고, 닫히면 포커스가 버튼으로 돌아온다. |
| Section progress | Nav bar 하단 | 스크롤 진행 비율을 실시간으로 반영한다(홈은 문서 전체, 상세는 본문 article 기준). 상호작용은 없다. |
| Section label | 홈 각 섹션 제목 위 | 정적 텍스트라 상호작용이 없다. 점-선-점 모티프는 장식이므로 `aria-hidden`이다. 영문 라벨은 h2 제목과 함께 읽히도록 h2 안이 아니라 바로 앞에 둔다. |
| Button | 히어로, 상세 헤더, 404, About 연락처, Contact band | primary는 페이지당 1개다. 단, 포커스를 받을 때만 보이는 "본문으로 건너뛰기" 링크는 예외다. 외부 링크는 새 탭으로 열고 ↗ 아이콘을 붙인다. 링크가 없는 버튼(DevOops·MoonSunPower·Moa의 서비스)은 비활성으로 두지 말고 아예 렌더링하지 않는다. NEW:LEARN 상세 헤더의 "프로토타입 보기 ↗"는 사이트에 함께 올린 프로토타입 HTML(약 6MB, 최신본 v15 [ASSUMPTION])을 새 탭으로 연다(첨부는 사용자 결정). "포트폴리오 PDF 받기"는 secondary다. |
| Hero | 홈 첫 화면 | 정체성 문장 「기획과 UI/UX 디자인을 이해하고, 사용자 경험과 흐름을 설계하는 프론트엔드 개발자」가 h1이다. CTA 버튼은 두지 않는다(2026-10-16 사용자 결정: 첫 화면에 보이는 게 너무 많음. GitHub는 About의 아카이브와 Contact band에서 연결). 배치·강조색·첫 화면 높이는 `DESIGN.md`의 Hero와 Layout & Spacing을, 리빌 타이밍은 Interaction Primitives를 따른다. |
| Keyword pillar | 히어로(h1 아래) | 정적이며 상호작용이 없다. "관련" 줄의 프로젝트명은 링크가 아닌 텍스트다(Tab 흐름을 늘리지 않음) [ASSUMPTION]. 기둥 3개는 `ol` 목록이고, 제목은 h2·h3가 아닌 강조 텍스트다(문서 개요에 섹션을 늘리지 않음) [ASSUMPTION]. |
| Proof chip | 히어로 | 칩마다 증거 위치로 가는 링크다(링크 대상은 Project Card Content Model › 히어로 콘텐츠). 칩은 2개이고 순서는 고정이다. |
| Project card | Work | 카드 전체가 링크 하나다(카드 안에 다른 링크를 두지 않는다). hover·포커스 시 미리보기가 확대된다(Interaction Primitives). 슬롯·높이 규칙은 Project Card Content Model › 카드 슬롯 규칙을 따른다. |
| Award badge | 카드, 상세 헤더 | 정적 표시라 상호작용이 없다. 수상명 원문을 줄이지 않는다. |
| Status pill | NEW:LEARN 카드, 상세 헤더 | 정적 표시다. "진행 중" 텍스트만 쓰고 수상처럼 보이는 아이콘을 넣지 않는다. 프로젝트가 끝나면 pill을 빼고 기간을 확정한다 [ASSUMPTION]. |
| Metric stat | 프로젝트 카드(FINCH · 방긋 · OURWISH · MoonSunPower), 상세 헤더 | 수치가 있는 모든 카드에서, 화면에 50% 보이면 1회 카운트업한다. DOM 텍스트는 처음부터 최종값이고 애니메이션은 시각 전용이다. |
| Tech chip | Experience의 Skills | `button` 요소다. 누르면 칩 그룹 아래에 "사용한 프로젝트" 링크 목록이 펼쳐진다(한 번에 하나만, 다시 누르거나 Esc로 닫힘). 칩과 프로젝트의 연결은 각 프로젝트의 기술 스택 필드에서 만든다. 예정 스택은 사용 프로젝트 수에 넣지 않는다. NEW:LEARN은 프로토타입에서 이미 쓴 기술(SEED Design · React · TypeScript, Open Questions 4)만 집계하고, 나머지는 상세에 "사용 예정"으로만 표시한다 [ASSUMPTION]. |
| Case block | 상세 본문 | 원문 라벨을 그대로 쓴다(예: WHY · VALIDATION · CALCULATION · HOW · RESULT, ISSUE · APPROACH · RESULT). RESULT가 있으면 항상 마지막이다. 다이어그램은 확대하지 않고 블록 폭에 맞춘다. |
| Timeline row | Awards, Activities, Experience | Experience 항목은 요약(설명·역할·핵심 성과·링크)을 기본으로 보여주고, DAILY TICK의 파이프라인·검증 표는 "자세히 보기" 토글로 펼친다 [ASSUMPTION]. |
| Project pager | 상세 하단 | 이전/다음 프로젝트로 이동하며 순환하지 않는다. 양 끝에서는 비는 쪽 칸을 "전체 프로젝트"(→ `/#work`)로 바꾼다. |
| Contact band | 제거됨(2026-10-16 사용자 결정, 연락처는 About에만) | `mailto:` 링크, "이메일 복사" 버튼, 휴대폰 번호(`tel:` 링크), "포트폴리오 PDF 받기" 버튼, GitHub ↗, velog ↗을 담는다(사용자 결정, PDF 버튼 위치는 [ASSUMPTION]). About의 연락처 블록도 같은 항목을 담는다. 복사 결과는 toast로 알린다. |
| Toast | Contact band 복사 | 화면 하단에 2.5초 표시 후 사라진다. 포커스를 옮기지 않는다. 동시에 1개만 띄운다. |
| Focus ring | 모든 상호작용 요소 | `:focus-visible`에서만 표시한다. 어두운 띠 위에서는 `{components.focus-ring.color-on-inverse}`를 쓴다. 스티키 내비에 가려지지 않게 한다. |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| 첫 로드 | 홈·상세 | 텍스트를 즉시 렌더링한다. Pretendard는 `font-display: swap`에 크기를 맞춘 폴백을 둬서 레이아웃 이동을 최소화한다. 히어로 리빌은 1회만 재생한다. |
| 이미지 로딩 | 카드·상세 | 고정 비율 `{colors.surface-subtle}` 프레임을 먼저 보여준다. 첫 화면 밖 이미지는 lazy 로드한다. 텍스트와 숫자를 먼저 읽을 수 있다. |
| 이미지 실패 | 카드·상세 | 프레임은 그대로 두고 가운데에 프로젝트명을 `{typography.caption}` `{colors.ink-secondary}`로 표시한다. alt는 유지한다. |
| JS 미실행·실패 | 전체 | 모든 콘텐츠가 기본으로 보인다. 리빌용 숨김은 JS가 클래스를 붙였을 때만 적용한다. 숫자는 최종값으로 보이고, 앵커는 일반 링크로 동작한다. |
| 모션 감소 | 전체 | Interaction Primitives의 감소 열을 적용한다. |
| 앵커 딥링크 | `/#about` 등 | 로드 후 해당 섹션으로 이동하되 `{spacing.nav-height}`만큼 띄운다. 활성 내비를 동기화한다. |
| 상세에서 홈으로 복귀 | 홈 | 뒤로 가기든 "전체 프로젝트" 링크든 클릭했던 카드 위치로 돌아간다. |
| 레거시 해시 경로 | `#/about`, `#/projects/<slug>`, `#/tech`, `#/activities` | 새 경로로 replace 리다이렉트한다. 예전 사이트의 첫 화면이 About 탭이었으므로 `#/about`은 `/`(홈 최상단)로 보낸다. 그 밖의 예: `#/projects/finch` → `/projects/finch`, `#/tech` → `/#experience`. 이미 제출한 지원서 링크를 보호하기 위해서다 [ASSUMPTION]. |
| 없는 slug | `/projects/<unknown>` | Not found 화면에 "찾는 프로젝트가 없어요."와 "전체 프로젝트 보기" 버튼을 둔다. 내비와 `contact-band`는 유지한다. |
| 짧은 상세 | `/projects/moa`, `/projects/newlearn` | Moa는 요약과 트러블슈팅, NEW:LEARN은 진행 단계(서비스 소개 → PRD → 디자인 시스템 → 프로토타입) 바로 다음에 pager를 붙인다. 빈 여백을 남기지 않는다. NEW:LEARN은 진행에 따라 섹션을 덧붙이고, 서비스·GitHub 링크가 없으면 버튼을 렌더링하지 않는다(Button 규칙). |
| 메뉴 열림 | 모바일 Nav bar | 패널 아래 본문 스크롤을 잠근다. 닫힘 조건은 Component Patterns의 Nav bar를 따른다. |
| 칩 펼침 | Skills | 펼친 목록이 레이아웃을 크게 밀어내지 않게 한다(위치와 개수는 Component Patterns의 Tech chip). |
| PDF 받기 | Contact band, About | `download` 속성으로 같은 탭에서 `anseojin-portfolio.pdf`를 내려받는다. 새 탭을 열지 않으며, 모바일에서도 같다. |
| 복사 성공 / 실패 | Contact band | 성공하면 "이메일 주소를 복사했어요."를 띄운다. 실패하면(권한 거부) 주소 텍스트를 선택 상태로 두고 "복사하지 못했어요. 선택된 주소를 직접 복사해 주세요."를 띄운다. |

## Interaction Primitives

- **클릭·탭**: 카드 하나는 링크 하나다. 외부 링크는 모두 새 탭으로 열리고 ↗ 아이콘이 붙는다. 내부 링크는 같은 탭에서 열린다.
- **Hover는 보너스다**: hover 없이도 모든 정보가 보여야 한다. hover 효과는 `@media (hover: hover)`에서만 켜고, 키보드 `:focus-visible`에도 같은 효과를 준다.
- **Pager hover**: `project-pager`는 hover·`:focus-visible`에서 테두리가 `{components.project-pager.border-hover}`로 바뀌고 `DESIGN.md`의 hover 그림자가 나타난다. 이동은 없다.
- **앵커 이동**: 부드러운 스크롤(≤ 600ms)을 쓰고, 모션 감소 설정이면 즉시 이동한다. `scroll-padding-top`은 `{spacing.nav-height}`다.

모션 4종 [ASSUMPTION]:

| Motion | Trigger | Spec | `prefers-reduced-motion: reduce` |
|---|---|---|---|
| 스크롤 리빌 | 요소 상단이 뷰포트 하단 15% 안에 들어올 때, 1회 | opacity 0→1, translateY 16px→0, 480ms, `cubic-bezier(0.2, 0, 0, 1)`. 형제 요소는 60ms 간격(최대 4개). 히어로는 첫 로드에 줄 단위로, 총 900ms 이하 | 즉시 표시 |
| 숫자 카운트업 | `metric-stat`이 50% 보일 때, 1회 | 0 → 최종값 900ms ease-out, `tabular-nums` | 최종값을 즉시 표시 |
| 카드 미리보기 확대 | hover 또는 `:focus-visible` | 미디어 scale 1.04 + 카드 translateY −4px (240ms), 테두리가 `{components.project-card.border-hover}`로 바뀌고 그림자가 나타남 | 테두리·그림자만, 이동·확대 없음 |
| 섹션 진행 표시 | 스크롤 | `section-progress` 바가 스크롤 비율을 따라감. 활성 내비 밑줄 전환 200ms | 바는 유지, 밑줄 전환 없음 |

**금지**: 스크롤 하이재킹, 패럴랙스, 자동 재생 캐러셀, 커스텀 커서, 히어로 타이핑 효과, 로딩 스플래시, 1초를 넘는 모션, 반복·무한 모션, 애니메이션이 끝나야 읽을 수 있는 콘텐츠.

## Accessibility Floor

동작 기준만 다룬다. 색 대비는 `DESIGN.md`의 Colors에 있다. 전체는 WCAG 2.2 AA 기준이다 [ASSUMPTION].

- 키보드만으로 모든 기능(내비, 메뉴, 카드, 칩, pager, 복사)을 쓸 수 있다. Tab 순서는 읽기 순서와 같다. 첫 Tab에서 "본문으로 건너뛰기" 링크가 나온다.
- 키보드 포커스(`:focus-visible`)에서는 포커스 링을 반드시 표시하고(`outline: none` 금지), 스티키 내비가 포커스 요소를 가리지 않는다(2.4.11).
- 랜드마크는 `header` / `nav` / `main` / `footer`다. h1은 페이지당 하나(홈은 정체성 문장, 상세는 프로젝트명)이고 섹션 제목은 h2다. 문서 언어는 `<html lang="ko">`로 지정한다.
- 활성 내비 항목에는 `aria-current="location"`을 단다. 메뉴 버튼과 tech chip은 `aria-expanded`와 `aria-controls`를 쓴다.
- 이미지 alt는 현행 문구를 재사용한다. 다이어그램 alt에는 흐름 요약을 넣고(예: "후보 상품 필터링 → 우대조건 판별 → 세후 수령액 계산 → 추천 결과 생성"), 장식 이미지는 `alt=""`로 둔다.
- 스크린리더는 `metric-stat`의 최종값과 설명을 한 번만 읽는다. 카운트업 레이어는 `aria-hidden`이다.
- 새 탭 링크에는 "(새 창)"을 스크린리더용 텍스트로 붙인다. Toast는 `role="status"`(polite)다.
- 대상 크기는 최소 24×24px(2.5.8)이고, 모바일 버튼·칩·메뉴 항목은 높이 44px 이상이다.
- 200% 확대와 320px 폭에서 가로 스크롤이 생기지 않는다(1.4.10).
- `prefers-reduced-motion`을 준수한다. 모든 모션은 1초 이하이고 반복하지 않는다.

## Responsive & Platform

| Breakpoint | Behavior |
|---|---|
| ≥ 1280px | `DESIGN.md` Layout & Spacing의 기본 그리드 그대로(12컬럼, `{spacing.container-max}`) |
| 1024–1279px | 같은 구성, 컨테이너가 유동적으로 줄어듦. 여백은 `{spacing.margin-desktop}` |
| 768–1023px | 히어로 보조 단은 h1 아래로 내리고 키워드 기둥 3열은 유지 [ASSUMPTION]. 프로젝트 카드 2열 유지. 상세 상단은 세로로 쌓음(미디어 위). 내비 4항목 유지 |
| < 768px | 단일 열(프로젝트 카드 1열, 키워드 기둥 세로 쌓기), `{typography.display-mobile}` · `{typography.headline-mobile}`, 섹션 간격 `{spacing.9}`, 여백 `{spacing.margin-mobile}`. 내비는 로고 + "메뉴", `proof-chip`은 줄바꿈, hover 효과는 `@media (hover: hover)` 기기에서만(Interaction Primitives) |
| 320px | 최소 지원 폭. 가로 스크롤 없음 |

최신 Chrome · Edge · Safari · Firefox를 지원한다. 대기업 사내 PC의 Edge를 고려한다. `color-scheme: light`로 OS가 다크 모드여도 같은 화면을 보여주며 강제 반전을 막는다. 가로형 웹 스크린샷과 세로형 모바일 스크린샷은 모든 폭에서 `contain`으로 잘리지 않게 한다. 링크가 메신저·메일로 공유되므로 페이지마다 고유한 `<title>`과 OG 미리보기(홈은 정체성 문장, 상세는 프로젝트명 + 카드 한 줄)를 둔다 [ASSUMPTION].

## Inspiration & Anti-patterns

- **Inspiration**: 사용자가 준 레퍼런스 사이트는 아직 없다. 대신 렌더링한 후보 중에서 색 테마 1 슬레이트 블루(`.working/color-themes-1.html`)와 히어로 A+B 혼합(`.working/hero-directions-1.html`)을 골랐다(사용자 결정).
- **Rejected: 채도 높은 현행 블루.** 첫 목업(`.working/key-home.html`)에서 `#1F5EEB`(S84%)가 너무 쨍하다는 피드백으로 슬레이트 블루(S44%)로 바꿨다(사용자 결정).
- **Rejected: 기둥만 있는 히어로(시안 B 단독).** 세 역량이 별도 직무 트랙처럼 읽힐 위험이 있어, 키워드를 h1 한 문장 안에 넣은 시안 A와 섞었다.
- **Rejected: 이름 중심 히어로.** `imports/current-about-hero.png` 기준, 영문 이름과 증명사진이 최대 요소이고 정체성 문구는 About 세 번째 블록에 묻혀 있다(첫 화면 밋밋함, 어떤 개발자인지 안 드러남).
- **Rejected: 스크롤 아래의 증거.** `imports/current-about-full.png` 기준, SSAFY 1위 2회가 Awards 박스 안에 있고 Tech Skills는 이미지 1장이다(검색·선택·스크린리더 불가).
- **Rejected: 탭 뒤에 숨은, 스택만 보이는 카드.** `imports/current-projects.png` 기준, 프로젝트는 별도 탭에 있고 카드에는 스택만 노출된다. 588개 조합 대조 같은 정량 성과는 상세에만 있다(프로젝트가 눈에 안 들어옴). 카드를 모두 같은 크기로 두는 것은 유지한다(사용자 결정, 8개).
- **Rejected: 기술 스택 필터 버튼.** 현행의 전체/React/Vue/React Native/Next.js/Flutter/수상 필터는 없앤다(위임받은 코치 결정). 8개뿐이라 필터의 이득이 작고, 기술과 프로젝트의 연결은 Skills의 `tech-chip`이 맡는다.
- **Kept: 점-선-점 모티프.** 현행의 작은 사각형 두 개를 잇는 마크는 내비 로고와 영문 섹션 라벨 앞, 두 곳에서만 쓴다(위임받은 코치 결정). 시각 명세는 `DESIGN.md`에 있다.
- **Rejected: 정적인 화면, 그리고 그 반대인 과잉 모션.** 탭 전환 외에 반응이 없던 문제를 4종 모션으로 풀되, 금지 목록으로 상한을 둔다(동적이지 않음, 안 예쁨).

위 캡처는 현재 상태를 기록한 것이다.

## Key Flows

### Flow 1: 화요일 오후 회의 사이, 지원자 링크 40개를 노트북으로 훑는 스타트업 FE 리드 한도윤

1. 지원서의 포트폴리오 링크를 새 탭으로 연다.
2. 히어로가 줄 단위로 리빌된다. 세 키워드가 강조된 정체성 문장, 오른쪽 단의 `proof-chip` 2개, 그 아래 키워드 기둥 3개, 화면 하단에 WORK 라벨과 "프로젝트" 제목이 보인다.
3. 한 번 스크롤한다. 첫 행은 "진행 중" 표시가 붙은 NEW:LEARN과 FINCH이고, FINCH의 `metric-stat`이 20까지 올라간다. 다음 행에서 왼쪽 방긋은 21까지 올라가고, 오른쪽 OURWISH 카드는 같은 크기지만 588이라는 숫자와 최우수상(1위) 배지가 눈에 걸린다.
4. OURWISH 카드에 커서를 올리면 미리보기가 확대된다. 클릭해 `/projects/ourwish`로 간다.
5. 상세 헤더에서 최우수상(1위) 배지와 역할(기획·UI/UX·FE·AI 챗봇 프롬프트)을 확인한다.
6. 첫 `case-block`의 VALIDATION을 읽는다. "FE·BE 588개 조건 조합 대조 → 8건의 1원 차이, Decimal·부동소수점 절사 경계가 원인."
7. **Climax:** 도윤은 이 지원자가 UX를 말로만 하지 않고 데이터 1원 차이까지 검증한다는 것을 확인한다. "OURWISH Github ↗"를 새 탭으로 열고 면접 후보 메모에 이름을 적는다.
8. 뒤로 가기로 홈의 OURWISH 카드 위치에 돌아온다. 내비 Experience로 이동해 Skills의 "React" 칩을 누르고, 사용한 프로젝트(FINCH · Boogle · MoonSunPower, NEW:LEARN 포함 여부는 Open Questions 4)를 확인한다.

Failure: 스크린샷이 늦게 로드되어도 `{colors.surface-subtle}` 프레임이 비율을 지키므로 레이아웃이 밀리지 않는다. 텍스트와 숫자를 먼저 읽을 수 있다. 외부 서비스가 응답하지 않아도 상세 페이지만으로 판단할 수 있다.

### Flow 2: 사내 PC(Edge)에서 서류 한 건당 30초를 쓰는 대기업 인사 담당자 김수연(비개발 직군)

1. 지원서에 적힌 예전 링크(`…/#/about`)를 클릭하면 홈으로 리다이렉트된다.
2. 스크롤 없이 정체성 문장을 읽는다. "기획과 UI/UX 디자인을 이해하고, 사용자 경험과 흐름을 설계하는 프론트엔드 개발자."
3. 오른쪽 단 `proof-chip`의 "SSAFY 프로젝트 1위 2회"를 보고, 아래 키워드 기둥에서 세 단어의 근거 한 줄씩을 훑는다.
4. 한 번 스크롤해 프로젝트 카드의 수상 배지와 한국어 한 줄을 읽는다. 스택 용어는 마지막 줄이라 건너뛴다.
5. 내비 About을 누르고 학력(서강대 유럽문화(독일어 심화)/컴퓨터공학), 교육(SSAFY), 어학(OPIc IH · Goethe B1 · DELF A2)을 확인한다.
6. **Climax:** 기술 용어를 몰라도 30초 안에 평가표 세 줄을 채운다. "기획·UI/UX를 이해하는 FE 개발자 · SSAFY 1위 2회 · 3개 외국어."
7. `contact-band`에서 "이메일 복사"를 누르자 toast "이메일 주소를 복사했어요."가 뜬다.

Failure: 사내 정책으로 클립보드 권한이 거부되면 주소가 선택된 상태로 남고 실패 toast가 뜬다. 오래된 PC나 모션 감소 설정에서는 모든 콘텐츠가 애니메이션 없이 즉시 보인다.

### Flow 3: 면접 전날 밤, 사내 메신저로 받은 상세 링크를 휴대폰으로 여는 면접관 박지호(FE 시니어)

1. 메신저에서 `/projects/finch`를 연다. 상세가 단일 열로 바로 열린다(`{typography.display-mobile}` 프로젝트명, 기간, 역할).
2. 인증 섹션을 읽는다. 로그인 Callback과 세션 복구가 겹치며 생긴 Refresh Token 경합, 롤링 배포 중 502를 인증 실패로 오판하던 문제가 나온다.
3. **Climax:** 지호는 "일시적 502와 명시적 인증 거절을 어떻게 구분했나요?"를 면접 질문으로 메모한다. 포트폴리오가 면접 대화의 출발점이 된다.
4. `project-pager`로 다음 프로젝트(방긋)에 넘어가 같은 리듬으로 읽는다.

Failure: slug 오타(`/projects/fintch`)로 들어오면 Not found 화면의 "전체 프로젝트 보기"를 눌러 `/#work`로 간다.

## Open Questions

1. 원문 불일치: DevOops 기간(카드 2025.09–11, 상세 2025.04–10), Moa 설명(카드 "LG WebOS 기반 가족 소통 앱", 상세 "스탠바이미 전용 홈 화면"). PDF 기준으로 확정해야 한다.
2. 정량 성과 보강: DevOops(요청 감소량), Moa(반응 속도), Boogle(확보한 후보 수)에 수치가 있는지. 있으면 성과 슬롯을 `metric-stat`으로 바꾼다.
3. 히어로 `proof-chip` 2개 선정을 확인하고, Awards 목록에 Mash UP 1위 · 스타트캠프 아이디어톤 반 내 1위를 추가할지.
4. NEW:LEARN 스택 표기: 프로토타입에서 실제로 쓴 기술(Skills 집계 기준)을 확인하고, 아직 예정인 D3.js를 카드에 둘지 정한다. 카드 썸네일을 v3 캡처에서 v15 화면으로 바꿀지도 구현 때 정한다.
5. Technical Experience(DAILY TICK 파이프라인·검증 표)를 홈에서 인라인으로 펼칠지, 별도 상세 페이지로 뺄지.
6. 이미 제출한 지원서 링크의 형태(해시 경로 여부, 도메인 변경 계획). 이에 따라 리다이렉트 범위가 정해진다.
7. 모바일에서 가로로 긴 다이어그램(예: OURWISH 추천 로직 1400×217)은 블록 폭에 맞추면 읽을 수 없다. 확대 보기를 넣을지, 가로 스크롤을 허용할지.
