import { Col, Row, Table, TableProps } from 'antd';
import { merge, omit } from 'lodash';
import type { Reference } from 'rc-table';
import React from 'react';
import { useStore } from 'zustand';
import { SGlobalContext } from '../s-global-config-provider/context';
import STableControl from './components/STableControl';
import { STableSearchPropsType } from './components/STableSearch';
import { TableContext } from './context';
import { defaultTableStore } from './defaultProps';
import { useColumns } from './hooks/useColumns';
import { usePagination } from './hooks/usePagination';
import { useScroll } from './hooks/useScroll';
import { useTable } from './hooks/useTable';
import {
  ApiResultType,
  FormatParamsFn,
  FormatResultFn,
  OnScreenfullFn,
  Service,
  StoreType,
  TableStoreType,
} from './store';
import { generateColumnMap } from './utils/generateColumnMap';

const wrapStyle = { padding: 20, background: '#fff' };

export interface STableProps<
  RecordType = any,
  ApiResult = ApiResultType<RecordType>,
> extends Partial<
      Omit<
        StoreType<RecordType>,
        | 'columnMap'
        | 'formatParamsRef'
        | 'formatResultRef'
        | 'serviceRef'
        | 'params'
        // | 'columnProps'
        | 'onScreenfullRef'
      >
    >,
    Omit<TableProps, 'dataSource' | 'loading' | 'columns'>,
    STableSearchPropsType {
  service: Service<ApiResult>;
  interaction?: React.ReactNode;
  tips?: React.ReactNode;
  formatParams?: FormatParamsFn;
  formatResult?: FormatResultFn<ApiResult>;
  onScreenfull?: OnScreenfullFn;
  defaultParams?: Record<string, any>;
  table?: TableStoreType;
  manual?: boolean;
}

function InternalTable(
  props: TableProps & Pick<STableProps<any, any>, 'interaction' | 'tips'>,
) {
  const tableContext = React.useContext(TableContext);
  if (!tableContext) {
    throw new Error('Missing StoreProvider');
  }

  const {
    dataSource,
    columns,
    columnProps,
    columnsMap,
    loading,
    screenfull,
    showInteractionOnSreenfull,
    total,
    params,
    fStatic,
    run,
    scroll: scrollSwitch,
  } = useStore(tableContext, (state) => ({
    dataSource: state.dataSource,
    columns: state.columns,
    columnProps: state.columnProps,
    loading: state.loading,
    run: state.action.run,
    total: state.total,
    fStatic: state.fStatic,
    columnsMap: state.columnMap,
    scroll: { y: state.control.scrollY, x: state.control.scrollX },
    params: state.params,
    screenfull: state.control.screenfull,
    showInteractionOnSreenfull: state.showInteractionOnSreenfull,
  }));

  const [internalColumns] = useColumns(columns, columnsMap, columnProps);

  const { onChange, pagination } = usePagination({
    page: params.page as number,
    total,
    size: params.size as number,
    run,
    fStatic,
  });

  const tableRef = React.useRef<Reference>(null);

  const [scroll] = useScroll(tableRef, {
    pagination,
    columns: columns,
    dataSource,
    scrollSwitch,
  });

  const { tips, interaction } = props;

  const renderInteraction = () => {
    // if (showInteractionOnSreenfull) {
    //   return interaction;
    // }

    if (screenfull?.status === 2) {
      if (showInteractionOnSreenfull) {
        return interaction;
      }
      return null;
    }

    return interaction;
  };

  return (
    <>
      {/* <STableSearch {...searchProps} /> */}
      <Row justify="space-between" style={{ margin: '10px 0' }}>
        <Col>{renderInteraction()}</Col>
        {/* <Col> {screenfull?.status !== 2 && showInteractionOnSreenfull === false && interaction}</Col> */}
        <Col>
          <STableControl />
        </Col>
      </Row>
      <Row style={{ marginBottom: 5 }}>
        <Col span={24}>{tips}</Col>
      </Row>
      <Table
        ref={tableRef}
        rowKey="frontendRowkey"
        dataSource={dataSource}
        loading={loading}
        columns={internalColumns}
        scroll={scroll}
        pagination={pagination}
        onChange={onChange}
        {...props}
      />
    </>
  );
}

function STable<RecordType = any, ApiResult = ApiResultType<RecordType>>(
  props: STableProps<RecordType, ApiResult>,
) {
  const {
    service,
    dataSource,
    columns,
    loading,
    resultSettings,
    fetchSettings,
    defaultParams,
    control,
    interaction,
    tips,
    formatParams,
    formatResult,
    onScreenfull,
    table,
    manual,
    showInteractionOnSreenfull,
    screenfullWrapRef,
    columnProps,
    fStatic,
    ...restTableProps
  } = props;

  const gTableContext = React.useContext(SGlobalContext)?.table;

  const tableWrapRef = React.useRef(null);

  const serviceRef = React.useRef(service);

  const formatParamsRef = React.useRef(formatParams);
  formatParamsRef.current = formatParams;

  const formatResultRef = React.useRef(formatResult);
  formatResultRef.current = formatResult;

  const onScreenfullRef = React.useRef(onScreenfull);
  onScreenfullRef.current = onScreenfull;

  const [tableStore] = useTable(table);

  const action = tableStore?.getState().action;

  React.useEffect(() => {
    const mergedState = merge(
      {
        dataSource,
        columns,
      },
      omit(defaultTableStore, ['dataSource', 'columns']),
      gTableContext,
      {
        tableWrapRef,
        formatParamsRef,
        onScreenfullRef,
        serviceRef,
        formatResultRef,
        fetchSettings,
        resultSettings,
        screenfullWrapRef,
        showInteractionOnSreenfull,
        params: defaultParams,
        control,
        loading,
        fStatic,
        columnProps,
      },
    );
    action?.setDefaultVals(mergedState);
  }, []);

  React.useEffect(() => {
    action?.setColumnMap(generateColumnMap(columns));
    action?.setColumns(columns as STableProps['columns']);
  }, [columns]);

  React.useEffect(() => {
    if (manual !== true) {
      action?.run();
    }
  }, []);

  return (
    <div ref={tableWrapRef} style={wrapStyle}>
      <TableContext.Provider value={tableStore}>
        <InternalTable
          interaction={interaction}
          bordered
          tips={tips}
          {...restTableProps}
        />
      </TableContext.Provider>
    </div>
  );
}

export default STable;
