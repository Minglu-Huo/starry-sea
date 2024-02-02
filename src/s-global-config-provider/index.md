---
nav:
  title: 组件
order: 16
---

# SGlobalConfigProvider

SGlobalConfigProvider 为 starry-sea 提供统一的全局化配置。

## 使用

```js
import { SGlobalConfigProvider } from 'starry-sea';

export default () => (
  <SGlobalConfigProvider table={{ manual: false }}>...</SGlobalConfigProvider>
);
```

## API

| 属性  | 描述                     | 类型 | 默认值 |
| :---- | :----------------------- | :--- | :----- |
| table | 传递给 STable 的默认属性 | -    | -      |

_table 类型：manual、control、showInteractionOnSreenfull、fetchSettings、resultSettings、columnProps_
