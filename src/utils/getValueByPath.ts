export function getValueByPath<T = any>(obj: any, path: string): T {
  return path.split('.').reduce((acc, prop) => acc && acc[prop], obj);
}
