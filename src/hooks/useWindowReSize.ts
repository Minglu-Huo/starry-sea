import { useDebounceFn } from 'ahooks';
import React from 'react';
import { useRefFn } from './useRefFn';

type Options = {
  /** 等待的执行时间 */
  wait?: number;
  /** 是否在延迟开始前调用函数 */
  leading?: boolean;
  /** 是否在延迟开始后调用函数 */
  trailing?: boolean;
  /** 最大等待时间 */
  maxWait?: number;
  /** 是否立即执行或是否在每次handler变化时立即执行 */
  immediate?: boolean;
};

type handler = () => void;

export function useWindowReSize(handler: handler, options?: Options) {
  const { run: handleSize } = useDebounceFn(handler, options);

  const immediate = useRefFn(() => options?.immediate);

  React.useEffect(() => {
    window.addEventListener('resize', handleSize);

    return () => {
      window.removeEventListener('resize', handleSize);
    };
  }, [handleSize]);

  React.useEffect(() => {
    if (immediate) {
      handler();
    }
  }, [handler, immediate]);

  return [handleSize];
}
