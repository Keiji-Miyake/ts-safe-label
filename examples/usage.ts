/**
 * ts-safe-label の使用例
 */

import { createLabelList, type SafeLabel } from '../src/index';

// ========================================
// 例1: 色のenum（文字列値）
// ========================================
const Colors = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
} as const;

const colorLabels = {
  RED: '赤',
  BLUE: '青',
  GREEN: '緑',
  YELLOW: '黄色',
};

// キーをvalueとして使用
const colorListByKey = createLabelList(Colors, colorLabels);
console.log('色リスト (キー使用):', colorListByKey);
// => [
//   { value: 'RED', label: '赤' },
//   { value: 'BLUE', label: '青' },
//   ...
// ]

// 値をvalueとして使用
const colorListByValue = createLabelList(Colors, colorLabels, { useEnumValues: true });
console.log('色リスト (値使用):', colorListByValue);
// => [
//   { value: 'red', label: '赤' },
//   { value: 'blue', label: '青' },
//   ...
// ]

// ========================================
// 例2: ステータスのenum（数値）
// ========================================
const Status = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
  CANCELLED: 4,
} as const;

const statusLabels = {
  PENDING: '保留中',
  APPROVED: '承認済み',
  REJECTED: '却下',
  CANCELLED: 'キャンセル',
};

const statusList = createLabelList(Status, statusLabels);
console.log('ステータスリスト:', statusList);

// ========================================
// 例3: 部分的なラベルマップ
// ========================================
const Priority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// 一部のラベルのみ指定
const partialPriorityLabels = {
  LOW: '低',
  HIGH: '高',
  // MEDIUM と CRITICAL は省略
};

const priorityList = createLabelList(Priority, partialPriorityLabels, { useEnumValues: true });
console.log('優先度リスト (部分的):', priorityList);
// => [
//   { value: 'low', label: '低' },
//   { value: 'medium', label: 'MEDIUM' },  // ラベルなし → キー名をラベルに
//   { value: 'high', label: '高' },
//   { value: 'critical', label: 'CRITICAL' }
// ]

// ========================================
// 例4: ラベルマップなし
// ========================================
const UserRole = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const;

const roleList = createLabelList(UserRole);
console.log('ロールリスト (ラベルなし):', roleList);
// => [
//   { value: 'ADMIN', label: 'ADMIN' },
//   { value: 'EDITOR', label: 'EDITOR' },
//   { value: 'VIEWER', label: 'VIEWER' }
// ]

// ========================================
// 例5: 型安全性のデモ
// ========================================
const DemoEnum = {
  OPTION_A: 'a',
  OPTION_B: 'b',
} as const;

// ✅ OK: すべてのキーが存在
const validLabels = {
  OPTION_A: 'オプションA',
  OPTION_B: 'オプションB',
};
createLabelList(DemoEnum, validLabels);

// ✅ OK: 部分的なラベル
const partialLabels = {
  OPTION_A: 'オプションA',
};
createLabelList(DemoEnum, partialLabels);

// ❌ コンパイルエラー: 存在しないキー
// const invalidLabels = {
//   OPTION_A: 'オプションA',
//   INVALID_KEY: '無効', // <- エラー!
// };
// createLabelList(DemoEnum, invalidLabels);

// ========================================
// 例6: 型を活用した関数
// ========================================
function renderSelect<T extends string>(items: SafeLabel<T>[]) {
  return items.map((item) => `<option value="${item.value}">${item.label}</option>`).join('\n');
}

const selectHtml = renderSelect(colorListByValue);
console.log('セレクトボックスのHTML:\n', selectHtml);
