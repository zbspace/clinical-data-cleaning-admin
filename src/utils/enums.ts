// 药品类型
export enum DRUG_TYPE {
  '化药' = '化药',
  '治疗用生物制剂' = '治疗用生物制剂',
  '带预防用生物制剂' = '带预防用生物制剂',
  '中药/天然药物' = '中药/天然药物',
  '体外诊断试剂' = '体外诊断试剂',
  '其他' = '其他',
}

// 将枚举转换为选项数组（{ value: 编码, label: 文案 }）
export function createEnumsToOptions<T extends Record<string, string>>(enumObj: T): { value: string; label: string }[] {
  return (Object.keys(enumObj) as Array<keyof T>).map((key) => ({
    value: enumObj[key],
    label: key as string,
  }));
}
