/**
 * 型安全なラベルリストを生成するためのユーティリティ型と関数
 */

/**
 * オブジェクトのキーをUnion Typeとして抽出
 */
export type KeysOf<T> = keyof T;

/**
 * オブジェクトの値をUnion Typeとして抽出
 */
export type ValuesOf<T> = T[keyof T];

/**
 * 単一のラベル項目の型定義
 * @template TValue - valueフィールドの型（厳密なUnion Type）
 */
export type SafeLabel<TValue> = {
  value: TValue;
  label: string;
};

/**
 * ラベルマップの型定義
 * @template TEnum - 元となるenumまたはオブジェクトの型
 * 各キーに対して文字列のラベルを割り当てる
 */
export type LabelMap<TEnum> = {
  [K in keyof TEnum]: string;
};

/**
 * 部分的なラベルマップの型定義（一部のキーのみ提供可能）
 * @template TEnum - 元となるenumまたはオブジェクトの型
 */
export type PartialLabelMap<TEnum> = Partial<LabelMap<TEnum>>;

/**
 * createLabelListのオプション設定
 */
export type CreateLabelListOptions = {
  /**
   * trueの場合、enumの値（value）をvalueフィールドに使用
   * falseの場合（デフォルト）、enumのキーをvalueフィールドに使用
   */
  useEnumValues?: boolean;
};

/**
 * enumまたはUnion Typeのオブジェクトから型安全な選択肢リストを生成
 *
 * @template TEnum - 元となるenumまたはオブジェクトの型
 * @param enumObj - enumまたはオブジェクト（例: { RED: 'red', BLUE: 'blue' }）
 * @param labelMap - ラベルのマッピングオブジェクト（例: { RED: '赤', BLUE: '青' }）
 * @param options - オプション設定
 * @returns 型安全な選択肢リストの配列
 *
 * @example
 * ```typescript
 * const Colors = { RED: 'red', BLUE: 'blue' } as const;
 * const labels = { RED: '赤', BLUE: '青' };
 * const list = createLabelList(Colors, labels);
 * // => [{ value: 'RED', label: '赤' }, { value: 'BLUE', label: '青' }]
 * ```
 */
export function createLabelList<TEnum extends Record<string, string | number>>(
  enumObj: TEnum,
  labelMap?: PartialLabelMap<TEnum>,
  options?: Omit<CreateLabelListOptions, 'useEnumValues'> & { useEnumValues?: false }
): SafeLabel<KeysOf<TEnum>>[];

/**
 * enumの値をvalueとして使用するオーバーロード
 */
export function createLabelList<TEnum extends Record<string, string | number>>(
  enumObj: TEnum,
  labelMap: PartialLabelMap<TEnum> | undefined,
  options: CreateLabelListOptions & { useEnumValues: true }
): SafeLabel<ValuesOf<TEnum>>[];

/**
 * 実装
 */
export function createLabelList<TEnum extends Record<string, string | number>>(
  enumObj: TEnum,
  labelMap?: PartialLabelMap<TEnum>,
  options: CreateLabelListOptions = {}
): SafeLabel<KeysOf<TEnum>>[] | SafeLabel<ValuesOf<TEnum>>[] {
  const { useEnumValues = false } = options;
  const keys = Object.keys(enumObj) as Array<keyof TEnum>;

  return keys.map((key) => {
    const value = useEnumValues ? enumObj[key] : (key as string);
    const label = labelMap?.[key] ?? String(key);

    return {
      value,
      label,
    } as SafeLabel<KeysOf<TEnum>> | SafeLabel<ValuesOf<TEnum>>;
  }) as SafeLabel<KeysOf<TEnum>>[] | SafeLabel<ValuesOf<TEnum>>[];
}
