// 药品类型
export enum DRUG_TYPE {
  '化药' = '化药',
  '治疗用生物制剂' = '治疗用生物制剂',
  '带预防用生物制剂' = '带预防用生物制剂',
  '中药/天然药物' = '中药/天然药物',
  '体外诊断试剂' = '体外诊断试剂',
  '其他' = '其他',
}

// 公司类型
export enum COMPANY_TYPE {
  '药企' = '药企',
  '申办方' = '申办方',
  'CRO' = 'CRO',
  '第三方实验室' = '第三方实验室',
  '其他' = '其他',
}

// 清洗状态
export enum CLEANING_STATUS {
  '未清洗' = 0,
  '已清洗' = 1,
  '不用清洗' = 2,
  '已拆分' = 3,
}

// 将枚举转换为选项数组（{ value: 编码, label: 文案 }）
// disabledValues: 可选，值为该数组内的选项将禁用（disabled: true）
export function createEnumsToOptions<T extends Record<string, string | number>>(
  enumObj: T,
  disabledValues: Array<T[keyof T]> = [],
): { value: T[keyof T]; label: string; disabled?: boolean }[] {
  // 过滤数字枚举的反向映射键（如 CLEANING_STATUS 会额外生成 '0'、'1' 等键）
  return (Object.keys(enumObj) as Array<keyof T>)
    .filter((key) => !/^\d+$/.test(String(key)))
    .map((key) => ({
      value: enumObj[key],
      label: key as string,
      ...(disabledValues.length > 0 ? { disabled: disabledValues.includes(enumObj[key]) } : {}),
    }));
}
