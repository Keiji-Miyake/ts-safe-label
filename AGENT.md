# AI エージェント設定

このファイルは、AI エージェントがプロジェクトを理解するための設定ファイルです。

## プロジェクト概要

Expo (React Native) + Cloudflare Workers (Hono) のマルチプラットフォームアプリ開発ボイラープレート。

## 技術スタック

- **API**: Cloudflare Workers + Hono + Vitest
- **Client**: Expo + React Native + TypeScript
- **Package Manager**: pnpm workspace

## 開発コマンド

```bash
# 開発サーバー起動（推奨）
pnpm dev

# API のみ
pnpm --filter api dev

# クライアントのみ
pnpm --filter client dev
```

## ディレクトリ構造

```
apps/
  api/          # Cloudflare Workers API (Hono)
    src/
      index.ts  # API エントリーポイント
  client/       # Expo アプリ
    lib/
      api.ts    # API クライアントヘルパー
    App.tsx     # メインコンポーネント
```

## 重要な注意事項

1. **開発環境**: Linux (bash)、Android SDK なし → Web モード推奨
2. **起動**: `pnpm dev` で API (8787) と Client (8081) が同時起動
3. **対話メニュー**: Expo の対話キー（w, a, i, r など）が使用可能
4. **API 連携**: `apps/client/lib/api.ts` を通じて API にアクセス
