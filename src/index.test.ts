import { describe, expect, it } from 'vitest';
import { createLabelList, type KeysOf, type LabelMap, type ValuesOf } from './index';

// テスト用のenum定義
const Colors = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
} as const;

const Status = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

describe('型ユーティリティ', () => {
  describe('KeysOf', () => {
    it('オブジェクトのキーをUnion Typeとして抽出できる', () => {
      type ColorKeys = KeysOf<typeof Colors>;
      const key: ColorKeys = 'RED';
      expect(['RED', 'BLUE', 'GREEN']).toContain(key);

      // 型チェック: 存在しないキーはエラーになる
      // @ts-expect-error - YELLOW is not a valid key
      const _invalidKey: ColorKeys = 'YELLOW';
    });
  });

  describe('ValuesOf', () => {
    it('オブジェクトの値をUnion Typeとして抽出できる', () => {
      type ColorValues = ValuesOf<typeof Colors>;
      const value: ColorValues = 'red';
      expect(['red', 'blue', 'green']).toContain(value);

      // 型チェック: 存在しない値はエラーになる
      // @ts-expect-error - yellow is not a valid value
      const _invalidValue: ColorValues = 'yellow';
    });
  });
});

describe('createLabelList', () => {
  describe('基本機能 - キーをvalueとして使用', () => {
    it('完全なlabelMapを提供した場合、正しいリストが生成される', () => {
      const labelMap: LabelMap<typeof Colors> = {
        RED: '赤',
        BLUE: '青',
        GREEN: '緑',
      };

      const result = createLabelList(Colors, labelMap);

      expect(result).toEqual([
        { value: 'RED', label: '赤' },
        { value: 'BLUE', label: '青' },
        { value: 'GREEN', label: '緑' },
      ]);

      // 型チェック: valueはキーのUnion Type
      type ResultValue = (typeof result)[number]['value'];
      const value: ResultValue = 'RED';
      expect(value).toBe('RED');
    });

    it('部分的なlabelMapを提供した場合、未定義のキーはキー名がラベルになる', () => {
      const labelMap = {
        RED: '赤',
        // BLUE と GREEN は省略
      };

      const result = createLabelList(Colors, labelMap);

      expect(result).toEqual([
        { value: 'RED', label: '赤' },
        { value: 'BLUE', label: 'BLUE' },
        { value: 'GREEN', label: 'GREEN' },
      ]);
    });

    it('labelMapを省略した場合、キー名がラベルになる', () => {
      const result = createLabelList(Colors);

      expect(result).toEqual([
        { value: 'RED', label: 'RED' },
        { value: 'BLUE', label: 'BLUE' },
        { value: 'GREEN', label: 'GREEN' },
      ]);
    });

    it('数値enumでも動作する', () => {
      const labelMap = {
        PENDING: '保留中',
        APPROVED: '承認済み',
        REJECTED: '却下',
      };

      const result = createLabelList(Status, labelMap);

      expect(result).toEqual([
        { value: 'PENDING', label: '保留中' },
        { value: 'APPROVED', label: '承認済み' },
        { value: 'REJECTED', label: '却下' },
      ]);
    });
  });

  describe('enumの値をvalueとして使用 (useEnumValues: true)', () => {
    it('文字列enumの値がvalueになる', () => {
      const labelMap = {
        RED: '赤',
        BLUE: '青',
        GREEN: '緑',
      };

      const result = createLabelList(Colors, labelMap, { useEnumValues: true });

      expect(result).toEqual([
        { value: 'red', label: '赤' },
        { value: 'blue', label: '青' },
        { value: 'green', label: '緑' },
      ]);

      // 型チェック: valueはenumの値のUnion Type
      type ResultValue = (typeof result)[number]['value'];
      const value: ResultValue = 'red';
      expect(value).toBe('red');
    });

    it('数値enumの値がvalueになる', () => {
      const labelMap = {
        PENDING: '保留中',
        APPROVED: '承認済み',
        REJECTED: '却下',
      };

      const result = createLabelList(Status, labelMap, { useEnumValues: true });

      expect(result).toEqual([
        { value: 1, label: '保留中' },
        { value: 2, label: '承認済み' },
        { value: 3, label: '却下' },
      ]);
    });

    it('labelMapなしでも動作する', () => {
      const result = createLabelList(Colors, undefined, { useEnumValues: true });

      expect(result).toEqual([
        { value: 'red', label: 'RED' },
        { value: 'blue', label: 'BLUE' },
        { value: 'green', label: 'GREEN' },
      ]);
    });
  });

  describe('型安全性のテスト', () => {
    it('戻り値の型が正しい - キーをvalueとして使用', () => {
      const result1 = createLabelList(Colors, { RED: '赤' });

      // 実行時の値チェック
      expect(result1[0]?.value).toBe('RED');
      expect(result1[0]?.label).toBe('赤');
    });

    it('戻り値の型が正しい - 値をvalueとして使用', () => {
      const result2 = createLabelList(Colors, undefined, { useEnumValues: true });

      // 実行時の値チェック
      expect(result2[0]?.value).toBe('red');
      expect(result2[0]?.label).toBe('RED');
    });
  });

  describe('エッジケース', () => {
    it('空のオブジェクトの場合、空の配列を返す', () => {
      const emptyEnum = {} as const;
      const result = createLabelList(emptyEnum);

      expect(result).toEqual([]);
    });

    it('1つだけのキーを持つオブジェクトでも動作する', () => {
      const singleEnum = { ONLY: 'only' } as const;
      const result = createLabelList(singleEnum, { ONLY: '唯一' });

      expect(result).toEqual([{ value: 'ONLY', label: '唯一' }]);
    });
  });
});
