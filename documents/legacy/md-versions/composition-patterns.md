# Composition Patterns - 詳細ガイド

スケーラビリティを備えたReact コンポジションパターンについての詳細ガイドです。

## 📋 目次

1. [概要](#概要)
2. [なぜComposition Patternsが必要か](#なぜcomposition-patternsが必要か)
3. [4つのカテゴリー詳細](#4つのカテゴリー詳細)
4. [実装パターン集](#実装パターン集)
5. [React 19 での変更点](#react-19-での変更点)

---

## 概要

- **焦点**: コンポーネント設計の哲学
- **主な目標**: ブール型プロップの増殖を避ける
- **対象**: React 16.8+ (React 19 新API別途)
- **適応性**: 再利用可能なコンポーネントライブラリ向け

このスキルは、**スケールするにつれて複雑になるコンポーネント設計** の問題を解決します。

---

## なぜ Composition Patterns が必要か

### 🚨 よくある問題: Boolean Props の増殖

```typescript
// 1つのこと: ボタン表示
<Button />

// 2つのこと: ボタン + アイコン
<Button icon="..." />

// 3つのこと: ボタン + アイコン + ローディング
<Button icon="..." loading={isLoading} />

// 4つのこと: ボタン + アイコン + ローディング + 無効化
<Button icon="..."  loading={isLoading} disabled={disabled} />

// ... だんだんと ...

// 20個のコンビネーション
<Button
  variant="primary"
  size="lg"
  disabled={disabled}
  loading={isLoading}
  icon="..."
  iconPosition="left"
  fullWidth={fullWidth}
  className="..."
  onClick={onClick}
  // ... etc ...
/>
```

**問題:**
- ❌ テストケースが指数関数的に増加 (2^20 = 1,048,576 combinations!)
- ❌ ドキュメントが膨大
- ❌ 新機能追加が難しい
- ❌ AIエージェントが理解困難

### ✅ 解決策: Composition Pattern

```typescript
// シンプル + 柔軟 + テスト容易
<Button>
  <Button.Icon name="..." />
  <Button.Label>Click me</Button.Label>
  <Button.Spinner />
</Button>
```

---

## 4つのカテゴリー詳細

### 1️⃣ Component Architecture【HIGH】

**目的**: コンポーネント設計の基本原則を確立

#### ルール1.1: `architecture-avoid-boolean-props`

**ルール**: ブール型プロップでカスタマイズできる機能は、**代わりに値の有無で判定** する

```typescript
// ❌ ブール型プロップ（悪い例）
<Badge hasIcon={true} />
<Badge hasIcon={false} />

// ✅ 子要素の有無で判定（良い例）
<Badge>
  <Badge.Icon />
</Badge>

// UIにはアイコンがある時だけレンダリング
<Badge>
  {showIcon && <Badge.Icon />}
</Badge>
```

#### ルール1.2: `architecture-compound-components`

**ルール**: 複雑なコンポーネントは **複合コンポーネント** パターンで設計する

**複合コンポーネント** = 複数の連携コンポーネントで1つの機能を提供

```typescript
// ❌ 単一のマガマガなコンポーネント
<Accordion
  title="Section 1"
  content="Content here"
  isOpen={isOpen}
  onToggle={setIsOpen}
/>
<Accordion
  title="Section 2"
  content="More content"
  isOpen={isOpen}
  onToggle={setIsOpen}
/>

// ✅ 複合コンポーネント（きれい + 柔軟）
<Accordion>
  <Accordion.Item>
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
  
  <Accordion.Item>
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>More content</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

**メリット:**
- 各部分を独立してカスタマイズ可能
- 新しい部分を追加しやすい
- ビジュアルの順序を自由に変更可能

---

### 2️⃣ State Management【MEDIUM】

**目的**: 複合コンポーネント内の状態管理を効率化

#### ルール2.1: `state-decouple-implementation`

**ルール**: **状態の実装方法はProviderだけが知える** ようにする

```typescript
// ❌ 実装詳細が漏れている
function AccordionProvider({ children }) {
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      {children}
    </AccordionContext.Provider>
  );
}

// 使用側が実装詳細(setOpenIndex)を知っている
const { openIndex, setOpenIndex } = useContext(AccordionContext);

// ✅ アクションで隠ぺい
function AccordionProvider({ children }) {
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <AccordionContext.Provider value={{
      openIndex,
      toggle: (index) => setOpenIndex(prev => prev === index ? -1 : index)
    }}>
      {children}
    </AccordionContext.Provider>
  );
}

// 使用側はアクションだけを知っている
const { toggle } = useContext(AccordionContext);
```

#### ルール2.2: `state-context-interface`

**ルール**: Context インターフェースは **state, actions, meta** の3層構造

```typescript
// ✅ 標準的なContext インターフェース
interface AccordionContextType {
  // State（何ができて、何ができないか）
  state: {
    openIndex: number;
    isLoading: boolean;
  };
  
  // Actions（何ができるか）
  actions: {
    toggle: (index: number) => void;
    open: (index: number) => void;
    close: () => void;
  };
  
  // Meta（メタ情報）
  meta: {
    totalItems: number;
    canOpenMultiple: boolean;
  };
}
```

#### ルール2.3: `state-lift-state`

**ルール**: 兄弟コンポーネント間で共有する状態は、**親のProviderに移動**

```typescript
// ❌ 各Itemが独立した状態（悪い例）
function AccordionItem({ title, content }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && <div>{content}</div>}
    </div>
  );
}

// ✅ 親で状態管理（良い例）
function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      {children}
    </AccordionContext.Provider>
  );
}

