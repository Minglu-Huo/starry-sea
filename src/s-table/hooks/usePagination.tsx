import { PaginationProps, TableProps } from 'antd';
import React from 'react';
import { TableAction } from '../store';

export type IPaginationProps = {
  total: number;
  page: string | number;
  size: string | number;
  run?: TableAction<any>['run'];
  fStatic?: boolean;
};

export function usePagination(props: IPaginationProps) {
  const { page, total, size, run, fStatic } = props;
  // const { total, page, size } = props;

  const onChange = React.useCallback<NonNullable<TableProps['onChange']>>(
    (page, filters, sorters) => {
      const { pageSize, current } = page;

      const toSet = {
        size: pageSize,
        page: current,
        filters,
        sorters,
      };

      run?.(toSet);
    },
    [run],
  );

  const pagination = React.useMemo<PaginationProps>(() => {
    if (fStatic) {
      return {
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total) => <span>共{total}条</span>,
        itemRender: (_, type, originalElement) => {
          if (type === 'prev') {
            return <span className="cursor-pointer">上一页</span>;
          }
          if (type === 'next') {
            return <span className="cursor-pointer">下一页</span>;
          }
          return originalElement;
        },
      };
    }
    return {
      showQuickJumper: true,
      total,
      current: Number(page),
      pageSize: Number(size),
      showSizeChanger: true,
      showTotal: (total) => <span>共{total}条</span>,
      itemRender: (_, type, originalElement) => {
        if (type === 'prev') {
          return <span className="cursor-pointer">上一页</span>;
        }
        if (type === 'next') {
          return <span className="cursor-pointer">下一页</span>;
        }
        return originalElement;
      },
    };
  }, [page, size, total]);

  return { pagination, onChange: fStatic ? undefined : onChange };
}
