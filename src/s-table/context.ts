import React from 'react';
import { TableStoreType } from './store';

export type TableContextType = TableStoreType | null | undefined;

export const TableContext = React.createContext<TableContextType>(null);
