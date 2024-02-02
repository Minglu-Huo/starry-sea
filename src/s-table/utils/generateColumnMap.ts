import { STableProps } from '../STable';
import { StoreType } from '../store';

export function generateColumnMap(
  columns: STableProps<any, any, any>['columns'],
): StoreType<any, any>['columnMap'] {
  // return
  if (!Array.isArray(columns)) return {};

  let map: any = {};

  columns.forEach((col, index) => {
    let key: string = '';
    if (col.key) {
      key = col.key as string;
    } else if (col.dataIndex) {
      key = col.dataIndex.toString();
    }

    map[key] = {
      title: col.title,
      hidden: col.hidden,
      fixed: col.fixed,
      order: index,
      key,
    };
  });

  return map;
}
