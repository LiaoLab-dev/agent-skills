# Agent Skills 詳細ガイド

`npx skills add vercel-labs/agent-skills` でインストール可能な6つのスキルについての詳細ガイドです。

## 概要

| # | スキル名 | 用途 | 導入優先度 |
|---|---------|------|----------|
| 1 | **React Best Practices** | React/Next.jsのパフォーマンス最適化 | 🔴 高 |
| 2 | **Composition Patterns** | スケーラブルなReactコンポーネント設計 | 🟡 中 |
| 3 | **Web Design Guidelines** | UI/UX/アクセシビリティのベストプラクティス | 🔴 高 |
| 4 | **React Native Skills** | モバイルアプリ開発のベストプラクティス | 🟡 中 |
| 5 | **Deploy to Vercel** | Vercelへのアプリケーションデプロイ | 🔴 高 |
| 6 | **Vercel CLI with Tokens** | トークン認証を使用したVercel CLIの管理 | 🟢 低 |

---

## 1️⃣ React Best Practices

### 概要
Vercel エンジニアリングによる、**React と Next.js のパフォーマンス最適化ガイドライン**です。65個のルールを8つのカテゴリーに分類し、インパクト順に優先付けされています。

### 主要カテゴリー（優先度順）

| カテゴリー | 優先度 | 説明 | 例 |
|----------|--------|------|-----|
| **Eliminating Waterfalls** | 🔴 CRITICAL | 非同期処理の逐次実行を排除 | Promise.all()の活用 |
| **Bundle Size Optimization** | 🔴 CRITICAL | バンドルサイズの最適化 | 動的インポート、トリーシェイキング |
| **Server-Side Performance** | 🟠 HIGH | サーバーサイド処理の最適化 | React.cache()の活用 |
| **Client-Side Data Fetching** | 🟡 MEDIUM-HIGH | クライアント側のデータ取得最適化 | SWR、リクエスト重複排除 |
| **Re-render Optimization** | 🟡 MEDIUM | 不要な再レンダリング排除 | React.memo()、useCallback() |
| **Rendering Performance** | 🟡 MEDIUM | レンダリング処理の最適化 | content-visibility、CSS活用 |
| **JavaScript Performance** | 🟢 LOW-MEDIUM | JavaScriptの微最適化 | ループ最適化、Set/Map活用 |
| **Advanced Patterns** | 🟢 LOW | 高度なパターン | useLatest、useRef活用 |

### 使用場面

✅ **こんな時に使おう：**
- 新しいReactコンポーネントやNext.jsページを作成する
- データ取得の実装（クライアント/サーバー側）
- パフォーマンス問題についてコードをレビューする
- バンドルサイズや読み込み時間を最適化したい

### 代表的なルール例

```javascript
// ❌ ウォーターフォール（悪い例）
const data = await fetchUser(id);
const posts = await fetchPosts(id);

// ✅ 並列実行（良い例）
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id)
]);
```

### 詳細ドキュメント
➡ 詳しくは [React Best Practices ドキュメント](react-best-practices.md) をご覧ください

---

## 2️⃣ Composition Patterns

### 概要
**スケーラビリティを備えたReactコンポジションパターン**です。複合コンポーネント、ステート昇格、内部コンポジションを通じて、ブール型プロップの増殖を回避します。これにより、コードベースがAIエージェントと人間の両方にとって保守しやすくなります。

### 主要カテゴリー

| カテゴリー | 優先度 | 説明 │
|----------|--------|------|
| **Component Architecture** | 🟠 HIGH | コンポーネント設計の原則 |
| **State Management** | 🟡 MEDIUM | 状態管理のパターン |
| **Implementation Patterns** | 🟡 MEDIUM | 実装の具体例 |
| **React 19 APIs** | 🟡 MEDIUM | React 19以降の新API（⚠️ React 18未満では不適用） |

### 使用場面

✅ **こんな時に使おう：**
- 多くのブール型プロップを持つコンポーネントをリファクタリングする
- 再利用可能なコンポーネントライブラリを構築する
- 柔軟なコンポーネントAPIを設計する
- コンポーネントアーキテクチャをレビューする

### 代表的なパターン例

```javascript
// ❌ ブール型プロップが増殖（悪い例）
<Button variant={type} size={size} disabled={disabled} loading={isLoading} />

// ✅ 複合コンポーネントパターン（良い例）
<Button>
  <Button.Icon />
  <Button.Label />
</Button>
```

### 詳細ドキュメント
➡ 詳しくは [Composition Patterns ドキュメント](composition-patterns.md) をご覧ください

