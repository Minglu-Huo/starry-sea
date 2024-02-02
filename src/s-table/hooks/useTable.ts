import React from 'react';
import { TableContextType } from '../context';
import { createTableStore } from '../store';

export function useTable<RecordType = any>(
  tableStore?: TableContextType<RecordType>,
) {
  const tableStoreRef = React.useRef<TableContextType>();

  if (!tableStoreRef.current) {
    if (tableStore) {
      tableStoreRef.current = tableStore;
    } else {
      tableStoreRef.current = createTableStore<RecordType>();
    }
  }
  return [tableStoreRef.current];
}
