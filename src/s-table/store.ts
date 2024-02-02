import { TableColumnProps, TableProps } from 'antd';
import { cloneDeep, isFunction, merge } from 'lodash';
import React from 'react';
import { createStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { defaultTableStore } from './defaultProps';

export type TableStoreType = ReturnType<typeof createTableStore>;

export interface ControlItemType {
  visible?: boolean;
  disabled?: boolean;
  status?: number;
  option?: Record<string, any>;
}

export interface TableAction<RecordType> {
  run(params?: any): Promise<void>;
  refresh: () => void;
  setControl(field: keyof ControlType, value: ControlItemType): void;
  setColumns(cols?: StoreType<RecordType>['columns']): void;
  setColumnMap(columnMap: StoreType<RecordType>['columnMap']): void;
  setDefaultVals(defaultVals: Partial<StoreType>): void;
}

export interface ControlType {
  search?: ControlItemType;
  refresh?: ControlItemType;
  scrollY?: ControlItemType;
  scrollX?: ControlItemType;
  colSettings?: ControlItemType;
  screenfull?: ControlItemType;
}

export interface ColumnItemType<RecordType>
  extends TableColumnProps<RecordType> {
  hidden?: boolean;
  format?:
    | Map<unknown, unknown>
    | string
    | ((
        text: any,
        record: Record<string, any>,
        index: number,
      ) => React.ReactNode)
    | React.ReactNode;
}

export type FormatParamsFn = (params: any) => any;
export type FormatResultFn<ApiResult> = (result: ApiResult) => any;
export type OnScreenfullFn = () => void;

export interface StoreType<
  RecordType = any,
  ApiResult = ApiResultType<RecordType>,
> extends Partial<Pick<TableProps<RecordType>, 'dataSource' | 'loading'>> {
  serviceRef: React.MutableRefObject<Service<ApiResult> | null>;
  fStatic?: boolean;
  columns: ColumnItemType<RecordType>[];
  total: number;
  control: ControlType;
  action: TableAction<RecordType>;
  params: { page?: number; size?: number; [key: string]: any };
  tableWrapRef: React.MutableRefObject<HTMLDivElement | null>;
  screenfullWrapRef: React.MutableRefObject<HTMLDivElement | null>;
  formatParamsRef?: React.MutableRefObject<FormatParamsFn | undefined>;
  formatResultRef?: React.MutableRefObject<
    FormatResultFn<ApiResult> | undefined
  >;
  showInteractionOnSreenfull: boolean;
  onScreenfullRef?: React.MutableRefObject<OnScreenfullFn | undefined>;
  fetchSettings: {
    pageNumField: string;
    pageSizeField: string;
  };
  resultSettings: {
    dataSourceField: string;
    totalField: string;
  };
  columnMap: {
    [key: string]: {
      title: string;
      hidden?: boolean;
      fixed?: 'left' | 'right';
      order: number;
      key: string;
    };
  };
  columnProps?: {
    align?: 'left' | 'center' | 'right';
  };
}

export interface ApiResultType<RecordType> {
  list: RecordType[];
  total: number;
}
export type Service<ApiResult> = (params?: any) => Promise<ApiResult>;

export function createTableStore<
  RecordType = any,
  // ApiResult = ApiResultType<RecordType>,
>() {
  return createStore<StoreType<RecordType>>()(
    subscribeWithSelector((set, get) => {
      return {
        ...defaultTableStore,
        action: {
          setDefaultVals(defaultVals) {
            set((state) => {
              return { ...state, ...defaultVals };
            });
          },
          setColumnMap(columnMap) {
            set((state) => {
              return { ...state, columnMap };
            });
          },
          setColumns(columns) {
            set((state) => {
              return {
                ...state,
                columns,
              };
            });
          },
          setControl(field, value) {
            set((state) => {
              return {
                ...state,
                control: {
                  ...state.control,
                  [field]: {
                    ...state.control[field],
                    ...value,
                  },
                },
              };
            });
          },
          run: async (params?: StoreType<RecordType>['params']) => {
            try {
              const service = get().serviceRef.current;
              if (!isFunction(service)) return;
              const params_ = {
                ...merge({}, get().params, params),
              };

              set((state) => {
                return {
                  ...state,
                  loading: true,
                  params: params_,
                };
              });

              const fetchSettings = get().fetchSettings;

              // let postData =

              let postData = cloneDeep(params_);

              if (
                !Reflect.has(
                  postData as Record<string, any>,
                  fetchSettings.pageNumField,
                )
              ) {
                (postData as any)[fetchSettings.pageNumField!] = (
                  postData as any
                ).page;
                delete (postData as any).page;
              }
              if (
                !Reflect.has(
                  postData as Record<string, any>,
                  fetchSettings.pageSizeField,
                )
              ) {
                (postData as any)[fetchSettings.pageSizeField] = (
                  postData as any
                ).size;
                delete (postData as any).size;
              }
              if (isFunction(get().formatParamsRef?.current)) {
                postData = get().formatParamsRef?.current?.(postData);
              }

              const resultSettings = get().resultSettings;
              const { dataSourceField, totalField } = resultSettings;

              let data = (await service(postData)) as any;

              const formatResultRef = get().formatResultRef;

              if (isFunction(formatResultRef?.current)) {
                data = formatResultRef.current(data);
              }

              if (
                typeof data === 'object' &&
                data !== null &&
                !Array.isArray(data)
              ) {
                if (Reflect.has(data, dataSourceField)) {
                  if (Array.isArray(data[dataSourceField])) {
                    let dataSource = data[dataSourceField];
                    const total = data[totalField] || dataSource.length;

                    dataSource.forEach((it: any, index: number) => {
                      it.frontendRowkey = it.id || index + 1;
                      // it.frontendSortnum =
                      if (get().fStatic) {
                        it.frontendSortnum = index + 1;
                      } else {
                        it.frontendSortnum =
                          ((params_?.page as number) - 1) *
                            (params_?.size as number) +
                          index +
                          1;
                      }
                    });

                    set((state) => {
                      return {
                        ...state,
                        dataSource,
                        total,
                        loading: false,
                      };
                    });
                  }
                }
              }
            } catch (error) {
              set((state) => ({ ...state, loading: false }));
              console.log('🚀 ~ run: ~ error:', error);
            }
          },
          refresh: () => {
            get().action.run();
          },
        },
      } as StoreType<RecordType>;
    }),
  );
}
