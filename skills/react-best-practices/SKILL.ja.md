---
name: vercel-react-best-practices
description: VercelエンジニアリングによるReactとNext.jsのパフォーマンス最適化ガイドラインです。このスキルは、React/Next.jsコードを作成、レビュー、またはリファクタリングして、最適のパフォーマンスパターンを確保する際に使用してください。Reactコンポーネント、Next.jsページ、データ取得、バンドル最適化、またはパフォーマンス改善に関連するタスクでトリガーされます。
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercelリアクトベストプラクティス

ReactおよびNext.jsアプリケーション向けの包括的なパフォーマンス最適化ガイド。Vercelによって保守されており、自動リファクタリングとコード生成をガイドするために優先付けされた8つのカテゴリーにわたる65のルールが含まれています。

## 適用するべき時

以下の場合、このガイドラインを参照してください：
- 新しいReactコンポーネントまたはNext.jsページを作成する時
- データ取得を実装する時（クライアント側またはサーバー側）
- パフォーマンスの問題についてコードをレビューする時
- 既存のReact/Next.jsコードをリファクタリングする時
- バンドルサイズまたは読み込み時間を最適化する時

## ルールカテゴリー（優先度順）

| 優先度 | カテゴリー | インパクト | プレフィックス |
|--------|----------|----------|-------------|
| 1 | ウォーターフォールの排除 | CRITICAL | `async-` |
| 2 | バンドルサイズ最適化 | CRITICAL | `bundle-` |
| 3 | サーバー側パフォーマンス | HIGH | `server-` |
| 4 | クライアント側データ取得 | MEDIUM-HIGH | `client-` |
| 5 | 再レンダリング最適化 | MEDIUM | `rerender-` |
| 6 | レンダリングパフォーマンス | MEDIUM | `rendering-` |
| 7 | JavaScriptパフォーマンス | LOW-MEDIUM | `js-` |
| 8 | 高度なパターン | LOW | `advanced-` |

## クイックリファレンス

### 1. ウォーターフォールの排除（CRITICAL）

- `async-defer-await` - awaitを実際に使用されるブランチに移動
- `async-parallel` - 独立した操作にPromise.all()を使用
- `async-dependencies` - 部分的な依存関係にbetter-allを使用
- `async-api-routes` - APIルートで早期にpromiseを開始、後に待機
- `async-suspense-boundaries` - Suspenseを使用してコンテンツをストリーミング

### 2. バンドルサイズ最適化（CRITICAL）

- `bundle-barrel-imports` - バレルファイルを避けて直接インポート
- `bundle-dynamic-imports` - ヘビーコンポーネント用にnext/dynamicを使用
- `bundle-defer-third-party` - ハイドレーション後に分析/ログを読み込み
- `bundle-conditional` - 機能が有効化されている場合のみモジュールを読み込み
- `bundle-preload` - ホバー/フォーカス時に知覚速度のためプリロード

### 3. サーバー側パフォーマンス（HIGH）

- `server-auth-actions` - APIルートと同様にサーバーアクションを認証
- `server-cache-react` - リクエスト単位の重複排除にReact.cache()を使用
- `server-cache-lru` - クロスリクエストキャッシングにLRUキャッシュを使用
- `server-dedup-props` - RSCプロップの重複シリアライゼーションを回避
- `server-hoist-static-io` - 静的I/O（フォント、ロゴ）をモジュールレベルに巻き上げ
- `server-serialization` - クライアントコンポーネントに渡すデータを最小化
- `server-parallel-fetching` - フェットをパラレル化するようコンポーネントを再構成
- `server-parallel-nested-fetching` - Promise.allでアイテムごとにネストされたフェットをチェーン
- `server-after-nonblocking` - ノンブロッキング操作にafter()を使用

### 4. クライアント側データ取得（MEDIUM-HIGH）

- `client-swr-dedup` - 自動リクエスト重複排除のためにSWRを使用
- `client-event-listeners` - グローバルイベントリスナーの重複を排除
- `client-passive-event-listeners` - スクロール用にパッシブリスナーを使用
- `client-localstorage-schema` - localStorageデータをバージョン管理および最小化

### 5. 再レンダリング最適化（MEDIUM）

