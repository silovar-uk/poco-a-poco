# Poco a Poco — Design Research / 2026-08-31

## Mission

MVPの機能構造を保ちながら、「よくできた普通のEdTech UI」から、一目でPoco a Pocoと分かるLearning Productへ進化させる。

成功条件は「派手」ではなく、**スペイン語が見る言葉から、自分が話す言葉へ少しずつ変わることをUI自体が表現すること**。

## Research sources

- Duolingo — Core tabs redesign: https://blog.duolingo.com/core-tabs-redesign/
  - まず大胆に複数方向へ発散し、その後 consistency / simplicity / learning experienceへ収束するプロセスを参照。
- Apple Human Interface Guidelines — Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
  - iOSの標準コントロールサイズ44×44pt、十分な間隔を維持。
- Apple — Reduced Motion evaluation criteria: https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria
  - motionは意味のある状態変化に限定し、prefers-reduced-motionでは停止。
- Editorial web references searched across 2025–2026 examples.
  - oversized type / asymmetric grid / cardsを減らし、typographyと余白で階層を作る原則を抽出。
- Contemporary language-learning UI references.
  - bottom navigation / progress / CTAなど「迷わせない普通」は残す一方、カード中心の均質化は避ける。

## NORMAL 100

2026年時点の「かなり良いが普通」の学習アプリを以下と定義。

- system sans中心、明確なtype hierarchy
- 4〜5項目のbottom navigation
- 44pt以上のtap target
- 主要CTAが1つ
- rounded cardsでlesson / progress / discoveryを整理
- accent colorでsectionを区別
- short motionでfeedback
- mobile first / safe area / reduced motion対応
- lessonは一貫したshellの中でcontentのみ差し替える

現行Poco a Pocoは概ねこのNORMAL 100に到達していた。一方、固有のvisual grammarは弱かった。

## Design Council

### 01 THE NORMAL — Product Designer

- ナビと主要CTAは崩さない。
- 読める・押せる・戻れるを最優先。
- 驚きはlesson内部とeditorial surfaceに限定。

### 02 THE EDITOR — Editorial Art Director

- カードを減らす。
- Spanish typographyをコンテンツではなく画面構成材として使う。
- PATHは一覧、DISCOVERYはZINEとして別の誌面リズムを持たせる。

### 03 THE CHOREOGRAPHER — Motion Designer

- animationではなくstate transitionを設計。
- 同じsentenceが MEANING → CHUNK → RETRIEVE → SPEAK → CHANGE → PERSONALIZE と変わる感覚を作る。
- continuous motion / parallaxは不要。

### 04 THE TEACHER — Learning Experience Designer

- RETRIEVEとSPEAKでは情報を増やさず、むしろ減らす。
- learning stateごとに画面密度を変える。
- UIの面白さよりretrieval effortを守る。

### 05 THE WEIRDO — Interactive Designer

- 日本語が徐々に消えること自体をブランド表現にする。
- Lessonごとに背景・余白・type scaleを大胆に変える。
- 「同じカードの中身が変わるだけ」をやめる。

### 06 THE KILLER — Accessibility / Frontend Reviewer

- external font / WebGL / 3D / heavy animationは却下。
- 低性能mobileでも成立させる。
- reduced-motionで完全に意味が残ること。
- brand deviceは3つまでに制限。

## Directions

### A — Poco Quiet

cream / deep green / serif display。余白と活字中心。最も上質だが、単独では記憶性が弱い。

### B — Poco Type

Spanish sentenceを巨大なtypographic materialとして扱う。DISCOVERYとの相性が良い。単独では学習操作がvisualに埋もれるリスク。

### C — Poco Alive

lesson stateに応じてsentenceと空間が変化。最もプロダクト固有。ただし過剰motionは学習阻害になる。

### WILD CARD — Full-screen Morph

各stepを全面type animationでつなぐ。デモ映えは強いが、3日使うと疲れる可能性とperformance/accessibility costが高いため却下。

## Council decision

**Aの静けさを土台に、Bのeditorial typographyとCのstate designを統合する。**

採用名: `POCO DESIGN LANGUAGE v1 — Living Spanish`

## Three Signature Devices

### 1. Living Sentence

lesson上部にsentence spineを置き、同じ言葉が各stateを横断する。

ただしRETRIEVE / hidden SPEAKでは答えを表示しない。UI表現のために学習効果を壊さない。

### 2. Scaffold Fade

JP Level 1→4に応じて、日本語サポートの存在感を少しずつ弱める。単なるdisplay:noneではなく、「足場が減る」感覚をsupport meterとtype hierarchyで表現。

### 3. Step Atmospheres

- SCENE: warm / spacious / anticipatory
- MEANING: sentence first
- CHUNK: structural green
- RETRIEVE: dark memory space
- SPEAK: near-empty voice space
- CHANGE: phrase strips
- PERSONALIZE: notebook surface
- REUSE: calm green practical surface
- DONE: saffron typographic finish

## Red Team

- Dribbble映えだけか？ → cardsを減らしたが操作骨格は固定。
- 3日後に邪魔か？ → continuous motionなし。animationはstep entranceのみ。
- SpanishよりUIが目立つか？ → primary visualはSpanish type itself。
- mobile片手操作できるか？ → major controls 44–50px以上を維持。
- reduced motionで成立するか？ → `prefers-reduced-motion`でanimation/transition停止。
- Poco a Poco以外でも使えるか？ → Living Sentence + Scaffold Fade + 9 state atmospheresは本プロダクトのlearning loop固有。

## Implementation scope

- HOME: editorial cover + TODAY 5 as anchor
- PATH: card wall → typographic route
- PRACTICE: retrieval desk
- DISCOVERY: magazine grid
- LESSON: nine cognitive atmospheres
- stable bottom navigation remains intentionally conventional
- no AI / ASR / gamification additions
