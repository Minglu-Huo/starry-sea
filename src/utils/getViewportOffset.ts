import { getBoundingClientRect } from './getBoundingClientRect';

export type ViewportOffset = Pick<
  DOMRect,
  'top' | 'left' | 'right' | 'bottom'
> & {
  rightIncludeBody: number;
  bottomIncludeBody: number;
  docClientWidth: number;
  docClientHeight: number;
};

export function getViewportOffset(element: HTMLElement | null): ViewportOffset {
  if (!element)
    return {
      top: 0,
      left: 0,
      bottom: 0,
      bottomIncludeBody: 0,
      right: 0,
      rightIncludeBody: 0,
      docClientWidth: window.document.documentElement.clientWidth,
      docClientHeight: window.document.documentElement.clientHeight,
    };
  // 获取文档的根元素（documentElement）
  const doc = document.documentElement;

  // 获取文档根元素的左边框宽度和上边框高度
  const docClientLeft = doc.clientLeft;
  const docClientTop = doc.clientTop;

  // 获取窗口左上角相对于当前文档的水平和垂直滚动像素
  const pageXOffset = window.scrollX || doc.scrollLeft;
  const pageYOffset = window.scrollY || doc.scrollTop;

  const box = getBoundingClientRect(element);

  const {
    left: rectLeft,
    top: rectTop,
    width: rectWidth,
    height: rectHeight,
  } = box || {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  // 计算文档的水平和垂直滚动位置
  const scrollLeft = pageXOffset - (docClientLeft || 0);
  const scrollTop = pageYOffset - (docClientTop || 0);

  // 计算目标元素的相对于文档的水平和垂直偏移位置
  const offsetLeft = rectLeft + pageXOffset;
  const offsetTop = rectTop + pageYOffset;

  // 计算目标元素相对于文档的左上角的水平和垂直位置
  const left = offsetLeft - scrollLeft;
  const top = offsetTop - scrollTop;

  // 获取文档的宽度和高度
  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  return {
    left,
    top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
    docClientWidth: clientWidth,
    docClientHeight: clientHeight,
  };
}
