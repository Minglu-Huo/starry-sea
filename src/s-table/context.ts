import React from 'react';
import { TableStoreType } from './store';

export type TableContextType<RecordType = any> =
  | TableStoreType<RecordType>
  | null
  | undefined;

export const TableContext = React.createContext<TableContextType>(null);
