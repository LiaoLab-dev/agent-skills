# Vercel CLI with Tokens - 詳細ガイド

トークン認証を使用したVercel CLIの管理スキルの詳細ガイドです。

## 📋 目次

1. [概要](#概要)
2. [トークン取得方法](#トークン取得方法)
3. [トークン設定](#トークン設定)
4. [Vercel CLI コマンド](#vercel-cli-コマンド)
5. [CI/CD 統合](#cicd-統合)
6. [トラブルシューティング](#トラブルシューティング)

---

## 概要

- **目的**: `vercel login` の対話型ログイン不要
- **認証方法**: トークンベース（トークンを環境変数に設定）
- **用途**: CI/CDパイプライン、自動化スクリプト、サーバー側処理
- **セキュリティ**: トークンは `.env` または シークレット環境変数で管理

### キーポイント

✅ **対話型ログイン不要** - スクリプト自動化に最適  
✅ **トークンで認証** - GitHub Actions、GitLab CI など完全対応  
✅ **複数アカウント対応** - スコープ別トークン設定可能  
✅ **自動検出** - トークン形式（`vca_*`）で自動認識

---

## トークン取得方法

### 方法1: Vercel ダッシュボードから（推奨）

1. **Vercel にログイン**
   - https://vercel.com/account/

2. **Settings → Tokens に移動**
   - https://vercel.com/account/tokens

3. **新規トークン作成**
   - トークン名: 「GitHub Actions」など分かりやすい名前
   - スコープ: 「All Scopes」または特定スコープ
   - 有効期限: 推奨は 90 日・自動更新

4. **トークンをコピー**
   ```
   vca_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 方法2: CLI から作成

```bash
# トークン作成（プロンプト指示に従う）
vercel token create

# リスト表示
vercel token ls

# トークン削除
vercel token rm {tokenId}
```

### 方法3: API で作成

```bash
curl -X POST "https://api.vercel.com/v3/auth/token" \
  -H "Authorization: Bearer $EXISTING_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CI Token",
    "expiresAt": 1704067200
  }'
```

---

## トークン設定

### 方法1: 環境変数として設定（推奨）

```bash
# .env ファイル（ローカル開発）
VERCEL_TOKEN=vca_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# または
export VERCEL_TOKEN=vca_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# または（.bashrc/.zshrc に追加）
echo 'export VERCEL_TOKEN=vca_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' >> ~/.bashrc
source ~/.bashrc
```

**確認:**
```bash
echo $VERCEL_TOKEN
# → vca_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 方法2: GitHub Actions で設定

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          npm ci
          npm run build
          vercel deploy --prod --token=$VERCEL_TOKEN
```

**GitHub Secrets の設定方法:**
1. リポジトリ設定 → Secrets and variables → Actions
2. 「New repository secret」をクリック
3. 以下を追加：
   - `VERCEL_TOKEN`: トークン値
   - `VERCEL_ORG_ID`: Organization ID（Vercel ダッシュボード確認）
   - `VERCEL_PROJECT_ID`: Project ID（`.vercel/project.json` 確認）

### 方法3: GitLab CI で設定

```yaml
# .gitlab-ci.yml
stages:
  - deploy

deploy_to_vercel:
  stage: deploy
  image: node:18
  script:
    - npm ci
    - npm run build
    - curl -X POST https://api.vercel.com/v12/now/deployments \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -F "files=@dist"
  only:
    - main
```

**GitLab 環境変数設定:**
1. Settings → CI/CD → Variables
2. 「Add variable」をクリック
3. `VERCEL_TOKEN` を追加（Protected にチェック）

### 方法4: .env ファイルから自動抽出

```bash
# トークン自動検出（ファイル内の任意の variable 名）
if grep -q '^VERCEL_TOKEN=' .env; then
  export VERCEL_TOKEN=$(grep '^VERCEL_TOKEN=' .env | cut -d= -f2-)
elif grep -q '^DEPLOYMENT_TOKEN=' .env 2>/dev/null; then
  export VERCEL_TOKEN=$(grep '^DEPLOYMENT_TOKEN=' .env | cut -d= -f2-)
fi

# トークン検証
vercel whoami
```

---

## Vercel CLI コマンド

### 認証・プロジェクト管理

```bash
# 認証確認（トークン検証）
vercel whoami

# 利用可能なチーム表示
vercel teams list

# プロジェクトをVercelにリンク
vercel link

# プロジェクト情報表示
vercel project ls
```

### デプロイ

```bash
# Preview デプロイ（推奨）
vercel deploy

# Production デプロイ
vercel deploy --prod

# チームを指定
vercel deploy --scope=my-team

# 環境変数を指定
vercel deploy --env DATABASE_URL=xyz

# ビルド後すぐデプロイ（待機なし）
vercel deploy --no-wait

# ブラウザで開く
vercel deploy --open
```

### 環境変数管理

```bash
# 環境変数一覧
vercel env ls

# 環境変数追加（プロンプト入力）
vercel env add DATABASE_URL

# 環境変数を値で直接追加
vercel env add DATABASE_URL=mysql://localhost

# 環境変数削除
vercel env rm DATABASE_URL

# 全環境変数を表示
vercel env pull

# ローカル .env に保存
vercel env pull > .env.local
```

### デプロイ情報確認

```bash
# 最新デプロイ情報
vercel inspect

# デプロイ履歴
vercel logs

# 本番環境ログ表示
vercel logs --prod

# リアルタイムログ
vercel logs --follow
```

### その他の便利コマンド

```bash
# ローカル開発サーバー起動
vercel dev

# ビルド実行（ローカル検証）
vercel build

# プロジェクト削除
vercel remove

# 設定ファイル確認
vercel env list --json
```

---

## CI/CD 統合

### GitHub Actions での自動デプロイ

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: |
          npm install -g vercel
          vercel deploy --prod --token $VERCEL_TOKEN
```

### GitLab CI での自動デプロイ

```yaml
# .gitlab-ci.yml
image: node:18

stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

test:
  stage: test
  script:
    - npm run test

deploy_preview:
  stage: deploy
  script:
    - npm install -g vercel
    - vercel deploy --token $VERCEL_TOKEN
  only:
    - merge_requests

deploy_production:
  stage: deploy
  script:
    - npm install -g vercel
    - vercel deploy --prod --token $VERCEL_TOKEN
  only:
    - main
```

### Docker コンテナでの実行

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

ENV VERCEL_TOKEN=${VERCEL_TOKEN}

CMD ["npx", "vercel", "deploy", "--prod", "--token=$VERCEL_TOKEN"]
```

---

## トークンセキュリティ

### ✅ DO（安全な実践）

| 実践 | 理由 |
|-----|------|
| **トークンを `.env` に保存** | Git コミット前に `.gitignore` に追加 |
| **GitHub/GitLab Secrets 使用** | エンコードされて保存、ログ出力なし |
| **トークンに有効期限を設定** | 定期的に更新、漏洩リスク最小化 |
| **スコープを制限** | 必要最小限の権限で作成 |
| **複数トークンを環境別に作成** | 開発/本番でトークン分離 |
| **トークン漏洩時は即座に削除** | ダッシュボード → Tokens → 削除 |

### ❌ DON'T（危険な実践）

| 避けるべき | 理由 |
|----------|------|
| **トークンをコメント/ドキュメント記載** | 公開リポジトリなら漏洩 |
| **トークンをメールで送信** | インターセプト可能性 |
| **`vercel login` で対話型ログイン後、トークン見ない** | 必要に応じてトークン使用 |
| **本番環境でトークンを hardcode** | セキュリティ漏洩リスク |
| **複数プロジェクトで同じトークン** | 1つ漏洩すると全部危ない |

---

## トラブルシューティング

### 🚨 Token Not Found / Unauthorized

**症状:**
```
Error: Unauthorized. Please verify that your token is valid
```

**解決策:**
```bash
# 1. トークンが正しく設定されているか確認
echo $VERCEL_TOKEN

# 2. トークンが有効期限切れでないか確認
# → Vercel ダッシュボード → Tokens で確認

# 3. トークンを再作成
vercel token create

# 4. 新トークンを設定

# 5. 認証テスト
vercel whoami
```

### 🚨 Project Not Found

**症状:**
```
Error: Project not found. Please run `vercel link`
```

**解決策:**
```bash
# 1. プロジェクトをリンク
vercel link

# 2. `.vercel/project.json` が作成されたか確認
cat .vercel/project.json

# 3. Organization ID と Project ID が正しいか確認
# → `.vercel/project.json` に `orgId`, `projectId` が記載

# 4. GitHub Actions の場合は Secrets に追加
# Settings → Secrets → VERCEL_ORG_ID, VERCEL_PROJECT_ID
```

### 🚨 Permission Denied

**症状:**
```
Error: You do not have permission to access this project
```

**解決策:**
```bash
# 1. トークンのスコープが十分か確認
# → Vercel ダッシュボード → Tokens で「All Scopes」か確認

# 2. チームに属しているか確認
vercel teams list

# 3. 新トークンを作成（All Scopes）
vercel token create
```

### 🚨 Network Timeout

**症状:**
```
error: getaddrinfo ENOTFOUND api.vercel.com
```

**解決策:**
```bash
# 1. インターネット接続確認
ping api.vercel.com

# 2. Vercel API ステータス確認
# → https://vercel.statuspage.io/

# 3. プロキシ設定（必要な場合）
npm config set https-proxy [proxy-server-url]

# 4. 再試行
vercel deploy
```

---

## ベストプラクティス

### チーム開発時の推奨フロー

```bash
# 1. チーム内構成員がトークン作成
vercel token create

# 2. 管理者が GitHub/GitLab に Secrets として設定
# Settings → Secrets and Variables → Actions
# - VERCEL_TOKEN: トークン値
# - VERCEL_ORG_ID: Organization ID
# - VERCEL_PROJECT_ID: Project ID

# 3. CI ファイルでトークン参照
# (GitHubActions/GitLab CI/CircleCI)

# 4. 各構成員はローカル .env で開発
# echo "VERCEL_TOKEN=vca_..." >> .env
```

### 環境別トークン戦略

```bash
# 開発環境用トークン
VERCEL_TOKEN_DEV=vca_dev_xxxxx

# ステージング環境用トークン  
VERCEL_TOKEN_STAGING=vca_staging_xxxxx

# 本番環境用トークン
VERCEL_TOKEN_PROD=vca_prod_xxxxx

# デプロイ時に環境に応じて切り替え
if [ "$CI_ENVIRONMENT_NAME" = "production" ]; then
  export VERCEL_TOKEN=$VERCEL_TOKEN_PROD
else
  export VERCEL_TOKEN=$VERCEL_TOKEN_DEV
fi

vercel deploy --token=$VERCEL_TOKEN
```

---

## よくある質問

### Q: トークンはどこに保存されるの？

A: 以下の順序で検索されます：
1. 環境変数 `VERCEL_TOKEN`
2. `.env` ファイル内（`VERCEL_TOKEN=...`）
3. `~/.vercel` ディレクトリ（`vercel login` 後のローカル保存）

### Q: トークンの有効期限は？

A: 作成時に設定可能（デフォルト: 制限なし）
- セキュリティ考慮で 90 日など短めに設定推奨
- 有効期限切れ前に自動更新メール通知

### Q: 1つのトークンで複数プロジェクトをデプロイできる？

A: はい。ただし、環境別に複数トークン作成推奨
- 各プロジェクト → 専用トークン
- 漏洩時のリスク最小化

### Q: GitHub Actions でデプロイ失敗時は？

A: ログを確認してデバッグ：
```bash
# GitHub Actions ログで詳細表示
# Actions → Workflow → Job detail

# ローカルで同じ条件を再現：
export VERCEL_TOKEN=xxx
export VERCEL_ORG_ID=xxx
export VERCEL_PROJECT_ID=xxx
vercel deploy --prod
```

---

## チェックリスト

デプロイ自動化セットアップ：

- [ ] Vercel トークン作成（ダッシュボード）
- [ ] GitHub Actions Secrets に追加
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
- [ ] `.github/workflows/deploy.yml` 作成
- [ ] ローカル `.env` に `VERCEL_TOKEN` 設定
- [ ] `.gitignore` に `.env` 追加
- [ ] テストデプロイ（プレビュー）
- [ ] 本番デプロイ（Main ブランチ push）
- [ ] ログ確認・エラーハンドリング

---

**詳細資料**: [skills-breakdown.md](skills-breakdown.md)
