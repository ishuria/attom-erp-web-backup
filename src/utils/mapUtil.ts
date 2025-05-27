
/**
 * 对数据列表中指定字段的值求和（根据 ID 去重）
 * @param data 数据列表（需包含唯一标识 id 和目标字段）
 * @param fieldName 要求和的字段名（必须是数值类型字段）
 * @param precision 结果保留小数位数（默认2位）
 * @returns 去重后的求和结果（字符串形式，如 "123.45"）
 */
export function sumUniqueByField<T extends { id: number | string; [key: string]: any }>(
  data: T[],
  fieldName: keyof T,
  precision: number = 2
): string {
  // 1. 去重逻辑：使用 Map 保留每个 ID 第一次出现的值
  const valueMap = new Map<T['id'], number>();
  for (const item of data) {
    if (!valueMap.has(item.id)) {
      const value = Number(item[fieldName]);
      valueMap.set(item.id, isNaN(value) ? 0 : value); // 处理非数值
    }
  }

  // 2. 求和计算
  const sum = Array.from(valueMap.values()).reduce((acc, val) => acc + val, 0);

  // 3. 格式化结果
  const formattedSum = sum.toFixed(precision);
  // 4. 返回结果
  return formattedSum;
}

