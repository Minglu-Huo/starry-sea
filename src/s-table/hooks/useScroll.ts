import { isBoolean } from 'lodash';
import type { Reference } from 'rc-table';
import React from 'react';
import { CSS_PREFIX_CLS } from '../../constants/constants';
import { useWindowReSize } from '../../hooks/useWindowReSize';
import { getViewportOffset } from '../../utils/getViewportOffset';
import { STableProps } from '../STable';
import { ColumnItemType, ControlType } from '../store';

interface Iprops {
  pagination: any;
  columns?: ColumnItemType<any>[];
  scrollSwitch: { x: ControlType['scrollX']; y: ControlType['scrollY'] };
  dataSource: STableProps<any, any>['dataSource'];
}

export function useScroll(
  tableRef: React.RefObject<Reference>,
  { pagination, columns, dataSource, scrollSwitch }: Iprops,
) {
  const [scroll, setScroll] = React.useState({});

  const getScrollX = React.useMemo(() => {
    // 禁用或等于2都是关闭状态
    if (scrollSwitch.x?.disabled || scrollSwitch.x?.status === 2) {
      return;
    }

    if (
      !Array.isArray(columns) ||
      !tableRef.current ||
      !Array.isArray(dataSource) ||
      dataSource.length === 0
    )
      return;

    let scrollX: number = 0;

    let baseWidth = 150;

    const tableEl = tableRef.current?.nativeElement;

    columns.forEach((col: any) => {
      if (col.width && typeof col.width === 'string') {
        scrollX += Number.parseInt(col.width, 10);
      } else if (col.width && typeof col.width === 'number') {
        scrollX += col.width;
      }
    });

    const visibleColumns = columns.filter((col) => !col.hidden);

    const unsetWidthColumns = visibleColumns.filter(
      (col) => !Reflect.has(col, 'width'),
    );

    if (unsetWidthColumns.length) {
      scrollX = unsetWidthColumns.length * baseWidth;
    }

    const tableWidth = tableEl?.offsetWidth ?? 0;

    if (tableWidth > scrollX) {
      scrollX = '100%' as any as number;
    }
    return scrollX;
  }, [scrollSwitch, columns, dataSource]);
  const getScrollY = React.useMemo(() => {
    if (scrollSwitch?.y?.status === 2 || scrollSwitch.y?.disabled) return;

    if (
      !Array.isArray(columns) ||
      !tableRef.current ||
      !Array.isArray(dataSource) ||
      dataSource.length === 0
    )
      return;

    const option = scrollSwitch?.y?.option;

    // debugger;
    const tableEl = tableRef.current?.nativeElement;
    const tbodyEl = tableEl?.querySelector(`.${CSS_PREFIX_CLS}-table-tbody`);
    if (!tbodyEl) return;
    // debugger;
    const headEl = tableEl?.querySelector(
      `.${CSS_PREFIX_CLS}-table-thead`,
    ) as HTMLElement;
    let footerEl;
    let paginationEl;

    if (!headEl) return;

    const { bottomIncludeBody } = getViewportOffset(headEl);

    let paginationHeight = 0;
    if (pagination) {
      paginationEl = tableEl?.querySelector(
        `.${CSS_PREFIX_CLS}-pagination`,
      ) as HTMLElement;

      if (paginationEl) {
        const offsetHeight = paginationEl?.offsetHeight;
        paginationHeight += offsetHeight || 0;

        paginationHeight += parseInt(
          getComputedStyle(paginationEl)?.marginTop,
          10,
        );
        paginationHeight += parseInt(
          getComputedStyle(paginationEl)?.marginBottom,
          10,
        );
      } else {
        paginationHeight += 24;
      }
    } else {
      paginationHeight = -8;
    }

    let footerHeight = 0;
    if (!isBoolean(pagination)) {
      if (!footerEl) {
        footerEl = tableEl?.querySelector(
          `.${CSS_PREFIX_CLS}-table-footer`,
        ) as HTMLElement;
      } else {
        const offsetHeight = (footerEl as HTMLElement).offsetHeight;
        footerHeight += offsetHeight || 0;
      }
    }

    let headerHeight = 0;
    if (headEl) {
      headerHeight = headEl.offsetHeight;
    }

    // 这里应该减去layoutfooter的高度
    const scrollY =
      bottomIncludeBody -
      paginationHeight -
      footerHeight -
      headerHeight -
      option?.offset;

    return scrollY;
  }, [scrollSwitch, columns, dataSource, pagination]);

  const calcScroll = React.useCallback(() => {
    if (!getScrollX && !getScrollY) {
      setScroll({});
      return;
    }

    setScroll({
      x: getScrollX,
      y: getScrollY,
    });
  }, [getScrollX, getScrollY]);

  useWindowReSize(calcScroll, {
    wait: 300,
    immediate: true,
  });

  console.log('🚀 ~ scroll:', scroll);
  return [scroll];
}
