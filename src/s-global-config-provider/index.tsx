import React from 'react';
import { SGlobalContext, SGlobalContextType } from './context';

// interface SGlobalConfigProviderProps {
//   table: {};
//   apiSelect: {};
// }

function SGlobalConfigProvider(
  props: React.PropsWithChildren<SGlobalContextType>,
) {
  const { children, ...restProps } = props;
  return (
    <SGlobalContext.Provider value={restProps}>
      {children}
    </SGlobalContext.Provider>
  );
}

export default SGlobalConfigProvider;
