# Deploy to Vercel - 詳細ガイド

アプリケーションとWebサイトをVercelに即座にデプロイするスキルの詳細ガイドです。

## 📋 目次

1. [概要](#概要)
2. [デプロイ方法](#デプロイ方法)
3. [フレームワーク自動検出](#フレームワーク自動検出)
4. [デプロイフロー](#デプロイフロー)
5. [ベストプラクティス](#ベストプラクティス)
6. [トラブルシューティング](#トラブルシューティング)

---

## 概要

- **目的**: AIエージェントから会話で即座にデプロイ
- **対応**: 40以上のフレームワーク
- **出力**: プレビューURL + Claim リンク
- **所有権**: Claimリンクから自分のアカウントに移行可能

### キーポイント

✅ **Preview デプロイ** - 本番ではなく、常にプレビュー  
✅ **自動フレームワーク検出** - package.json から推測  
✅ **node_modules/ と .git/ を除外** - 爆速アップロード  
✅ **即座にライブサイト** - デプロイ完了後すぐにURLが取得可能

---

## デプロイ方法

### 方法1: 新規プロジェクト（Git 未作成）

プロジェクトがまだ Git リポジトリでない場合：

```bash
# 1. プロジェクトディレクトリへ移動
cd my-project

# 2. Vercel 認証（初回のみ）
vercel login

# 3. デプロイ
vercel deploy
```

**出力例:**
```
Vercel CLI 28.0.0
? Set up and deploy "~/my-project"? [Y/n] y
Auto-detected project settings:
  Framework: Next.js
  Output Directory: .next
? Want to modify these settings? [y/N] n
✓ Linked to vercel-labs/my-project
✓ Built in 12s
✓ Created Deployment

🎉 Preview URL: https://my-project-abc123.vercel.app
📋 Production URL: https://my-project.vercel.app
```

### 方法2: 既存の Git リポジトリ

GitHubなどにプッシュ済みの場合：

```bash
# リポジトリをVercelにリンク
vercel link

# デプロイ
vercel deploy
```

### 方法3：コマンドラインパラメータ

```bash
# プレビューデプロイ（デフォルト）
vercel deploy

# 環境設定を指定
vercel deploy --env DATABASE_URL=xyz

# チーム内にデプロイ
vercel deploy --scope=my-team

# ビルドスキップ
vercel deploy --no-build

# デプロイ後、ブラウザで開く
vercel deploy --open
```

---

## フレームワーク自動検出

### 対応フレームワーク（40+）

| Framework | 検出方法 | Output Dir |
|-----------|--------|-----------|
| **Next.js** | `next` in package.json | `.next/` |
| **React** | `react`, `react-dom` | `build/` |
| **Vue.js** | `vue` in package.json | `dist/` |
| **Angular** | `@angular/core` | `dist/{name}/` |
| **Svelte** | `svelte` in package.json | `build/` |
| **Remix** | `@remix-run/react` | `build/` |
| **Astro** | `astro` in package.json | `dist/` |
| **Eleventy** | `@11ty/eleventy` | `_site/` |
| **Hugo** | Hugo config | `public/` |
| **Jekyll** | `jekyll` config | `_site/` |
| **Nuxt** | `nuxt` in package.json | `.nuxt/` |
| **Gatsby** | `gatsby` in package.json | `public/` |
| **Docusaurus** | `docusaurus` in package.json | `build/` |
| **Vite** | `vite` in package.json | `dist/` |
| **Nest.js** | `@nestjs/core` | `dist/` |
| **Express** | `express` in package.json | server で実行 |
| **Python** | `requirements.txt` or `pyproject.toml` | Python app |
| **Go** | `go.mod` | Go binary |
| **Ruby** | `Gemfile` | Ruby app |
| **PHP** | `composer.json` | PHP app |
| ... | ... | ... |

### 自動検出の例

```json
{
  "name": "my-next-app",
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

**Vercel の判定:**
1. `next` in dependencies → **Next.js**
2. Output Directory: `.next/`
3. Build Command: `next build`
4. Start Command: `next start`

---

## デプロイフロー

### 01. 状態確認

```bash
# プロジェクト状態をチェック
$ git remote get-url origin
# → Git リモートリポジトリ

$ cat .vercel/project.json 2>/dev/null || echo "Not linked"
# → Vercel リンク状況

$ vercel whoami 2>/dev/null
# → Vercel 認証状況

$ vercel teams list --format json 2>/dev/null
# → 利用可能なチーム
```

### 02. チーム選択

複数チームがある場合、ユーザーに選択を促す：

```
Available teams:
- vercel-labs (owner)
- my-startup-team
- client-team

? Which team to deploy to?
```

### 03. プロジェクトリンク（初回のみ）

```bash
# チームを指定してプロジェクトをリンク
vercel link --scope vercel-labs

# または自動リンク
vercel deploy --scope vercel-labs -y
```

### 04. ビルド & デプロイ

```bash
# 1. 依存関係インストール
npm ci

# 2. ビルド
npm run build

# 3. Vercel にアップロード
# node_modules と .git は除外

# 4. デプロイ完了
# Preview URL が generation される
```

### 05. 出力

```
✓ Deployment created (abc123def456)
✓ Production URL: https://my-app.vercel.app
✓ Preview URL: https://my-app-abc123.vercel.app

🎉 Ready to clone the deployment?
📋 Claim URL: https://vercel.com/claim-deployment?code=abc123
```

---

## ベストプラクティス

### ✅ DO（推奨）

| 実践 | 理由 |
|-----|------|
| **Preview デプロイを使用** | 本番変更を回避、テスト可能 |
| **自動フレームワーク検出に任せる** | 手動設定エラーを回避 |
| **.gitignore に node_modules 記載** | アップロード爆速化 |
| **環境変数を Vercel 設定で管理** | コード内にシクレット記載しない |
| **Custom domain を後に設定** | SEO保護、本番移行前にテスト |
| **Git に含める（package.json更新後）** | 再デプロイで状態復帰 |

### ❌ DON'T（避けるべき）

| 避けるべき | 理由 |
|----------|------|
| **本番環境に直接デプロイ** | バグが即座に本番反映 |
| **Vercel/credentials をコードに含める** | セキュリティ向上 |
| **デプロイ前のビルド確認なし** | ビルドエラーの本番反映 |
| **手動で Output Directory 設定** | フレームワーク更新で設定が古くなる |
| **すべてのブランチを本番にデプロイ** | 意図しない本番反映 |

---

## デプロイ設定カスタマイズ

### vercel.json の例

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "env": {
    "DATABASE_URL": "@db-url",
    "API_KEY": "@api-key"
  },
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:match*",
      "destination": "https://api.example.com/:match*"
    }
  ],
  "regions": ["sfo1", "iad1"]
}
```

### 環境変数の設定

```bash
# Vercel CLI で環境変数設定
vercel env add DATABASE_URL
# → プロンプトで値を入力

# すべての環境変数を確認
vercel env ls

# 環境変数を削除
vercel env rm DATABASE_URL
```

---

## トラブルシューティング

### 🚨 Build Failed

**症状**: ビルド時にエラー

```
Error: Could not find module "lodash"
```

**解決策:**
```bash
# 1. 依存関係確認
npm ls lodash

# 2. 不足している場合はインストール
npm install lodash

# 3. package.json をコミット
git add package.json package-lock.json
git commit -m "Add lodash"

# 4. デプロイ再試行
vercel deploy
```

### 🚨 Deployment Timeout

**症状**: デプロイが時間切れ

```
Build timed out after 900 seconds
```

**解決策:**
- ビルド時間を短縮（minify, treeshaking）
- `vercel.json` に `buildCommand` を最適化
- 大きなアセットは静的ホスティングに移動

### 🚨 Production Domain Error

**症状**: Production URL がリセット

```
Could not resolve https://my-app.vercel.app
```

**解決策:**
```bash
# Claim URL を使用して合法的に所有権移行
# https://vercel.com/claim-deployment?code=...

# 新しいアカウント内にプロジェクトが作成される
# その後、Custom Domain を設定可能
```

### 🚨 404 Not Found on Refresh

**症状**: 単一ページアプリ（SPA）でページリフレッシュが404

**原因**: ルーティングが SPA アプリケーションに委譲されていない

**解決策:** vercel.json に rewrites を追加

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Claim フロー

デプロイ後、**Claim URL** から所有権を移行：

### ステップ

1. **Claim URL を開く**
   ```
   https://vercel.com/claim-deployment?code=abc123
   ```

2. **Vercel アカウントにログイン**
   - Google, GitHub, GitLab でサインアップ可能

3. **プロジェクト詳細を入力**
   - プロジェクト名（例：my-super-app）
   - チーム選択（個人 or チーム）

4. **Git リポジトリをリンク（オプション）**
   - GitHub/GitLab接続で自動デプロイ設定可能

5. **Custom Domain 設定**
   - `my-domain.com` を指定
   - DNS レコード更新手順を表示

### 所有権移行後

- 🔐 プロジェクトは完全にあなたのもの
- ⚙️ 環境変数、デプロイ設定を自由に変更
- 🚀 自動デプロイ（Git push 時）設定可能
- 💳 本番環境使用量に応じた課金

---

## チェックリスト

デプロイ前に確認：

- [ ] ローカルでビルド確認：`npm run build`
- [ ] `.gitignore` に `node_modules/` 記載
- [ ] `package-lock.json` をコミット
- [ ] 環境変数が不要（またはVercelで設定済み）
- [ ] ビルド時間が 10分以内
- [ ] 本番データベースと別のテストDB使用か確認

デプロイ後：

- [ ] Preview URL でテスト
- [ ] Claim URL で所有権移行
- [ ] Custom Domain 設定
- [ ] 自動デプロイ（Git連携）設定

---

**詳細資料**: [skills-breakdown.md](skills-breakdown.md)
