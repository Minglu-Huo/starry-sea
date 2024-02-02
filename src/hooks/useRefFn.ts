import React from 'react';

export function useRefFn<T = any>(init: () => T) {
  const firstRef = React.useRef(true);
  const ref = React.useRef<T | null>(null);
  if (firstRef.current) {
    firstRef.current = false;
    ref.current = init();
  }
  return ref;
}
