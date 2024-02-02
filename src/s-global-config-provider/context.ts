import React from 'react';
import { STableProps } from '../s-table/STable';

// export interface SGTable

export interface SGlobalContextType {
  table?: Pick<
    STableProps,
    | 'manual'
    | 'control'
    | 'showInteractionOnSreenfull'
    | 'fetchSettings'
    | 'resultSettings'
    | 'columnProps'
  >;
}

export const SGlobalContext = React.createContext<SGlobalContextType | null>(
  null,
);