function AccordionItem({ index, title, content }) {
  const { openIndex, setOpenIndex } = useContext(AccordionContext);
  const isOpen = index === openIndex;
  
  return (
    <div>
      <button onClick={() => setOpenIndex(index)}>{title}</button>
      {isOpen && <div>{content}</div>}
    </div>
  );
}
```

---

### 3️⃣ Implementation Patterns【MEDIUM】

**目的**: 実装時の具体的なパターン

#### ルール3.1: `patterns-explicit-variants`

**ルール**: **明示的なバリアント** コンポーネントを作成する

```typescript
// ❌ ブール型でバリエーション指定（悪い例）
<Button variant="primary" size="lg" outline={true} />

// ✅ 明示的なコンポーネント（良い例）
<Button.Primary>Click</Button.Primary>
<Button.Secondary>Cancel</Button.Secondary>
<Button.Ghost>Learn more</Button.Ghost>

// 実装
export const Button = {
  Primary: (props) => <BaseButton variant="primary" {...props} />,
  Secondary: (props) => <BaseButton variant="secondary" {...props} />,
  Ghost: (props) => <BaseButton variant="ghost" {...props} />,
};
```

#### ルール3.2: `patterns-children-over-render-props`

**ルール**: `render*` プロップではなく、**children で構成** を実現

```typescript
// ❌ render-props（古い方法）
<List
  data={items}
  renderItem={(item) => <div>{item.name}</div>}
  renderEmpty={() => <div>No items</div>}
/>

// ✅ children（モダン）
<List data={items}>
  <List.Empty>No items</List.Empty>
  <List.Items>
    {(items) => items.map(item => (
      <List.Item key={item.id}>{item.name}</List.Item>
    ))}
  </List.Items>
</List>
```

---

### 4️⃣ React 19 APIs【MEDIUM】

> ⚠️ **React 19以降のみ** 対象。React 18以前は読み飛ばしてください。

#### ルール4.1: `react19-no-forwardref`

**ルール**: `forwardRef` を使わず、**直接ref を受け取る**

```typescript
// ❌ React 18: forwardRef が必要
const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});

