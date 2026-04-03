# エージェントスキル

AIコーディングエージェント向けのスキル集です。スキルはエージェントの機能を拡張するためにパッケージ化された命令とスクリプトです。

スキルは[Agent Skills](https://agentskills.io/)フォーマットに準拠しています。

## 目次

- [利用可能なスキル](#利用可能なスキル)
  - [react-best-practices](#react-best-practices)
  - [web-design-guidelines](#web-design-guidelines)
  - [react-native-guidelines](#react-native-guidelines)
  - [composition-patterns](#composition-patterns)
  - [vercel-deploy-claimable](#vercel-deploy-claimable)
- [インストール](#インストール)
- [使用方法](#使用方法)
- [スキルの構造](#スキルの構造)
- [参考情報](#参考情報)
- [ライセンス](#ライセンス)

## 利用可能なスキル

### react-best-practices

Vercelエンジニアリングによる、Reactと Next.js のパフォーマンス最適化ガイドラインです。8つのカテゴリーにわたる40以上のルールが含まれており、インパクト順に優先付けされています。

**使用場面：**
- 新しいReactコンポーネントまたはNext.jsページを作成する時
- データ取得の実装（クライアント側またはサーバー側）
- パフォーマンスの問題についてコードをレビューする時
- バンドルサイズまたは読み込み時間を最適化する時

**カバーするカテゴリー：**
- ウォーターフォールの排除（Critical）
- バンドルサイズの最適化（Critical）
- サーバー側のパフォーマンス（High）
- クライアント側のデータ取得（Medium-High）
- 再レンダリングの最適化（Medium）
- レンダリングパフォーマンス（Medium）
- JavaScriptマイクロ最適化（Low-Medium）

### web-design-guidelines

UIコードをWebインターフェースのベストプラクティスに準拠しているかレビューします。アクセシビリティ、パフォーマンス、UXをカバーする100以上のルールに対してコードを監査します。

**使用場面：**
- 「UIをレビューして」
- 「アクセシビリティを確認して」
- 「デザイン監査してほしい」
- 「UXをレビューして」
- 「私のサイトをベストプラクティスに対して確認して」

**カバーするカテゴリー：**
- アクセシビリティ（aria-labels、セマンティックHTML、キーボードハンドラー）
- フォーカス状態（見えるフォーカス、focus-visibleパターン）
- フォーム（オートコンプリート、バリデーション、エラーハンドリング）
- アニメーション（prefers-reduced-motion、コンポジター対応のトランスフォーム）
- タイポグラフィ（カーリークォート、省略記号、tabular-nums）
- 画像（寸法、遅延読み込み、代替テキスト）
- パフォーマンス（仮想化、レイアウトスラッシング、プリコネクト）
- ナビゲーション＆ステート（URLが状態を反映、ディープリンク）
- ダークモード＆テーミング（color-scheme、theme-colorメタ）
- タッチ＆インタラクション（touch-action、タップハイライト）
- ロケール＆i18n（Intl.DateTimeFormat、Intl.NumberFormat）

### react-native-guidelines

AIエージェント向けに最適化されたReactネイティブベストプラクティスです。パフォーマンス、アーキテクチャ、プラットフォーム固有のパターンをカバーする7つのセクションにわたる16のルールが含まれています。

**使用場面：**
- React NativeまたはExpoアプリを構築する時
- モバイルパフォーマンスを最適化する時
- アニメーションやジェスチャーを実装する時
- ネイティブモジュールやプラットフォームAPIを使用する時

**カバーするカテゴリー：**
- パフォーマンス（Critical）- FlashList、メモ化、重い計算
- レイアウト（High）- flexパターン、セーフエリア、キーボードハンドリング
- アニメーション（High）- Reanimated、ジェスチャーハンドリング
- 画像（Medium）- expo-image、キャッシング、遅延読み込み
- ステート管理（Medium）- Zustandパターン、Reactコンパイラー
- アーキテクチャ（Medium）- モノレポ構造、インポート
- プラットフォーム（Medium）- iOS/Android固有のパターン

### composition-patterns

スケーラビリティを備えたReactコンポジションパターンです。複合コンポーネント、ステート昇格、内部コンポジションを通じて、ブール型プロップの増殖を回避します。

**使用場面：**
- 多くのブール型プロップを持つコンポーネントをリファクタリングする時
- 再利用可能なコンポーネントライブラリを構築する時
- 柔軟なAPIを設計する時
- コンポーネントアーキテクチャをレビューする時

**カバーするパターン：**
- 複合コンポーネントの抽出
- プロップ削減のためのステート昇格
- 柔軟性のための内部コンポジション
- プロップドリリングの回避

### vercel-deploy-claimable

アプリケーションとWebサイトをVercelに即座にデプロイします。claude.aiとClaude Desktopでの使用を想定しており、会話から直接デプロイを可能にします。デプロイは「claim可能」で、ユーザーは所有権を自分のVercelアカウントに移行できます。

**使用場面：**
- 「アプリをデプロイして」
- 「本番環境にデプロイして」
- 「これをライブにプッシュして」
- 「デプロイしてリンク教えて」

**機能：**
- `package.json`から40以上のフレームワークを自動検出
- プレビューURL（ライブサイト）とclaimリンク（所有権移行）を返却
- 静的HTMLプロジェクトを自動的に処理
- アップロードから`node_modules`と`.git`を除外

**動作原理：**
1. プロジェクトをtarballにパッケージ化
2. フレームワークを検出（Next.js、Vite、Astroなど）
3. デプロイサービスにアップロード
4. プレビューURLとclaimリンクを返却

**出力例：**
```
デプロイ成功！

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...
```

## インストール

```bash
npx skills add vercel-labs/agent-skills
```

## 使用方法

スキルはインストール後、自動的に利用可能になります。エージェントは関連タスクを検出すると、自動的にこれらを使用します。

**使用例：**
```
アプリをデプロイして
```
```
このReactコンポーネントをパフォーマンス問題についてレビューして
```
```
このNext.jsページを最適化するのを手伝ってほしい
```

## スキルの構造

各スキルには以下が含まれます：
- `SKILL.md` - エージェント向けの命令
- `scripts/` - 自動化用のヘルパースクリプト（オプション）
- `references/` - 補足ドキュメント（オプション）

## 参考情報

- **[Agent Skills 公式ウェブサイト](https://agentskills.io/)** - Agent Skillsについてのはじめての学習
- **[vercel-labs/agent-skills GitHub](https://github.com/vercel-labs/agent-skills)** - このスキルセットの公式リポジトリ
- **[Vercel 公式ドキュメント](https://vercel.com/docs)** - Vercelのデプロイメントガイド
- **[Next.js ドキュメント](https://nextjs.org/docs)** - Reactフレームワークのドキュメント
- **[React 公式ドキュメント](https://react.dev)** - Reactの最新ドキュメント
- **[vercel/next.js GitHub](https://github.com/vercel/next.js)** - Next.jsのリポジトリ

## ライセンス

MIT
