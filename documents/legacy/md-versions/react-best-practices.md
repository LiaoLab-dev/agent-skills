# React Best Practices - 詳細ガイド

Vercel エンジニアリングによるReactとNext.jsのパフォーマンス最適化ガイドラインの詳細版です。

## 📋 目次

1. [概要](#概要)
2. [適用シーン](#適用シーン)
3. [8つのカテゴリー詳細](#8つのカテゴリー詳細)
4. [実践的な例](#実践的な例)
5. [ルール検索ガイド](#ルール検索ガイド)

---

## 概要

- **ルール数**: 65個
- **カテゴリー数**: 8個
- **優先度レベル**: CRITICAL → HIGH → MEDIUM-HIGH → MEDIUM → LOW-MEDIUM → LOW
- **対象**: React 16.8+ / Next.js 12+
- **ライセンス**: MIT

このスキルは、Vercelで実際に使用されている本番環境のパフォーマンス最適化技術をベースにしています。

---

## 適用シーン

✅ **推奨される使用場面：**

| 場面 | 説明 |
|-----|------|
| 新規コンポーネント開発 | React/Next.jsの新しいコンポーネントやページを書く時 |
| コード見直し | パフォーマンス問題について既存コードをレビューする時 |
| データ取得実装 | クライアント/サーバー側のデータ取得を実装する時 |
| パフォーマンス改善 | バンドルサイズや読み込み時間を最適化したい時 |
| リファクタリング | 既存のReact/Next.jsコードを改善したい時 |
| チュートリアル | Reactのベストプラクティスを学びたい時 |

---

## 8つのカテゴリー詳細

### 1️⃣ Eliminating Waterfalls（ウォーターフォール排除）【CRITICAL】

**目的**: 非同期処理の逐次実行（ウォーターフォール）を排除し、並列実行を促進する

#### キーコンセプト

**ウォーターフォール** = 前の処理が完了してから次をする = ⏱️ 遅い

```javascript
// ❌ ウォーターフォール（悪い例）
const user = await fetchUser(id);        // 1秒待つ
const posts = await fetchPosts(id);      // さらに1秒待つ
const comments = await fetchComments(id); // さらに1秒待つ
// 合計: 3秒
```

**並列実行** = 全部同時に = ⚡ 速い

```javascript
// ✅ 並列実行（良い例）
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id)
]);
// 合計: 1秒（最も遅い処理に依存）
```

#### 対象ルール

| ルール名 | 説明 |
|--------|------|
| `async-defer-await` | awaitが本当に必要な場所だけに移動する |
| `async-parallel` | Promise.all()で独立した処理を並列化 |
| `async-dependencies` | 部分的な依存関係は`better-all`で処理 |
| `async-api-routes` | API ルート内で早期にPromiseを開始 |
| `async-suspense-boundaries` | Suspenseを使ったストリーミング |

#### 実装例

```javascript
// Next.js Server Action の例
async function getPostWithComments(postId) {
  // ❌ ウォーターフォール
  const post = await fetchPost(postId);
  const comments = await fetchComments(postId);
  
  // ✅ 正しい方法 - 早期に開始
  const postPromise = fetchPost(postId);
  const commentsPromise = fetchComments(postId);
  
  const [post, comments] = await Promise.all([
    postPromise,
    commentsPromise
  ]);
  
  return { post, comments };
}
```

---

### 2️⃣ Bundle Size Optimization（バンドルサイズ最適化）【CRITICAL】

**目的**: クライアント側に送信するJavaScriptのサイズを最小化

#### キーコンセプト

- **バンドルサイズ** = ブラウザが実行する総JavaScriptコード量
- 小さいほど = 🚀 早い読み込み、少ないメモリ使用

#### 対象ルール

| ルール名 | 説明 | 効果 |
|--------|------|------|
| `bundle-barrel-imports` | バレルインポートを避け、必要なモノだけインポート | 10-30% 削減 |
| `bundle-dynamic-imports` | 重いコンポーネントは動的インポート | 20-40% 削減 |
| `bundle-defer-third-party` | 分析・ロギングはhydration後にロード | 5-15% 削減 |
| `bundle-conditional` | 機能がアクティブな時だけモジュール読み込み | 15-25% 削減 |
| `bundle-preload` | ホバー/フォーカス時に次のリソースプリロード | ユーザー体験向上 |

#### 実装例

```typescript
// ❌ バレルインポート（すべてバンドルされる）
import * as utils from './utils';
// utils.js: 500KB
const result = utils.heavyFunction();

// ✅ 必要なもんだけインポート
import { heavyFunction } from './utils';
const result = heavyFunction();

// ❌ 大きなコンポーネントをバンドルに含める
import HeavyChart from './charts/HeavyChart';
export default function Dashboard() {
  return <HeavyChart />;
}

// ✅ 動的インポート
import dynamic from 'next/dynamic';
const HeavyChart = dynamic(() => import('./charts/HeavyChart'), {
  loading: () => <LoadingSpinner />,
  ssr: false // SSRスキップで初期バンドル削減
});

export default function Dashboard() {
  return <Suspense fallback={<LoadingSpinner />}>
    <HeavyChart />
  </Suspense>;
}
```

---

### 3️⃣ Server-Side Performance（サーバーサイドパフォーマンス）【HIGH】

**目的**: サーバー側でのデータ処理を最適化

#### 対象ルール

| ルール名 | 説明 |
|--------|------|
| `server-auth-actions` | Server ActionsでJWT認証を実行 |
| `server-cache-react` | React.cache()でリクエスト単位の重複排除 |
| `server-cache-lru` | LRUキャッシュ使用で複数リクエスト間のキャッシュ |
| `server-dedup-props` | RSC内で重複シリアライゼーションを避ける |
| `server-hoist-static-io` | フォント/ロゴをモジュール最上位に移動 |
| `server-serialization` | クライアントに渡すデータを最小化 |
| `server-parallel-fetching` | ネストされたfetchを再構成して並列化 |
| `server-after-nonblocking` | 非ブロックオペレーションに`after()`を使用 |

#### 実装例

```typescript
// ❌ リクエスト内で重複呼び出し
async function Page() {
  const user = await fetchUser(1);  // DB: SELECT * FROM users
  const posts = await fetchPosts(1); // DB: SELECT * FROM posts WHERE userId=1
  const profile = await fetchUser(1); // DB: SELECT * FROM users（重複！）
  
  return <div>{user.name}</div>;
}

// ✅ React.cache()で重複排除
import { cache } from 'react';

const getCachedUser = cache(async (id) => {
  return fetch(`/api/users/${id}`).then(r => r.json());
});

async function Page() {
  const user = await getCachedUser(1);  // 実行
  const posts = await fetchPosts(1);
  const profile = await getCachedUser(1); // キャッシュから返却
  
  return <div>{user.name}</div>;
}
```

---

### 4️⃣ Client-Side Data Fetching（クライアント側データ取得）【MEDIUM-HIGH】

**目的**: クライアント側のデータ取得を効率化

#### 対象ルール

| ルール名 | 説明 |
|--------|------|
| `client-swr-dedup` | SWRでリクエスト自動重複排除 |
| `client-event-listeners` | グローバルイベントリスナーの重複排除 |
| `client-passive-event-listeners` | scrollイベントはpassiveリスナーで |
| `client-localstorage-schema` | localStorage削減とバージョニング |

#### 実装例

```typescript
import useSWR from 'swr';

function UserProfile({ userId }) {
  // SWR = 自動的にリクエスト重複排除、キャッシング、再検証
  const { data, error, isLoading } = useSWR(
    `/api/users/${userId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.name}</div>;
}
```

---

### 5️⃣ Re-render Optimization（再レンダリング最適化）【MEDIUM】

**目的**: 不要な再レンダリングを排除

#### キーコンセプト

- **不要な再レンダリング** = 何も変わってないのに再実行 = 💾 メモリ/CPU浪費

#### 対象ルール

| ルール名 | 説明 |
|--------|------|
| `rerender-defer-reads` | コールバック内でのみ使う状態は購読しない |
| `rerender-memo` | 重い処理をmemoized componentに抽出 |
| `rerender-memo-with-default-value` | デフォルト値は外側で定義 |
| `rerender-dependencies` | useEffect依存配列はプリミティブ値を使う |
| `rerender-derived-state` | raw値ではなく派生値を購読 |
| `rerender-derived-state-no-effect` | Effectではなくrenderで派生状態を計算 |
| `rerender-lazy-state-init` | useStateには関数を渡して初期化遅延 |
| `rerender-split-combined-hooks` | 依存関係が異なるhookは分割 |
| `rerender-move-effect-to-event` | インタラクションロジックはイベントハンドラへ |
| `rerender-transitions` | 緊急でない更新はstartTransitionで |
| `rerender-use-deferred-value` | 負荷の高いレンダリング をdefer |
| `rerender-use-ref-transient-values` | 多更新値はrefで（再レンダリング不要） |
| `rerender-no-inline-components` | コンポーネント定義は関数内にしない |

#### 実装例

```typescript
// ❌ 毎回レンダリング（悪い例）
function Dashboard() {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);
  
  // filterが変わるたびに、DataTableも再レンダリング
  return (
    <div>
      <FilterInput value={filter} onChange={setFilter} />
      <DataTable data={data} /> {/* 不要な再レンダリング */}
    </div>
  );
}

// ✅ 必要な時だけレンダリング（良い例）
function Dashboard() {
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);
  
  return (
    <div>
      <FilterInput value={filter} onChange={setFilter} />
      <MemoizedDataTable data={data} /> {/* filterが変わっても再レンダリングなし */}
    </div>
  );
}

const MemoizedDataTable = React.memo(function DataTable({ data }) {
  return <table>{/* ... */}</table>;
});
```

---

### 6️⃣ Rendering Performance（レンダリングパフォーマンス）【MEDIUM】

**目的**: DOMレンダリング処理を最適化

#### 対象ルール

| ルール名 | 説明 |
|--------|------|
| `rendering-animate-svg-wrapper` | SVG要素ではなく、divラッパーをアニメート |
| `rendering-content-visibility` | 長いリストにはcontent-visibility使用 |
| `rendering-hoist-jsx` | 静的JSXはコンポーネント外に抽出 |
| `rendering-svg-precision` | SVG座標精度を削減 |
| `rendering-hydration-no-flicker` | クライアント専用データはinline scriptで |
| `rendering-hydration-suppress-warning` | 想定内のhydration不一致は抑制 |
| `rendering-activity` | Show/HideはActivityコンポーネント活用 |
| `rendering-conditional-render` | `&&`ではなく三項演算子を使用 |
| `rendering-usetransition-loading` | ローディング状態はuseTransition優先 |
| `rendering-resource-hints` | preload/prefetchでリソースプリロード |
| `rendering-script-defer-async` | スクリプトタグにdefer/asyncを指定 |

#### 実装例

```typescript
// ❌ パフォーマンス問題
function VeryLongList({ items }) {
  return (
    <div>
      {items.map(item => (
        <ExpensiveRow key={item.id} item={item} />
      ))}
    </div>
  );
  // 10,000行 = ブラウザ無反応
}

// ✅ content-visibility で改善
function VeryLongList({ items }) {
  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          style={{ contentVisibility: 'auto' }}
        >
          <ExpensiveRow item={item} />
        </div>
      ))}
    </div>
  );
  // ビューポート内のみレンダリング
}
```

---

### 7️⃣ JavaScript Performance（JavaScriptマイクロ最適化）【LOW-MEDIUM】

**目的**: JavaScriptコード自体の実行効率を高める

#### 対象ルール

| ルール名 | 説明 |
|--------|------|
| `js-batch-dom-css` | CSS変更をクラスまたはcssTextでバッチ |
| `js-index-maps` | 繰り返しlookupはMapで高速化 |
| `js-cache-property-access` | ループ内のプロパティaccess キャッシュ |
| `js-cache-function-results` | 関数結果をモジュールレベルのMapでキャッシュ |
| `js-cache-storage` | localStorage/sessionStorageはキャッシュ |
| `js-combine-iterations` | 複数のfilter/mapをループ1つで |
| `js-length-check-first` | ループ前に配列長をチェック |
| `js-early-exit` | 関数から早期return |
| `js-hoist-regexp` | RegExはループ外に移動 |
| `js-min-max-loop` | 最小値/最大値はsort()ではなくループで |
| `js-set-map-lookups` | O(1) lookup には Set/Map |
| `js-tosorted-immutable` | 不変性にはtoSorted()を使用 |
| `js-flatmap-filter` | map + filter は flatMap で |
| `js-request-idle-callback` | 非重要な処理はrequestIdleCallbackで |

---

### 8️⃣ Advanced Patterns（高度なパターン）【LOW】

**目的**: エッジケースと高度な最適化

| ルール名 | 説明 |
|--------|------|
| `advanced-event-handler-refs` | イベントハンドラーをrefに保存 |
| `advanced-init-once` | アプリ読み込み時に1回だけ初期化 |
| `advanced-use-latest` | 安定なカスタムhookリファレンス用の`useLatest` |

---

## 実践的な例

### 例1: Next.js Server Action の最適化

```typescript
// pages/dashboard/page.tsxの例