---

## 3️⃣ Web Design Guidelines

### 概要
**UIコードがWebインターフェースのベストプラクティスに準拠しているかレビュー**するスキルです。アクセシビリティ、パフォーマンス、UXをカバーする100以上のルールに対してコードを監査します。

### カバーする領域

| 領域 | 説明 | 例 |
|------|------|-----|
| **アクセシビリティ** | ARIA、セマンティックHTML、キーボード対応 | `aria-label`、`aria-describedby` |
| **フォーカス状態** | 見えるフォーカスインジケート | `focus-visible` |
| **フォーム** | 入力検証、エラーハンドリング | 適切なラベル、エラーメッセージ |
| **アニメーション** | `prefers-reduced-motion` 対応 | GPU加速対応 |
| **タイポグラフィ** | 引用符、省略記号の適切な使用 | `<abbr>`タグ活用 |
| **画像** | alt属性、遅延ロード | 責任ある画像読み込み |
| **パフォーマンス** | 仮想化、レイアウトスラッシング排除 | `content-visibility` |
| **ナビゲーション** | URLが状態を反映、ディープリンク対応 |  |
| **ダークモード** | `color-scheme`、`theme-color` | 段階的なテーミング |
| **タッチ/インタラクション** | `touch-action`、タップハイライト | モバイル対応 |
| **ロケール/i18n** | `Intl.DateTimeFormat`、`Intl.NumberFormat` |  |

### 使用場面

✅ **こんな時に使おう：**
- UIをレビューしてほしい
- アクセシビリティをチェックしてほしい
- デザインの品質監査が必要
- UXをレビューしてほしい
- サイトをベストプラクティスに対して確認してほしい

### 代表的なチェック項目例

```html
<!-- ❌ 悪い例 -->
<button onclick="handleClick()">Click</button>
<img src="photo.jpg" />

<!-- ✅ 良い例 -->
<button aria-label="Submit form" onClick={handleClick}>
  Submit
</button>
<img src="photo.jpg" alt="User profile picture" loading="lazy" />
```

### 詳細ドキュメント
➡ 詳しくは [Web Design Guidelines ドキュメント](web-design-guidelines.md) をご覧ください

---

## 4️⃣ React Native Skills

### 概要
**React NativeとExpoアプリケーションの包括的なベストプラクティス**です。パフォーマンス、アーキテクチャ、プラットフォーム固有のパターンをカバーする8つのセクションにわたる複数のルールが含まれています。

### 主要カテゴリー（優先度順）

| カテゴリー | 優先度 | 説明 |
|----------|--------|------|
| **List Performance** | 🔴 CRITICAL | リスト処理の最適化 |
| **Animation** | 🟠 HIGH | アニメーション実装 |
| **Navigation** | 🟠 HIGH | ナビゲーション設計 |
| **UI Patterns** | 🟠 HIGH | UIパターンのベストプラクティス |
| **State Management** | 🟡 MEDIUM | 状態管理パターン |
| **Rendering** | 🟡 MEDIUM | レンダリング最適化 |
| **Monorepo** | 🟡 MEDIUM | モノレポ構造 |
| **Configuration** | 🟢 LOW | フォント、インポート設定 |

### 使用場面

✅ **こんな時に使おう：**
- React NativeまたはExpoアプリを構築する
- モバイルパフォーマンスを最適化したい
- アニメーションやジェスチャーを実装する
- ネイティブモジュールやプラットフォームAPIを使用する

### 代表的なパターン例

```javascript
// ❌ パフォーマンス問題（悪い例）
<FlatList data={items} renderItem={({item}) => <Item item={item} />} />

// ✅ 最適化版（良い例）
<FlashList
  data={items}
  renderItem={useCallback(({item}) => <MemoizedItem item={item} />, [])}
  estimatedItemSize={50}
/>
```

### 詳細ドキュメント
➡ 詳しくは [React Native Skills ドキュメント](react-native-skills.md) をご覧ください

---

## 5️⃣ Deploy to Vercel

### 概要
**アプリケーションとWebサイトを Vercel に即座にデプロイ**するスキルです。claude.aiとClaude Desktopでの使用を想定しており、会話から直接デプロイを可能にします。デプロイは「claim可能」で、ユーザーは所有権を自分のVercelアカウントに移行できます。

### 主要機能

- ✅ `package.json` から40以上のフレームワークを自動検出
- ✅ プレビューURL（ライブサイト）とclaimリンク（所有権移行）を返却
- ✅ 静的HTMLプロジェクトを自動的に処理
- ✅ アップロードから `node_modules` と `.git` を除外

