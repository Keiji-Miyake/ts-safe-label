# ts-safe-label

[![npm version](https://badge.fury.io/js/ts-safe-label.svg)](https://www.npmjs.com/package/ts-safe-label)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/ts-safe-label)](https://bundlephobia.com/package/ts-safe-label)

TypeScriptの`enum`または`Union Type`定義から、UIで使用するための**型安全な選択肢リスト**を生成するユーティリティライブラリ。

## 特徴

✅ **完全な型安全性** - コンパイル時にキーの存在をチェック  
✅ **柔軟な設計** - enumのキーまたは値をvalueとして選択可能  
✅ **ゼロ依存** - 軽量で高速  
✅ **厳格なTypeScript** - Strict Mode対応

## インストール

```bash
npm install ts-safe-label
# or
yarn add ts-safe-label
# or
pnpm add ts-safe-label
```

## 基本的な使い方

### enumのキーを`value`として使用（デフォルト）

```typescript
import { createLabelList } from 'ts-safe-label';

const Colors = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
} as const;

const labelMap = {
  RED: '赤',
  BLUE: '青',
  GREEN: '緑',
};

const colorList = createLabelList(Colors, labelMap);
// [
//   { value: 'RED', label: '赤' },
//   { value: 'BLUE', label: '青' },
//   { value: 'GREEN', label: '緑' }
// ]
```

### enumの値を`value`として使用

```typescript
const colorList = createLabelList(Colors, labelMap, { useEnumValues: true });
// [
//   { value: 'red', label: '赤' },
//   { value: 'blue', label: '青' },
//   { value: 'green', label: '緑' }
// ]
```

### 部分的なラベルマップ

ラベルを指定しないキーは、キー名がそのままラベルになります。

```typescript
const partialLabelMap = {
  RED: '赤',
  // BLUE と GREEN は省略
};

const colorList = createLabelList(Colors, partialLabelMap);
// [
//   { value: 'RED', label: '赤' },
//   { value: 'BLUE', label: 'BLUE' },
//   { value: 'GREEN', label: 'GREEN' }
// ]
```

### ラベルマップなし

```typescript
const colorList = createLabelList(Colors);
// [
//   { value: 'RED', label: 'RED' },
//   { value: 'BLUE', label: 'BLUE' },
//   { value: 'GREEN', label: 'GREEN' }
// ]
```

## Reactでの使用例

```tsx
import { createLabelList } from 'ts-safe-label';

const Status = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

const statusLabels = {
  PENDING: '保留中',
  APPROVED: '承認済み',
  REJECTED: '却下',
};

function StatusSelect() {
  const statusList = createLabelList(Status, statusLabels, { useEnumValues: true });

  return (
    <select>
      {statusList.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
```

## API

### `createLabelList<TEnum>(enumObj, labelMap?, options?)`

型安全な選択肢リストを生成します。

#### パラメータ

- `enumObj`: `Record<string, string | number>` - 元となるenumまたはオブジェクト
- `labelMap?`: `Partial<LabelMap<TEnum>>` - ラベルのマッピング（省略可能）
- `options?`: `CreateLabelListOptions` - オプション設定
  - `useEnumValues?: boolean` - `true`の場合、enumの値を`value`として使用（デフォルト: `false`）

#### 戻り値

`SafeLabel<TValue>[]` - 型安全な選択肢リストの配列

```typescript
type SafeLabel<TValue> = {
  value: TValue;
  label: string;
};
```

## 型定義

### `KeysOf<T>`

オブジェクトのキーをUnion Typeとして抽出します。

```typescript
type ColorKeys = KeysOf<typeof Colors>; // 'RED' | 'BLUE' | 'GREEN'
```

### `ValuesOf<T>`

オブジェクトの値をUnion Typeとして抽出します。

```typescript
type ColorValues = ValuesOf<typeof Colors>; // 'red' | 'blue' | 'green'
```

### `LabelMap<TEnum>`

完全なラベルマッピングの型。

```typescript
type ColorLabelMap = LabelMap<typeof Colors>;
// { RED: string; BLUE: string; GREEN: string; }
```

### `PartialLabelMap<TEnum>`

部分的なラベルマッピングの型（一部のキーのみ提供可能）。

## 開発

```bash
# 依存関係のインストール
npm install

# テストの実行
npm test

# ビルド
npm run build

# リントとフォーマット
npm run check
```

## ライセンス

MIT