// ❌ 改善前（低速）
export default async function Dashboard() {
  // ウォーターフォール
  const user = await db.user.findUnique({ where: { id: userId } });
  const posts = await db.post.findMany({ where: { userId } });
  const stats = await calculateStats(userId);
  
  const largeData = JSON.stringify({ user, posts, stats });
  
  return <DashboardContent data={largeData} />;
}

// ✅ 改善後（高速）
import { cache } from 'react';

const getUser = cache((id) => db.user.findUnique({ where: { id } }));
const getPosts = cache((id) => db.post.findMany({ where: { userId: id } }));

export default async function Dashboard() {
  // 並列実行
  const [user, posts, stats] = await Promise.all([
    getUser(userId),
    getPosts(userId),
    calculateStats(userId)
  ]);
  
  // クライアントに必要なデータだけ
  const clientData = {
    userName: user.name,
    postCount: posts.length,
    topStats: stats.slice(0, 5)
  };
  
  // 動的なセクション
  const chartComponent = dynamic(() => import('./Chart'), {
    ssr: false,
    loading: () => <ChartSkeleton />
  });
  
  return (
    <div>
      <StatsSummary data={clientData} />
      <Suspense fallback={<ChartSkeleton />}>
        <Await promise={Promise.resolve(stats)}>
          {chartComponent}
        </Await>
      </Suspense>
    </div>
  );
}
```

### 例2: コンポーネントの再レンダリング最適化

```typescript
// ❌ 改善前（頻繁な再レンダリング）
function UserList({ users, filter }) {
  const [sortBy, setSortBy] = useState('name');
  
  const filteredUsers = users.filter(u =>
    u.name.includes(filter)
  );
  
  return (
    <div>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option>name</option>
        <option>date</option>
      </select>
      
      {/* sortByが変わるたびに全部再レンダリング */}
      <UserTable users={filteredUsers} />
    </div>
  );
}