### 動作フロー

```
1. プロジェクトをtarballにパッケージ化
   ↓
2. フレームワークを検出（Next.js、Vite、Astroなど）
   ↓
3. デプロイサービスにアップロード
   ↓
4. プレビューURLとclaimリンクを返却
```

### 使用場面

✅ **こんな時に使おう：**
- 「アプリをデプロイして」
- 「本番環境にデプロイして」
- 「これをライブにプッシュして」
- 「デプロイしてリンク教えて」

### 出力例

```
デプロイ成功！

Preview URL: https://skill-deploy-abc123.vercel.app
Claim URL:   https://vercel.com/claim-deployment?code=...
```

### 詳細ドキュメント
➡ 詳しくは [Deploy to Vercel ドキュメント](deploy-to-vercel.md) をご覧ください

---

## 6️⃣ Vercel CLI with Tokens

### 概要
**トークン認証を使用したVercel CLIの管理スキル**です。`vercel login` の対話型ログインに代わり、トークンを環境変数として使用し、CLIコマンドを実行できます。CI/CD環境やスクリプト自動化に最適です。

### 主要機能

- ✅ 環境変数 `VERCEL_TOKEN` からのトークン自動読み込み
- ✅ `.env` ファイルからのトークン抽出
- ✅ トークン形式の自動検出（例：`vca_` で始まるトークン）
- ✅ デプロイ、環境変数管理、プロジェクト設定などが可能

### トークンの用意方法

```bash
# 方法1: 環境変数として設定
export VERCEL_TOKEN=vca_your_token_here

# 方法2: .env ファイルに記載
echo "VERCEL_TOKEN=vca_your_token_here" >> .env

# 方法3: 別の変数名の場合
export YOUR_TOKEN_NAME=vca_your_token_here
```

### 使用場面

✅ **こんな時に使おう：**
- CI/CDパイプラインをセットアップする
- スクリプトから自動デプロイしたい
- 対話的なログインを避けたい
- 環境変数でトークンを管理したい

### 出力例

```bash
$ vercel whoami
✓ Authenticated as: your-username
✓ Team: your-team
```

### 詳細ドキュメント
➡ 詳しくは [Vercel CLI with Tokens ドキュメント](vercel-cli-with-tokens.md) をご覧ください

---

## インストール方法

### 自動インストール（推奨）

```bash
npx skills add vercel-labs/agent-skills
```

このコマンドで6つのスキルすべてがインストールされます。

### 手動インストール

各スキルをで直接配置する場合（ローカル開発用）：

```bash
# VS Code の設定に追加
# ~/.vscode/settings.json または workspaceSettings
{
  "chat.agentSkillsLocations": [
    "/path/to/repo/skills",
    "~/.claude/skills"
  ]
}
```

---

## よくある質問

### Q: どのスキルから始めるべき？

A: **導入優先度** を参考に、以下の順序をお勧めします：

1. **React Best Practices** - ほぼすべてのReact/Next.jsプロジェクトに有用
2. **Deploy to Vercel** - デプロイ時に即座に活用可能
3. **Web Design Guidelines** - UIコードの品質向上
4. **Composition Patterns** - 既存コンポーネントのリファクタリング
5. **React Native Skills** - モバイルプロジェクトの場合
6. **Vercel CLI with Tokens** - CI/CD自動化が必要な場合

### Q: スキル同士は競合する？

A: いいえ。各スキルは独立しており、複数のスキルを同時に活用できます。むしろ、複数スキルの組み合わせで最大の効果が発揮されます。

例：React Best Practices + Composition Patterns で、高性能でスケーラブルなコンポーネント設計が可能

### Q: スキルなしでAIエージェントは動く？

A: はい。スキルは **オプション機能** です。ただし、スキルを追加することで、エージェントがより精度の高い提案をしてくれます。

### Q: 自分でカスタムスキルを作成できる？

A: はい。Agent Skills フォーマットに従うことで、カスタムスキルを作成・配布できます。詳しくは [AGENTS.md](../AGENTS.md) をご覧ください。

---

## 参考リンク

- 📍 [Agent Skills 公式ウェブサイト](https://agentskills.io/)
- 📍 [vercel-labs/agent-skills GitHub](https://github.com/vercel-labs/agent-skills)
- 📍 [Vercel 公式ドキュメント](https://vercel.com/docs)
- 📍 [Next.js ドキュメント](https://nextjs.org/docs)
- 📍 [React 公式ドキュメント](https://react.dev)

---

**最終更新:** 2026年4月3日
