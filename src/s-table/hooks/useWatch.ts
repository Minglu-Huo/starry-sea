import { useCreation } from 'ahooks';
import React from 'react';
import { getValueByPath } from '../../utils/getValueByPath';
import { STableProps } from '../STable';

export function useWatch<T = any>(table: STableProps['table'], path: string) {
  const pathRef = React.useRef(path);

  const unsubRef = React.useRef<any>(null);

  const [state, setState] = React.useState<T>(() => {
    return getValueByPath(table?.getState(), path);
  });

  useCreation(() => {
    unsubRef.current = table?.subscribe(
      (state) => {
        return getValueByPath(state, pathRef.current);
      },
      (selected) => {
        setState(selected);
      },
      {
        fireImmediately: true,
      },
    );
  }, []);

  React.useEffect(() => {
    return () => {
      unsubRef.current?.();
    };
  }, []);

  return [state];
}