// ✅ 改善後（効率的）
const UserTable = React.memo(function UserTable({ users }) {
  const [sortBy, setSortBy] = useState('name');
  
  const sorted = useDeferredValue(
    users.sort((a, b) => sortBy === 'name'
      ? a.name.localeCompare(b.name)
      : new Date(a.date) - new Date(b.date)
    )
  );

  return <table>{/* 重い処理 */}</table>;
});

function UserListContainer({ users, filter }) {
  const filteredUsers = useMemo(
    () => users.filter(u => u.name.includes(filter)),
    [users, filter]
  );
  
  return (
    <div>
      <FilterInput />
      <Suspense fallback={<LoadingSpinner />}>
        <UserTable users={filteredUsers} />
      </Suspense>
    </div>
  );
}
```

---

## ルール検索ガイド

### いつどのルールを使う？

| 悩み | ルール | 優先度 |
|-----|-------|--------|
| ページが遅い | `async-parallel`, `bundle-dynamic-imports` | CRITICAL |
| バンドルサイズ大きい | `bundle-barrel-imports`, `bundle-defer-third-party` | CRITICAL |
| APIが多重呼び出し | `server-cache-react` | HIGH |
| コンポーネント頻繁に再描画 | `rerender-memo`, `rerender-transitions` | MEDIUM |
| リスト表示が遅い | `rendering-content-visibility` | MEDIUM |
| JavaScriptが重い | `js-combine-iterations`, `js-set-map-lookups` | LOW-MEDIUM |

---

## まとめ

**優先度順の導入チェックリスト:**

- [ ] Waterfallsを排除している？（async-parallel）
- [ ] バンドルサイズを測定している？ (`next/image`、動的インポート）
- [ ] Server Actionsで並列実行している？
- [ ] React.cache()で重複排除している？
- [ ] 不要な再レンダリングを排除している？
- [ ] 大きなリストにcontent-visibilityを使用？
- [ ] JavaScriptのループを最適化している？

**次ステップ:**
- 各ルールファイル（`rules/*.md`）を個別に確認
- 実際のプロジェクトにApply
- パフォーマンス測定（Lighthouse、Web Vitals）

---

**詳細資料**: [skills-breakdown.md](skills-breakdown.md)