// ✅ React 19: forwardRef 不要
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

**説明**: React 19からはrefs が通常のプロップになったため、`forwardRef` のwrapperが不要に。

---

## 実装パターン集

### パターン1: Accordion（アコーディオン）

```typescript
// Context
interface AccordionContextType {
  openIndex: number;
  toggle: (index: number) => void;
}

const AccordionContext = createContext<AccordionContextType | null>(null);

// 親コンポーネント
export function Accordion({ children }: { children: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <AccordionContext.Provider
      value={{
        openIndex,
        toggle: (index) => setOpenIndex(prev => prev === index ? -1 : index)
      }}
    >
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

// Item コンポーネント
export function AccordionItem({
  index,
  children
}: {
  index: number;
  children?: React.ReactNode;
}) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionItem must be used in Accordion');
  
  const isOpen = context.openIndex === index;
  
  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      {children}
    </div>
  );
}

// Trigger コンポーネント
export function AccordionTrigger({ children }: { children: React.ReactNode }) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used in Accordion');
  
  return (
    <button
      className="accordion-trigger"
      onClick={() => /* toggle logic */}
    >
      {children}
    </button>
  );
}

// Content コンポーネント
export function AccordionContent({ children }: { children: React.ReactNode }) {
  return <div className="accordion-content">{children}</div>;
}

// 使用例
<Accordion>
  <AccordionItem index={0}>
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  
  <AccordionItem index={1}>
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>
```

### パターン2: Tabs（タブ）

```typescript
export function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="tabs-list" role="tablist">{children}</div>;
}

export function TabsTrigger({
  index,
  children
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { activeTab, setActiveTab } = useContext(TabsContext)!;
  
  return (
    <button
      role="tab"
      aria-selected={activeTab === index}
      onClick={() => setActiveTab(index)}
      className={activeTab === index ? 'active' : ''}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  index,
  children
}: {
  index: number;
  children: React.ReactNode;
}) {
  const { activeTab } = useContext(TabsContext)!;
  
  if (activeTab !== index) return null;
  
  return <div role="tabpanel">{children}</div>;
}

// 使用例
<Tabs>
  <TabsList>
    <TabsTrigger index={0}>Profile</TabsTrigger>
    <TabsTrigger index={1}>Settings</TabsTrigger>
    <TabsTrigger index={2}>Security</TabsTrigger>
  </TabsList>
  
  <TabsContent index={0}>Profile content</TabsContent>
  <TabsContent index={1}>Settings content</TabsContent>
  <TabsContent index={2}>Security content</TabsContent>
</Tabs>
```

---

## React 19 での変更点

### before → after

| 機能 | React 18 | React 19 |
|-----|---------|---------|
| ref 受け取り | `forwardRef` 必須 | 直接受け取り可能 |
| Context Hook | `useContext()` | `use()` (新) |
| async Components | ❌ 未対応 | ✅ 対応 |
| use() API | なし | Server Components対応 |

### 例: use() API

```typescript
// React 19: Promise を直接 use()
async function getUser(id: string) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

async function UserProfile({ userId }: { userId: string }) {
  const userPromise = getUser(userId);
  const user = use(userPromise); // 自動的にresolve
  
  return <div>{user.name}</div>;
}
```

---

## まとめ

**このスキルを使うメリット:**
- ✅ ブール型プロップが激減 → テストが容易
- ✅ 新機能追加が簡単
- ✅ コンポーネントライブラリとして再利用可能
- ✅ AIエージェントが理解しやすい

**導入チェックリスト:**
- [ ] Boolean プロップをすべてリスト化した？
- [ ] 複合コンポーネント構造を設計した？
- [ ] Context インターフェース（state/actions/meta）を定義した？
- [ ] テストケースを削減できるか確認した？
- [ ] ドキュメント自動生成できるか確認した？

---

**詳細資料**: [skills-breakdown.md](skills-breakdown.md)
