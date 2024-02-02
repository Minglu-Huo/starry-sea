---
nav:
  title: 组件
order: -1
---

# STable

基于 antd table 拓展的组件，实现了自动请求、分页、表格 control 等处理。

## 使用

<code src="./demo/demo.tsx"></code>

## 前端分页

<code src="./demo/demo-fstatic.tsx"></code>

## table store

table store 使用 zustand 来进行管理，其中包含以下数据和方法，在使用 useTable 或 useWatch 时，都会对外暴露。

## hooks

### useTable

```js
const [table] = STable.useTable();


// useTable会对table store进行初始化,table store使用了zustand来进行管理。
// 初始化后的table会有三个api，table.getState()， table.setState()， table.subscribe()

table.getState() // 获取table state数据；
table.setState((state) => {...state, x}) // 动态更新table state数据

// 订阅table store的数据变化
unsubRef.current = table?.subscribe(
    (state) => {
      return getValueByPath(state, pathRef.current);
    },
    (selected) => {
      console.log("🚀 ~ selected:", selected)
    },
    {
      fireImmediately: true,
    },
  );
```

### useWatch

```js
const [table] = STable.useTable();
const [state] = STable.useWatch(table, 'loading');

// 在STable内部实现了useWatch方法，当需要监测并获取tablestore的数据或action方法时，应该使用useWatch方法。
```

## API

**基于 antd Table 拓展的一些属性**
| 属性 | 描述 | 类型 | 默认值 |
| :------------ | :--------------------------- | :-------------- | :----- |
| columns | 基于 ant-design 拓展的 column 类型 | ColumnItemType[] | - |
| table | useTable 返回的 tableStore | TableStoreType | - |
| service | 请求方法 | (params:any) => Promise(ApiResult) | - |
| interaction | 交互节点 | React.ReactNode | - |
| tips | 提示信息 | React.ReactNode | - |
| formatParams | 发起请求前对请求参数进行格式化 | FormatParamsFn | - |
| formatResult | 请求结束后对结果数据进行格式化 | FormatResultFn | - |
| onScreenfull | 点击全屏预览时的回掉函数 | OnScreenfullFn | - |
| showInteractionOnSreenfull | 点击全屏预览时是否显示交互按钮 | OnScreenfullFn | - |
| defaultParams | 默认携带的请求参数 | - | \{page:1, size: 10\} |
| manual | 是否手动请求 | boolean | false |
| fetchSettings | 请求数据时的配置,会自动进行转换分页字段 | \{pageNumField: string;pageSizeField: string;\} | \{pageNumField: 'pageNum',pageSizeField: 'pageSize';\} |
| resultSettings | 返回数据索引的配置 | \{dataSourceField: string;totalField: string;\} |\{dataSourceField: 'list',totalField: 'total';\} |
| columnProps | column 的统一配置项 | \{align: 'left'\|'center'\|'right'\} | {align: 'left'} |
| control | 表格右上角控制按钮的配置 | \{[search、refresh、scrollY、scrollX、colSettings、screenfull]:ControlItemType;\} | - |
| fStatic | 前端分页的表格，意味着后端返回的是全量数据，筛选应该在前端本地处理 | boolean | - |

**ColumnItemType**
| 属性 | 描述 | 类型 | 默认值 |
| :------------ | :--------------------------- | :-------------- | :----- |
| hidden | 隐藏 | boolean | - |
| format | 数据格式化 | - | - |

_format?:
| Map<unknown, unknown>
| string
| ((
text: any,
record: Record<string, any>,
index: number,
) => React.ReactNode)
| React.ReactNode，format 传入 'date|YYYY-MM-DD HH:mm:ss'类似的时间格式时，会自动进行格式化转化、传入 Map 类型时，会自动根据 record[dataIndex]结果进行 Map.get()操作并渲染_

**ControlItemType**
| 属性 | 描述 | 类型 | 默认值 |
| :------------ | :--------------------------- | :-------------- | :----- |
| visible | 显示 | boolean | true |
| disabled | 禁用 | boolean | false |
| status | control button 状态 | boolean | number |
| option | control button 的配置 | Record<string, any> | - |

## 注意事项

需要注意的是，在非 fStatic 模式下，针对 column 配置的 filters 或 sorter 进行筛选排序时，不应该使用 onFilter 或 sorter 进行本地处理，而是使用 formatParmams 进行 filters 和 sorters 的参数转换后，交给服务端来处理。
在 fStatic 模式下，针对 column 配置的 filters 或 sorter 进行筛选排序时，你应该使用 onFilter 或 sorter 函数进行处理。
