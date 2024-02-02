import { StoreType } from './store';

export const defaultTableStore: Partial<StoreType<any>> = {
  dataSource: [],
  loading: false,
  columns: [],
  showInteractionOnSreenfull: false,
  tableWrapRef: { current: null },
  screenfullWrapRef: { current: null },
  formatParamsRef: { current: undefined },
  formatResultRef: { current: undefined },
  onScreenfullRef: { current: undefined },
  control: {
    screenfull: {
      visible: true,
      disabled: false,
      status: 1,
      option: {
        statusMap: {
          1: { title: '全屏' },
          2: { title: '退出全屏' },
        },
      },
    },
    scrollY: {
      visible: true,
      disabled: false,
      status: 1,
      option: {
        offset: 100,
        statusMap: {
          1: { title: '开启纵向滚动' },
          2: { title: '关闭纵向滚动' },
        },
      },
    },
    scrollX: {
      visible: false,
      disabled: false,
      status: 1,
      option: {
        // offset: 100,
        statusMap: {
          1: { title: '开启横向滚动' },
          2: { title: '关闭横向滚动' },
        },
      },
    },
    search: {
      visible: false,
      disabled: false,
      status: 1,
      option: {
        statusMap: {
          1: { title: '高级查询' },
          2: { title: '简易查询' },
        },
      },
    },
    refresh: {
      visible: true,
      disabled: false,
      status: 1,
      option: {
        statusMap: {
          1: { title: '刷新' },
        },
      },
    },
    colSettings: {
      visible: true,
      disabled: false,
      status: 1,
      option: {
        statusMap: {
          1: { title: '列设置' },
        },
      },
    },
  },

  serviceRef: { current: null },

  columnMap: {},

  fetchSettings: {
    pageSizeField: 'size',
    pageNumField: 'page',
  },

  resultSettings: {
    dataSourceField: 'list',
    totalField: 'total',
  },

  params: {
    page: 1,
    size: 10,
  },
  columnProps: {
    align: 'left',
  },
};
