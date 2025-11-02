# マルチプラットフォームアプリ開発ボイラープレート

Expo (React Native) クライアントと Cloudflare Workers (Hono) API を同一ワークスペースで開発できるモノレポ構成のボイラープレートです。

## 📁 構成

```
boiler-plate/
├── apps/
│   ├── api/          # Cloudflare Workers + Hono (API サーバー)
│   └── client/       # Expo (React Native) アプリ
├── package.json      # ワークスペース管理
└── pnpm-workspace.yaml
```

## 🚀 クイックスタート（ワンライナー）

```bash
pnpm install && pnpm dev
```

このコマンドで以下が同時に起動します：
- **API サーバー**: <http://localhost:8787> (Cloudflare Workers ローカル)
- **Expo Metro Bundler**: <http://localhost:8081> (クライアント開発サーバー)

> **注意**: ポート 8081 や 8787 が既に使用中の場合はエラーになります。その場合は実行中のプロセスを停止してから再実行してください。

## 📱 クライアントの起動

Expo アプリの起動後、ターミナルに対話メニューが表示されます：

- **`w`** キーを押す: Web ブラウザで起動
- **`i`** キーを押す: iOS シミュレータで起動
- **`a`** キーを押す: Android エミュレータで起動
- **`r`** キーを押す: アプリをリロード
- **QR コード**: Expo Go アプリでスキャンして実機で実行

## 🔗 API とクライアントの連携

クライアントから API を呼び出す例：

```typescript
// apps/client/App.tsx
import { useEffect, useState } from 'react';
import { api } from './lib/api';

export default function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getGreeting().then(data => {
      setMessage(data.message);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>{message || 'Loading...'}</Text>
    </View>
  );
}
```

API ヘルパーは `apps/client/lib/api.ts` に定義されています。

### API エンドポイント例

API 側 (`apps/api/src/index.ts`) では以下のエンドポイントが定義されています：

- `GET /api/greeting` - サンプルの greeting メッセージを返す

新しいエンドポイントを追加する場合は、`apps/api/src/index.ts` を編集してください。

## 🛠️ 開発コマンド

### ルートディレクトリ

```bash
# 依存パッケージのインストール
pnpm install

# API とクライアントを同時起動
pnpm dev
```

### API のみ (`apps/api`)

```bash
# API サーバーのみ起動
pnpm --filter api dev

# テスト実行
pnpm --filter api test

# Cloudflare にデプロイ
pnpm --filter api deploy
```

### クライアントのみ (`apps/client`)

```bash
# クライアントのみ起動
pnpm --filter client dev

# Android で起動
pnpm --filter client android

# iOS で起動
pnpm --filter client ios

# Web で起動
pnpm --filter client web
```

## 📦 技術スタック

### API
- **Hono**: 高速な Web フレームワーク
- **Cloudflare Workers**: エッジでの実行環境
- **Vitest**: テストフレームワーク

### クライアント
- **Expo**: React Native 開発プラットフォーム
- **React Native**: クロスプラットフォーム UI
- **TypeScript**: 型安全な開発

## 🔧 環境変数

クライアント側で API の URL を変更する場合は、環境変数を設定できます：

```bash
# .env (apps/client/.env)
EXPO_PUBLIC_API_URL=https://your-api.workers.dev
```

開発環境ではデフォルトで `http://localhost:8787` が使用されます。

## 📝 次のステップ

1. `apps/client/App.tsx` を編集してクライアント UI を作成
2. `apps/api/src/index.ts` に新しい API エンドポイントを追加
3. `apps/client/lib/api.ts` に API ヘルパー関数を追加
4. Cloudflare Workers にデプロイして本番環境で動作確認

## ⚠️ トラブルシューティング

### Android SDK が見つからない

```
Error: Failed to resolve the Android SDK path
```

このエラーが出る場合は、以下のいずれかの方法で開発できます：

**方法1: Web で開発する（推奨）**
```bash
# ターミナルで 'w' キーを押す、または
pnpm --filter client web
```
ブラウザで http://localhost:8081 が開きます。

**方法2: Android Studio をインストールする**
1. [Android Studio](https://developer.android.com/studio) をダウンロード・インストール
2. Android SDK のパスを環境変数に設定:
```bash
# ~/.bashrc または ~/.zshrc に追加
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```
3. エミュレータを作成して起動
4. `pnpm dev` を実行して `a` キーを押す

**方法3: 実機で開発する**
1. スマートフォンに [Expo Go](https://expo.dev/client) アプリをインストール
2. `pnpm dev` を実行
3. 表示される QR コードを Expo Go でスキャン

### ポートが既に使用されている

```bash
# 別のターミナルで実行中のプロセスを確認
lsof -i :8081  # Expo
lsof -i :8787  # API

# プロセスを停止してから再実行
pnpm dev
```

### node_modules が見つからない

```bash
# 依存関係を再インストール
pnpm install
```

### Expo アプリが表示されない

- ファイアウォールで開発サーバーのポートが開いているか確認
- 実機とPCが同じネットワークに接続されているか確認
