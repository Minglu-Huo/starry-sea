import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { type STableProps } from '../STable';
import { ColumnItemType, StoreType } from '../store';

function formatCell<RecordType>(
  text: any,
  format: ColumnItemType<RecordType>['format'],
  record: RecordType,
  index: number,
) {
  if (typeof format === 'function') {
    return (format as (text: any, record: RecordType, index: number) => void)(
      text,
      record,
      index,
    );
  }

  if (format instanceof Map) {
    return format.get(text);
  }
  const DATE_FORMAT_PREFIX = 'date|';
  if (
    typeof format === 'string' &&
    (format as string).startsWith(DATE_FORMAT_PREFIX)
  ) {
    const dateFormat = (format as string).replace(DATE_FORMAT_PREFIX, '');
    return dayjs(text).format(dateFormat);
  }

  if (format === 'tooltip') {
    return <Tooltip title={text}>{text}</Tooltip>;
  }

  return text;
}

export function useColumns<RecordType, ApiResult>(
  columns: STableProps<RecordType, ApiResult>['columns'],
  columnsMap: StoreType['columnMap'],
  columnProps: STableProps<RecordType, ApiResult>['columnProps'],
) {
  const internalColumns = React.useMemo(() => {
    if (!Array.isArray(columns)) return [];

    const cols = columns
      .map((col) => {
        const key = col.key || col.dataIndex?.toString();
        const config = columnsMap[key as string];

        if (!config)
          return {
            ...col,
            ...columnProps,
          };

        if (config.hidden === true) return false;

        const { format, render } = col;
        /** format: 'date|' | Map | 'func' | 'tooltip' */
        if (!format)
          return {
            ...col,
            ...columnProps,
            fixed: config.fixed,
          };

        if (!render && format) {
          return {
            ...col,
            ...columnProps,
            fixed: config.fixed,
            render: (text: any, record: RecordType, index: number) => {
              return formatCell<RecordType>(text, format, record, index);
            },
          };
        }
        return { ...col, ...columnProps };
      })
      .filter(Boolean) as STableProps<RecordType, ApiResult>['columns'];

    cols!.sort(
      (a: ColumnItemType<RecordType>, b: ColumnItemType<RecordType>) => {
        const akey = a.key || a.dataIndex?.toString();
        const bkey = b.key || b.dataIndex?.toString();

        const aFixed = columnsMap[akey as string]?.fixed;
        const bFixed = columnsMap[bkey as string]?.fixed;

        if (
          (aFixed === 'left' && bFixed !== 'left') ||
          (bFixed === 'right' && aFixed !== 'right')
        ) {
          return -2;
        }
        if (
          (bFixed === 'left' && aFixed !== 'left') ||
          (aFixed === 'right' && bFixed !== 'right')
        ) {
          return 2;
        }

        return (
          columnsMap[akey as string]?.order - columnsMap[bkey as string]?.order
        );
      },
    );
    return cols;
  }, [columns, columnProps, columnsMap]);

  return [internalColumns];
}
