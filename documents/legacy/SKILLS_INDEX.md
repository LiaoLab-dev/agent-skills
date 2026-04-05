# Agent Skills ドキュメント ガイド

`npx skills add vercel-labs/agent-skills` でインストール可能な6つのスキルについての完全ドキュメント集です。

---

## 📚 ドキュメント一覧

### 🎯 全体ガイド

| ドキュメント | 説明 | 対象者 |
|-----------|------|--------|
| **[スキル解説（全体概要）](skills-breakdown.md)** | 6つのスキルの全体像、概要、いつ使うか | すべての開発者 |
| **[ドキュメントガイド](SKILLS_INDEX.md)** | ドキュメント構成と検索ガイド | すべての開発者 |

---

### 💻 スキル別ドキュメント

#### 1️⃣ React Best Practices
**用途**: React/Next.jsのパフォーマンス最適化  
**優先度**: 🔴 高  
**ルール数**: 65個

📖 **[詳細ドキュメント](react-best-practices.md)**

- 8つのカテゴリー詳細解説
- Waterfalls排除（CRITICAL）
- バンドルサイズ最適化（CRITICAL）
- サーバー/クライアントパフォーマンス  
- 再レンダリング最適化
- 実践的なコード例
- ルール検索ガイド

---

#### 2️⃣ Composition Patterns
**用途**: スケーラブルなReact コンポーネント設計  
**優先度**: 🟡 中  
**ルール数**: 20個以上

📖 **[詳細ドキュメント](composition-patterns.md)**

- コンポーネント設計の基本原則
- ブール型プロップ増殖の回避
- 複合コンポーネントパターン
- 状態管理のベストプラクティス
- React 19 新API
- 実装パターン集（Accordion、Tabs など）

---

#### 3️⃣ Web Design Guidelines
**用途**: UI/UX/アクセシビリティのベストプラクティス  
**優先度**: 🔴 高  
**ルール数**: 100以上

📖 **[詳細ドキュメント](web-design-guidelines.md)**

- 11の監査領域詳細解説
- アクセシビリティ（A11y）
- フォーカス状態・キーボード対応
- フォーム設計ガイド
- アニメーション（prefers-reduced-motion）
- タイポグラフィ・画像最適化
- パフォーマンス・ダークモード
- ロケール/多言語対応
- 完全な実装例
- チェックリスト

---

#### 4️⃣ React Native Skills
**用途**: モバイルアプリのパフォーマンス最適化  
**優先度**: 🟡 中  
**ルール数**: 30以上

📖 **[詳細ドキュメント](react-native-skills.md)**

- 8つのカテゴリー詳細解説
- リスト表示最適化（FlashList）
- アニメーション（Reanimated）
- ナビゲーション最適化
- UI パターン
- 状態管理（Zustand）
- モノレポ構成
- 共通の落とし穴と対策

---

#### 5️⃣ Deploy to Vercel
**用途**: Vercelへのアプリケーションデプロイ  
**優先度**: 🔴 高  
**対応フレームワーク**: 40以上

📖 **[詳細ドキュメント](deploy-to-vercel.md)**

- デプロイ方法（3パターン）
- フレームワーク自動検出（Next.js、React、Vite など）
- デプロイフロー（5ステップ）
- vercel.json カスタマイズ
- 環境変数設定
- Claim フロー（所有権移行）
- トラブルシューティング

---

#### 6️⃣ Vercel CLI with Tokens
**用途**: CI/CD自動化とトークン認証  
**優先度**: 🟢 低  
**セキュリティ**: トークンベース認証

📖 **[詳細ドキュメント](vercel-cli-with-tokens.md)**

- トークン取得方法（ダッシュボード/CLI/API）
- CI/CD環境での設定
- GitHub Actions 統合
- GitLab CI 統合
- 環境変数管理
- Vercel CLI コマンド全集
- トークンセキュリティ

---

## 🎓 使い始めガイド

### 初めて使う場合

1. **[スキル解説（全体概要）](skills-breakdown.md)** を読む
2. **優先度に従ってスキルを選択**
3. **該当スキルの詳細ドキュメント読む**
4. **実装・テスト**

### 特定上の悩みから探す

| 悩み | 参照ドキュメント |
|-----|----------------|
| ページが遅い、読み込み遅延 | [React Best Practices](react-best-practices.md) |
| UIがアクセシブルか不安 | [Web Design Guidelines](web-design-guidelines.md) |
| コンポーネント設計が複雑 | [Composition Patterns](composition-patterns.md) |
| モバイルアプリが重い/遅い | [React Native Skills](react-native-skills.md) |
| エラーなくデプロイしたい | [Deploy to Vercel](deploy-to-vercel.md) |
| CI/CD パイプライン構築 | [Vercel CLI with Tokens](vercel-cli-with-tokens.md) |

---

## 🔗 外部リンク

- 📍 [Agent Skills 公式](https://agentskills.io/)
- 📍 [vercel-labs/agent-skills GitHub](https://github.com/vercel-labs/agent-skills)
- 📍 [Vercel ドキュメント](https://vercel.com/docs)
- 📍 [Next.js ドキュメント](https://nextjs.org/docs)
- 📍 [React ドキュメント](https://react.dev)

---

**最終更新**: 2026年4月3日