- `rerender-defer-reads` - コールバックでのみ使用されるステートにサブスクライブしない
- `rerender-memo` - 高価な処理をメモ化されたコンポーネントに抽出
- `rerender-memo-with-default-value` - デフォルトの非プリミティブプロップを巻き上げ
- `rerender-dependencies` - エフェクトで依存関係をプリミティブに使用
- `rerender-derived-state` - 生の値ではなく、派生ブール値にサブスクライブ
- `rerender-derived-state-no-effect` - エフェクトではなく、レンダリング中に状態を派生
- `rerender-functional-setstate` - 安定したコールバックに関数的setStateを使用
- `rerender-lazy-state-init` - 高価な値にuseStateに関数を渡す
- `rerender-simple-expression-in-memo` - シンプルなプリミティブに対してmemoを使用しない
- `rerender-split-combined-hooks` - 依存関係が独立しているフックを分割
- `rerender-move-effect-to-event` - インタラクションロジックをイベントハンドラーに配置
- `rerender-transitions` - 非緊急な更新にstartTransitionを使用
- `rerender-use-deferred-value` - 入力をレスポンシブに保つため高価なレンダリングを遅延
- `rerender-use-ref-transient-values` - 一時的な頻繁な値にrefを使用
- `rerender-no-inline-components` - コンポーネント内でコンポーネントを定義しない

### 6. レンダリングパフォーマンス（MEDIUM）

- `rendering-animate-svg-wrapper` - SVG要素ではなく、divラッパーをアニメーション
- `rendering-content-visibility` - ロングリストにcontent-visibilityを使用
- `rendering-hoist-jsx` - 静的JSXをコンポーネント外に抽出
- `rendering-svg-precision` - SVG座標精度を低減
- `rendering-hydration-no-flicker` - クライアント専用データにインラインスクリプトを使用
- `rendering-hydration-suppress-warning` - 予期されたミスマッチを抑制
- `rendering-activity` - 表示/非表示のためにActivityコンポーネントを使用
- `rendering-conditional-render` - &&ではなく、三項演算子を条件付きレンダリングに使用
- `rendering-usetransition-loading` - ローディング状態にuseTransitionを優先
- `rendering-resource-hints` - プリロード用にReact DOMリソースヒントを使用
- `rendering-script-defer-async` - スクリプトタグでdeferまたはasyncを使用

### 7. JavaScriptパフォーマンス（LOW-MEDIUM）

- `js-batch-dom-css` - クラスまたはcssTextを通じてCSS変更をグループ化
- `js-index-maps` - 繰り返しルックアップ用にMapを構築
- `js-cache-property-access` - ループ内のオブジェクトプロップをキャッシュ
- `js-cache-function-results` - モジュールレベルのMap内で関数結果をキャッシュ
- `js-cache-storage` - localStorage/sessionStorageの読み取りをキャッシュ
- `js-combine-iterations` - 複数のfilter/mapを1つのループに統合
- `js-length-check-first` - 高価な比較の前に配列長をチェック
- `js-early-exit` - 関数から早期に戻る
- `js-hoist-regexp` - RegExp作成をループの外に巻き上げ
- `js-min-max-loop` - ソートの代わりにループを使用してmin/maxを取得
- `js-set-map-lookups` - O(1)ルックアップにSet/Mapを使用
- `js-tosorted-immutable` - イミュータビリティのためにtoSorted()を使用
- `js-flatmap-filter` - マップとフィルターを1パスで実行するflatMapを使用
- `js-request-idle-callback` - ブラウザアイドル時間に非クリティカルな作業を遅延

### 8. 高度なパターン（LOW）

- `advanced-event-handler-refs` - refでイベントハンドラーを保存
- `advanced-init-once` - アプリ読み込みごとに1回初期化
- `advanced-use-latest` - 安定したコールバックrefsのためにuseLatestを使用

## 使用方法

個別のルールファイルで詳細な説明とコード例を読んでください:

```
rules/async-parallel.md
rules/bundle-barrel-imports.md
```

各ルールファイルには以下が含まれます：
- なぜこれが重要かの簡潔な説明
- 説明付きの間違ったコード例
- 説明付きの正しいコード例
- 追加のコンテキストと参考文献

## 完全なコンパイルされたドキュメント

すべてのルールが展開された完全なガイド：`AGENTS.md`
