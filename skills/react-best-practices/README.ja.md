# React ベストプラクティス

エージェントとLLMsに最適化されたReactベストプラクティスを作成・保守するための構造化されたリポジトリです。

## 構造

- `rules/` - 個別ルールファイル（ルール1つにつき1ファイル）
  - `_sections.md` - セクションメタデータ（タイトル、インパクト、説明）
  - `_template.md` - 新しいルール作成用テンプレート
  - `area-description.md` - 個別ルールファイル
- `src/` - ビルドスクリプトとユーティリティ
- `metadata.json` - ドキュメントメタデータ（バージョン、組織、概要）
- __`AGENTS.md`__ - コンパイルされた出力（自動生成）
- __`test-cases.json`__ - LLM評価用テストケース（自動生成）

## 始める

1. 依存関係をインストール:
   ```bash
   pnpm install
   ```

2. ルールからAGENTS.mdを構築:
   ```bash
   pnpm build
   ```

3. ルールファイルを検証:
   ```bash
   pnpm validate
   ```

4. テストケースを抽出:
   ```bash
   pnpm extract-tests
   ```

## 新しいルールを作成する

1. `rules/_template.md`を`rules/area-description.md`にコピー
2. 適切なエリアプレフィックスを選択:
   - `async-` ウォーターフォールの排除（セクション1）
   - `bundle-` バンドルサイズ最適化（セクション2）
   - `server-` サーバー側パフォーマンス（セクション3）
   - `client-` クライアント側データ取得（セクション4）
   - `rerender-` 再レンダリング最適化（セクション5）
   - `rendering-` レンダリングパフォーマンス（セクション6）
   - `js-` JavaScriptパフォーマンス（セクション7）
   - `advanced-` 高度なパターン（セクション8）
3. フロントマターとコンテンツを記入
4. 明確な例と説明があることを確認
5. `pnpm build`を実行してAGENTS.mdとtest-cases.jsonを再生成

## ルールファイルの構造

各ルールファイルは以下の構造に従う必要があります：

```markdown
---
title: ルールタイトル
impact: MEDIUM
impactDescription: オプション説明
tags: tag1, tag2, tag3
---

## ルールタイトル

ルールの簡潔な説明とそれが重要な理由。

**間違い例（何が悪いかの説明）：**

\`\`\`typescript
// 悪いコード例
\`\`\`

**正解（何が正しいかの説明）：**

\`\`\`typescript
// 良いコード例
\`\`\`

例の後のオプション説明テキスト。

参考： [リンク](https://example.com)
```

## ファイルの命名規則

- `_`で始まるファイルは特殊です（ビルドから除外）
- ルールファイル：`area-description.md`（例：`async-parallel.md`）
- セクションはファイル名プレフィックスから自動的に推測されます
- ルールは各セクション内でタイトル順に並べられます
- ID（例：1.1、1.2）はビルド時に自動生成されます

## インパクトレベル

- `CRITICAL` - 最高優先度、大幅なパフォーマンスゲイン
- `HIGH` - 顕著なパフォーマンス向上
- `MEDIUM-HIGH` - 中程度から高いゲイン
- `MEDIUM` - 適度なパフォーマンス向上
- `LOW-MEDIUM` - 低から中程度のゲイン
- `LOW` - 段階的な改善

## スクリプト

- `pnpm build` - ルールをAGENTS.mdにコンパイル
- `pnpm validate` - すべてのルールファイルを検証
- `pnpm extract-tests` - LLM評価用テストケースを抽出
- `pnpm dev` - ビルドと検証

## 貢献

ルールを追加または修正する場合：

1. セクションに正しいファイル名プレフィックスを使用
2. `_template.md`の構造に従う
3. 説明付きの明確な悪い例/良い例を含める
4. 適切なタグを追加
5. `pnpm build`を実行してAGENTS.mdとtest-cases.jsonを再生成
6. ルールはタイトル順に自動的にソートされます— 番号を管理する必要はありません！

## 謝辞

もともと[@shuding](https://x.com/shuding)による[Vercel](https://vercel.com)での作成。
