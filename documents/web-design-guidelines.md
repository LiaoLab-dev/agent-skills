# Web Design Guidelines - 詳細ガイド

UIコードがWebインターフェースのベストプラクティスに準拠しているか監査するスキルの詳細ガイドです。

## 📋 目次

1. [概要](#概要)
2. [11の監査領域](#11の監査領域)
3. [実装例](#実装例)
4. [チェックリスト](#チェックリスト)

---

## 概要

- **ルール数**: 100以上
- **焦点**: アクセシビリティ、パフォーマンス、UX
- **対象**: すべてのWebインターフェース
- **ライセンス**: MIT

このスキルは、Webデザインのベストプラクティスを自動的にチェックします。

---

## 11の監査領域

### 1️⃣ アクセシビリティ（A11y）

**目的**: すべてのユーザーがUIを使用可能にする

#### キーポイント

- ✅ ARIA ラベルの適切な使用
- ✅ セマンティックHTML
- ✅ キーボードナビゲーション対応
- ✅ スクリーンリーダー対応

#### 実装例

```html
<!-- ❌ 悪い例 -->
<div onclick="handleClick()">Click me</div>
<img src="icon.png" />

<!-- ✅ 良い例 -->
<button onclick="handleClick()" aria-label="Submit form">
  Click me
</button>
<img src="icon.png" alt="Submit icon" aria-hidden="true" />

<!-- ❌ 悪い例：非セマンティック -->
<div role="heading">Title</div>

<!-- ✅ 良い例：セマンティック -->
<h1>Title</h1>

<!-- ❌ 悪い例：コントラスト不足 -->
<p style="color: #999; background: #fff;">
  Low contrast text
</p>

<!-- ✅ 良い例：十分なコントラスト -->
<p style="color: #333; background: #fff;">
  High contrast text
</p>
```

#### チェック項目

- [ ] すべてのボタン/リンクに `aria-label` または見える text がある
- [ ] `<button>`, `<a>`, `<input>` などのセマンティック要素を使用
- [ ] キーボード Tab キーで全要素に到達可能
- [ ] 画像に `alt` 属性がある
- [ ] フォームラベルが input 要素と関連付けされている

```html
<!-- ✅ 良い例：フォームラベル -->
<label for="email">Email address:</label>
<input id="email" type="email" required />

<!-- ✅ 良い例：複雑なウィジェット -->
<button aria-expanded="false" aria-controls="menu">Menu</button>
<ul id="menu" role="menu">
  <li role="menuitem">Item 1</li>
  <li role="menuitem">Item 2</li>
</ul>
```

---

### 2️⃣ フォーカス状態

**目的**: キーボードユーザーが現在地を認識可能にする

#### キーポイント

- ✅ 見える フォーカスインジケーター
- ✅ `:focus-visible` 疑似クラス
- ✅ フォーカストラップ（モーダル内での循環）

#### 実装例

```css
/* ❌ 悪い例：デフォルトアウトラインを削除 */
button {
  outline: none; /* 見えなくなり、キーボードユーザー困惑 */
}

/* ✅ 良い例：カスタム フォーカススタイル */
button {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* React 例 */
button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}
```

#### チェック項目

- [ ] マウス/タッチのフォーカスはオプション（`:focus-visible` で制御）
- [ ] キーボード Tab キーでフォーカスが見える
- [ ] モーダル/ドロップダウン内でフォーカストラップ実装

---

### 3️⃣ フォーム

**目的**: フォーム入力をユーザーフレンドリーにする

#### キーポイント

- ✅ オートコンプリート属性
- ✅ 検証エラーメッセージ
- ✅ `<label>` との関連付け
- ✅ 必須フィールド表示

#### 実装例

```html
<!-- ✅ 良い例：フォーム -->
<form>
  <div>
    <label for="username">Username *</label>
    <input
      id="username"
      type="text"
      autocomplete="username"
      required
      aria-describedby="username-error"
    />
    <span id="username-error" role="alert"></span>
  </div>

  <div>
    <label for="email">Email *</label>
    <input
      id="email"
      type="email"
      autocomplete="email"
      required
      aria-describedby="email-error"
    />
    <span id="email-error" role="alert"></span>
  </div>

  <div>
    <label for="password">Password *</label>
    <input
      id="password"
      type="password"
      autocomplete="new-password"
      required
      aria-describedby="password-help"
    />
    <small id="password-help">
      8+ characters, include uppercase, number
    </small>
  </div>

  <button type="submit">Sign up</button>
</form>
```

#### チェック項目

- [ ] すべての `<input>` に `<label>` がある（`for` attribute）
- [ ] `autocomplete` 属性が適切に設定されている
- [ ] 検証エラーは `<span role="alert">` で表示
- [ ] 必須フィールドに `required` 属性と `*` マーク

---

### 4️⃣ アニメーション

**目的**: モーション感度の高いユーザーに配慮

#### キーポイント

- ✅ `prefers-reduced-motion` メディアクエリ対応
- ✅ 派手なアニメーション回避
- ✅ GPU加速対応

#### 実装例

```css
/* ❌ 悪い例：prefers-reduced-motion非対応 */
.fade-in {
  animation: fadeIn 1s;
}

/* ✅ 良い例：prefers-reduced-motion対応 */
.fade-in {
  animation: fadeIn 1s;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
    opacity: 1; /* 即座に見える状態に */
  }
}

/* ✅ GPU加速対応 */
.slide {
  /* transform と opacity のみ（ベストプラクティス） */
  animation: slide 0.5s ease;
}

@keyframes slide {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
```

#### チェック項目

- [ ] `@media (prefers-reduced-motion: reduce)` で大幅に簡略化
- [ ] 3秒以上のアニメーションを避ける
- [ ] `transform`/`opacity` を優先（`left`/`width` 変更は避ける）

---

### 5️⃣ タイポグラフィ

**目的**: テキストを正確に表示

#### 実装例

```html
<!-- ❌ グレードダウンしたクォート -->
He said "hello" and she replied 'hi'.

<!-- ✅ 正確なタイポグラフィ -->
He said "hello" and she replied 'hi'.
<p>Ellipsis: …</p> <!-- 3つのドット(...)ではなく -->
<p>Em dash: — </p> <!-- ハイフン(-)ではなく -->
<p>Copyright: ©</p> <!-- (C)ではなく -->

<!-- CSS: tabular-nums -->
<table>
  <tr>
    <td style="font-variant-numeric: tabular-nums;">100.00</td>
    <td style="font-variant-numeric: tabular-nums;">  50.50</td>
  </tr>
</table>
```

#### チェック項目

- [ ] スマートクォート（"" ''）を使用
- [ ] 省略記号（…）と em dash（—）を正確に表記
- [ ] `<abbr title="...">` で略語を定義
- [ ] 数字表を `font-variant-numeric: tabular-nums` で整列

---

### 6️⃣ 画像

**目的**: 画像の最適化と読み込み

#### 実装例

```html
<!-- ❌ 悪い例 -->
<img src="logo.png" width="500px" height="500px" />

<!-- ✅ 良い例 -->
<img
  src="logo.png"
  alt="Company logo"
  width="500"
  height="500"
  loading="lazy"
  decoding="async"
/>

<!-- ✅ Responsive Image -->
<picture>
  <source srcset="logo-small.webp" type="image/webp" media="(max-width: 768px)" />
  <source srcset="logo.webp" type="image/webp" />
  <img
    src="logo.png"
    alt="Company logo"
    width="500"
    height="500"
  />
</picture>

<!-- ✅ Next.js Image -->
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Company logo"
  width={500}
  height={500}
  loading="lazy"
  quality={85}
/>
```

#### チェック項目

- [ ] すべての `<img>` に `alt` 属性
- [ ] `width`, `height` 属性で Cumulative Layout Shift 回避
- [ ] `loading="lazy"` で遅延ロード
- [ ] WebP など最適なフォーマット使用

---

### 7️⃣ パフォーマンス

**目的**: ページ速度の最適化

#### 実装例

```html
<!-- ✅ リソースヒント -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
<link rel="prefetch" href="/next-page" />

<!-- ✅ 仮想化（長いリスト） -->
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>

<!-- ✅ content-visibility -->
<div style="content-visibility: auto;">
  Expensive content
</div>
```

#### チェック項目

- [ ] `preconnect` / `dns-prefetch` で外部リソース接続を高速化
- [ ] `preload` で重要リソースを先読み
- [ ] 長いリストは仮想化（react-window など）
- [ ] `content-visibility: auto` で off-screen content をスキップ

---

### 8️⃣ ナビゲーション & ステート

**目的**: URLが状態を反映、ディープリンク対応

#### 実装例

```typescript
// ❌ URLに状態が反映されない
const [filter, setFilter] = useState('all');

// ✅ URLに状態が反映される
function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  
  return [
    filter,
    (newFilter: string) => {
      setSearchParams({ filter: newFilter });
    }
  ];
}

// React Router 例
<Link to={`/products?filter=${selectedFilter}`}>
  Filtered Results
</Link>
```

#### チェック項目

- [ ] 重要な UI ステートは URL に反映
- [ ] ブックマーク時に同じ状態が復帰
- [ ] 戻るボタンが適切に動作

---

### 9️⃣ ダークモード & テーミング

**目的**: 複数のカラースキームに対応

#### 実装例

```html
<!-- ✅ color-scheme メタタグ -->
<meta name="color-scheme" content="light dark" />

<!-- ✅ theme-color -->
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />

<!-- CSS 例 -->
<style>
  :root {
    --bg: white;
    --text: black;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg: black;
      --text: white;
    }
  }

  body {
    background-color: var(--bg);
    color: var(--text);
  }
</style>
```

#### チェック項目

- [ ] `<meta name="color-scheme">` を指定
- [ ] `@media (prefers-color-scheme: dark)` で対応
- [ ] ブラウザUI（アドレスバー等）も色を指定

---

### 🔟 タッチ & インタラクション

**目的**: モバイルユーザーに最適化

#### 実装例

```css
/* ✅ タップターゲットサイズ（最小48x48px） */
button {
  min-width: 48px;
  min-height: 48px;
  padding: 12px;
}

/* ✅ touch-action 指定 */
.swipe-area {
  touch-action: pan-y pinch-zoom;
  /* スワイプは許可、ピンチズームは許可 */
}

/* ✅ タップハイライト */
a {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
}
```

#### チェック項目

- [ ] 全インタラクティブ要素が 48x48px 以上
- [ ] `touch-action` で意図的なジェスチャーを指定
- [ ] ホバー効果が無いモバイルで代替表示

---

### 1️⃣1️⃣ ロケール & i18n

**目的**: 多言語・多リージョン対応

#### 実装例

```javascript
// ❌ ハードコード
const date = "12/31/2024";
const price = "$99.99";

// ✅ Intl を使用
const date = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).format(new Date('2024-12-31'));
// → "2024年12月31日"

const price = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY'
}).format(99.99);
// → "¥99"

// 多言語テキスト
const formatter = new Intl.ListFormat('ja-JP', {
  style: 'long',
  type: 'conjunction'
});
const items = ['りんご', 'みかん', 'ぶどう'];
console.log(formatter.format(items));
// → "りんご、みかん、及びぶどう"
```

#### チェック項目

- [ ] 日付は `Intl.DateTimeFormat` で
- [ ] 数字は `Intl.NumberFormat` で
- [ ] リストは `Intl.ListFormat` で
- [ ] `lang` 属性を正確に指定

---

## 実装例

### 完全なアクセシビリティ対応ページ

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="..." />
  <meta name="color-scheme" content="light dark" />
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
  
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preload" href="critical-font.woff2" as="font" type="font/woff2" crossorigin />
  
  <title>Accessible Web Design Example</title>
  <style>
    :root {
      --bg: white;
      --text: black;
      --focus: #0066cc;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg: black;
        --text: white;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      * {
        animation: none !important;
      }
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    button, a {
      min-width: 48px;
      min-height: 48px;
      padding: 12px;
    }

    button:focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: 2px;
    }
  </style>
</head>
<body>
  <header>
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <h1>Hello World</h1>
    <p>Welcome to this accessible website.</p>

    <form>
      <div>
        <label for="name">Name *</label>
        <input
          id="name"
          type="text"
          required
          aria-describedby="nameHelp"
        />
      </div>
      
      <button type="submit">submit</button>
    </form>

    <img src="image.png" alt="Descriptive text" loading="lazy" />
  </main>

  <footer>
    <p>&copy; 2024 Company. All rights reserved.</p>
  </footer>
</body>
</html>
```

---

## チェックリスト

### 基本チェック項目

- [ ] **アクセシビリティ**
  - [ ] すべてのボタン/リンクが keyboard で操作可能
  - [ ] スクリーンリーダーで意味が通じる
  - [ ] コントラスト比 4.5:1 以上

- [ ] **フォーカス**
  - [ ] Tab キーで全要素にアクセス
  - [ ] focus-visible で見えるインジケーター

- [ ] **フォーム**
  - [ ] すべての input に label
  - [ ] 検証エラーは role="alert"
  - [ ] autocomplete 属性を指定

- [ ] **アニメーション**
  - [ ] prefers-reduced-motion に対応
  - [ ] 派手すぎないアニメーション

- [ ] **タイポグラフィ**
  - [ ] スマートクォート（"" ''）
  - [ ] 省略記号（…）の正確な表記

- [ ] **画像**
  - [ ] すべての img に alt
  - [ ] loading="lazy" で遅延ロード
  - [ ] width/height 属性で CLS 回避

- [ ] **パフォーマンス**
  - [ ] preconnect/dns-prefetch を使用
  - [ ] 長いリストは仮想化
  - [ ] content-visibility: auto

- [ ] **ナビゲーション**
  - [ ] URL に状態が反映
  - [ ] ブックマーク復帰で状態回復

- [ ] **ダークモード**
  - [ ] color-scheme メタタグ
  - [ ] prefers-color-scheme CSS

- [ ] **タッチ**
  - [ ] タップターゲット 48x48px 以上
  - [ ] touch-action を指定

- [ ] **ロケール**
  - [ ] lang 属性は正確
  - [ ] Intl API で日付/数字を表示

---

**詳細資料**: [skills-breakdown.md](skills-breakdown.md)
