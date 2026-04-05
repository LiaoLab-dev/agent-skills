# React Native Skills - 詳細ガイド

React NativeとExpoアプリケーションの包括的なベストプラクティスの詳細ガイドです。

## 📋 目次

1. [概要](#概要)
2. [8つのカテゴリー詳細](#8つのカテゴリー詳細)
3. [実装パターン](#実装パターン)
4. [共通の落とし穴](#共通の落とし穴)

---

## 概要

- **ルール数**: 30以上
- **カテゴリー数**: 8個
- **対象**: React Native + Expo
- **焦点**: モバイルパフォーマンス、ネイティブAPI

このスキルは、モバイルアプリ特有のパフォーマンス課題を解決します。

---

## 8つのカテゴリー詳細

### 1️⃣ List Performance【CRITICAL】

**目的**: 大量のアイテムを高速表示

#### ルール1.1: `list-performance-virtualize`

**ルール**: 大きなリストは **FlashList** を使用

```typescript
// ❌ 悪い例：全アイテムをレンダリング
import { FlatList } from 'react-native';

<FlatList
  data={hugeArray} // 10,000+ items
  renderItem={({ item }) => <Row item={item} />}
/>
// → フリーズ、メモリ不足

// ✅ 良い例：仮想化リスト
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={hugeArray}
  renderItem={({ item }) => <Row item={item} />}
  estimatedItemSize={50}
/>
// → スムーズ、最小限のメモリ
```

**FlashList vs FlatList:**
| 機能 | FlatList | FlashList |
|-----|---------|----------|
| 速度 | 遅い（大規模） | ⚡ 高速 |
| メモリ | 多い | 少ない |
| セクション | ✅ 対応 | ✅ 対応（v2） |
| ホリゾンタル | ✅ | ✅ |

#### ルール1.2: `list-performance-item-memo`

**ルール**: リストアイテムを **React.memo()** でメモ化

```typescript
// ❌ 毎回再レンダリング
function UserRow({ user }) {
  return <View><Text>{user.name}</Text></View>;
}

// ✅ 必要な時だけ再レンダリング
const UserRow = React.memo(function UserRow({ user }) {
  return <View><Text>{user.name}</Text></View>;
});

// PropTypes も指定してメモ化最適化
const UserRow = React.memo(
  function UserRow({ user }) {
    return <View><Text>{user.name}</Text></View>;
  },
  (prev, next) => prev.user.id === next.user.id
);
```

#### ルール1.3: `list-performance-callbacks`

**ルール**: コールバック参照を **安定化**

```typescript
// ❌ 毎回新しいコールバック（全アイテム再レンダリング）
<FlashList
  data={users}
  renderItem={({ item }) => (
    <UserRow 
      user={item}
      onPress={() => navigation.navigate('Detail', { id: item.id })}
    />
  )}
/>

// ✅ useMemoCallback で参照を安定化
const handleUserPress = useCallback(
  (userId) => navigation.navigate('Detail', { id: userId }),
  [navigation]
);

<FlashList
  data={users}
  renderItem={({ item }) => (
    <UserRow 
      user={item}
      onPress={() => handleUserPress(item.id)}
    />
  )}
/>
```

#### ルール1.4-1.8: その他のリスト最適化

| ルール | 説明 |
|-------|------|
| `list-performance-inline-objects` | Style object をインライン定義しない |
| `list-performance-function-references` | 関数定義をrenderで行わない |
| `list-performance-images` | 画像をexpo-imageで管理 |
| `list-performance-item-expensive` | 重い処理をアイテム外に移動 |
| `list-performance-item-types` | 異なるアイテムタイプはタイプ別処理 |

#### 実装例

```typescript
// ❌ 複数の問題
<FlashList
  data={users}
  renderItem={({ item }) => {
    const image = new Image();
    image.load(item.photo); // 毎回新規作成
    
    return (
      <Pressable
        style={{ backgroundColor: '#fff', padding: 10 }} // 毎回新規オブジェクト
        onPress={() => { // 新しいコールバック
          console.log(item.id); // 副作用
          fetchDetails(item.id);
        }}
      >
        <Image source={{ uri: item.photo }} />
      </Pressable>
    );
  }}
/>

// ✅ 最適化版
const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 10 },
});

const UserRowOptimized = React.memo(function UserRow({ user, onUserPress }) {
  return (
    <Pressable style={styles.container} onPress={() => onUserPress(user.id)}>
      <Image source={{ uri: user.photo }} style={styles.image} />
      <Text>{user.name}</Text>
    </Pressable>
  );
});

function UserList({ users }) {
  const handleUserPress = useCallback((userId) => {
    console.log(userId);
    fetchDetails(userId);
  }, []);

  return (
    <FlashList
      data={users}
      renderItem={({ item }) => (
        <UserRowOptimized user={item} onUserPress={handleUserPress} />
      )}
      estimatedItemSize={80}
    />
  );
}
```

---

### 2️⃣ Animation【HIGH】

**目的**: スムーズで高性能なアニメーション

#### ルール2.1: `animation-gpu-properties`

**ルール**: **transform** と **opacity** だけをアニメート

```typescript
// ❌ パフォーマンス悪い
Animated.timing(position, {
  toValue: 100,
  duration: 300
}).start();

return <View style={{ left: position }} />;
// left 変更 = レイアウト再計算 = 遅い

// ✅ GPU加速（高速）
Animated.timing(position, {
  toValue: 100,
  duration: 300
}).start();

return (
  <Animated.View style={{ transform: [{ translateX: position }] }} />
);
// translateX（GPU加速） = 高速
```

**推奨アニメーション対象:**
- ✅ `transform`（translate, scale, rotate）
- ✅ `opacity`
- ❌ `left`, `right`, `top`, `bottom`
- ❌ `width`, `height`
- ❌ `margin`, `padding`

#### ルール2.2: `animation-derived-value`

**ルール**: **useDerivedValue** で計算されたアニメーション

```typescript
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

function ScaleAnimation() {
  const progress = useSharedValue(0);
  
  // ❌ アニメーション内で計算（複雑）
  const rotation = Animated.createAnimatedComponent(
    progress.value * 360 // できない
  );
  
  // ✅ useDerivedValue で計算
  const rotation = useDerivedValue(() => {
    return progress.value * 360;
  });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }]
  }));

  return (
    <>
      <Animated.View style={animatedStyle} />
      <Pressable onPress={() => {
        progress.value = withSpring(1);
      }}>
        <Text>Animate</Text>
      </Pressable>
    </>
  );
}
```

#### ルール2.3: `animation-gesture-detector-press`

**ルール**: **Gesture.Tap** で Pressable の代わりに使用

```typescript
import Animated from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

// ❌ Pressable（全体的に）
<Pressable onPress={handlePress}>
  <Text>Tap me</Text>
</Pressable>

// ✅ Gesture.Tap（高性能）
function GestureButton() {
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      runOnJS(handlePress)();
    });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View>
        <Text>Tap me</Text>
      </Animated.View>
    </GestureDetector>
  );
}
```

---

### 3️⃣ Navigation【HIGH】

**目的**: ナビゲーション パフォーマンス最適化

#### ルール: `navigation-native-navigators`

**ルール**: JavaScriptナビゲーターではなく、**ネイティブスタック** を使用

```typescript
// ❌ JavaScriptベース（遅い）
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// これ自体は良いが、以下のようだと遅い：
// - JSスレッドブロック
// - Bridgeをたくさん使用

// ✅ ネイティブスタック（推奨）
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  );
}

// ✅ ネイティブボトムタブ
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

---

### 4️⃣ UI Patterns【HIGH】

**目的**: UIコンポーネントのベストプラクティス

| ルール | 説明|
|-------|-----|
| `ui-expo-image` | **expo-image** で全画像管理 |
| `ui-image-gallery` | **Galeria** で画像ライトボックス |
| `ui-pressable` | TouchableOpacity ではなく Pressable |
| `ui-safe-area-scroll` | ScrollView でセーフエリアを処理 |
| `ui-scrollview-content-inset` | ヘッダーは contentInset で調整 |
| `ui-menus` | ネイティブコンテキストメニュー使用 |
| `ui-native-modals` | JavaScriptモーダルより ネイティブモーダル |
| `ui-measure-views` | measure() ではなく onLayout を使用 |
| `ui-styling` | StyleSheet.create また Nativewind |

#### 実装例

```typescript
// ❌ 複数の非推奨パターン
<TouchableOpacity onPress={handlePress}>
  <Image source={require('./photo.jpg')} />
</TouchableOpacity>

// ✅ 推奨パターン
import { Image } from 'expo-image';
import { Pressable } from 'react-native';

<Pressable onPress={handlePress}>
  <Image
    source={{ uri: 'https://example.com/photo.jpg' }}
    contentFit="cover"
    style={{ width: 200, height: 200 }}
  />
</Pressable>
```

---

### 5️⃣ State Management【MEDIUM】

**目的**: 状態管理の最適化

#### ルール5.1: `react-state-minimize`

**ルール**: **購読を最小化** - 変更時に必要なコンポーネントだけ再レンダリング

```typescript
// ❌ 全体の状態を購読
const allState = useStore();
// count が変わると、user 部分もアップデート

// ✅ 必要な部分だけ購読
const count = useStore(state => state.count);
const user = useStore(state => state.user);
// count/user の独立した変更をリッスン

// Zustand 例
import { create } from 'zustand';

const useAppStore = create((set) => ({
  count: 0,
  user: { name: 'John' },
  incrementCount: () => set(state => ({ count: state.count + 1 })),
}));

function Counter() {
  const count = useAppStore(state => state.count);
  const increment = useAppStore(state => state.incrementCount);
  
  return (
    <Pressable onPress={increment}>
      <Text>{count}</Text>
    </Pressable>
  );
}

function Profile() {
  const user = useAppStore(state => state.user);
  
  return <Text>{user.name}</Text>;
}
```

---

### 6️⃣ Rendering【MEDIUM】

| ルール | 説明 |
|-------|------|
| `rendering-text-in-text-component` | Text は Text コンポーネント内にネスト |
| `rendering-no-falsy-and` | Falsy && render は避ける（代わりに三項演算子） |

```typescript
// ❌ Text のネスト不正
<View>
  Some text
  <Text>Other text</Text>
</View>

// ✅ すべて Text 内
<Text>
  Some text
  <Text>Other text</Text>
</Text>

// ❌ Falsy && 危険
{showInfo && <Text>Info</Text>}
// undefined がレンダリング

// ✅ 三項演算子
{showInfo ? <Text>Info</Text> : null}
```

---

### 7️⃣ Monorepo【MEDIUM】

**目的**: モノレポ構造でネイティブ依存関係を管理

| ルール | 説明 |
|-------|------|
| `monorepo-native-deps-in-app` | ネイティブ依存関係はアプリパッケージのみ |
| `monorepo-single-dependency-versions` | パッケージ間で依存関係バージョンを統一 |

---

### 8️⃣ Configuration【LOW】

| ルール | 説明 |
|-------|------|
| `fonts-config-plugin` | **config plugin** でカスタムフォント管理 |
| `imports-design-system-folder` | デザインシステムは専用フォルダで整理 |

---

## 実装パターン

### 高性能なリスト表示

```typescript
import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRoute } from '@react-navigation/native';
import { Image } from 'expo-image';

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: { gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  image: { width: 50, height: 50, borderRadius: 25 },
  text: { fontSize: 16, fontWeight: '500' },
});

const UserItemMemo = React.memo(function UserItem({ user, onPress }) {
  return (
    <Pressable style={styles.item} onPress={() => onPress(user.id)}>
      <Image source={{ uri: user.avatar }} style={styles.image} />
      <Text style={styles.text}>{user.name}</Text>
    </Pressable>
  );
});

export function UserListScreen() {
  const [users, setUsers] = React.useState([]);
  
  const handleUserPress = useCallback((userId) => {
    // Navigate to detail screen
  }, []);
  
  return (
    <View style={styles.container}>
      <FlashList
        data={users}
        renderItem={({ item }) => (
          <UserItemMemo user={item} onPress={handleUserPress} />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={70}
      />
    </View>
  );
}
```

---

## 共通の落とし穴

### 🚨 Pitfall 1: FlatList で大規模リスト

```typescript
// ❌ 10,000+ アイテムで遅延
<FlatList data={largeArray} renderItem={...} />

// ✅ FlashList に切り替え
<FlashList data={largeArray} renderItem={...} />
```

### 🚨 Pitfall 2: インライン Style

```typescript
// ❌ 毎回新規オブジェクト
<View style={{ width: 100, height: 100 }} />

// ✅ StyleSheet.create を使用
const styles = StyleSheet.create({
  box: { width: 100, height: 100 }
});

<View style={styles.box} />
```

### 🚨 Pitfall 3: Left/Top/Bottom アニメーション

```typescript
// ❌ レイアウト再計算（遅い）
Animated.timing(animatedLeft, toValue: 200)

<Animated.View style={{ left: animatedLeft }} />

// ✅ Transform を使用（GPU加速）
<Animated.View style={{ transform: [{ translateX: animatedLeft }] }} />
```

---

## チェックリスト

- [ ] 大規模リストは FlashList を使用
- [ ] リストアイテムは React.memo()
- [ ] アニメーションは transform/opacity のみ
- [ ] ネイティブナビゲーター使用
- [ ] expo-image で画像管理
- [ ] StyleSheet.create で style 定義
- [ ] 状態購読を最小化
- [ ] 単一バージョン依存関係（モノレポ）

---

**詳細資料**: [skills-breakdown.md](skills-breakdown.md)
