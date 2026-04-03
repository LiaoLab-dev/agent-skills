# 共通アセット (Shared Assets)

このフォルダには、複数のテンプレートで共有する画像やリソースを保存します。

## フォルダ構成

```
assets/
├── logos/          # 会社ロゴ、プロジェクトロゴ
├── charts/         # グラフ、チャート画像
├── diagrams/       # 図表、構成図
├── photos/         # 写真、スクリーンショット
└── icons/          # アイコン素材
```

## 使用方法

1. 画像ファイルをこのフォルダまたはサブフォルダに配置
2. HTMLテンプレートで相対パスで参照

例:

```html
<img src="../assets/logos/company-logo.png" alt="会社ロゴ" />
<img src="../assets/charts/sales-chart.png" alt="売上グラフ" />
```

## 推奨ファイル形式

- **ロゴ**: PNG（透過背景）またはSVG
- **グラフ**: PNG（高解像度）またはSVG
- **写真**: JPG（適切に圧縮）
- **アイコン**: PNG（透過背景）またはSVG

## ファイル命名規則

- 英数字とハイフン、アンダースコアのみ使用
- 小文字推奨
- 説明的な名前を使用

例:

- `company-logo-2026.png`
- `sprint-12-burndown-chart.png`
- `system-architecture-diagram.svg`

## 注意事項

- 大きすぎる画像（5MB以上）は避けてください
- PDF印刷に適した高解像度の画像を使用してください（300dpi推奨）
- 著作権に注意してください
