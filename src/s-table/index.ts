import InternalTable from './STable';

import { useTable } from './hooks/useTable';
import { useWatch } from './hooks/useWatch';

type InternalTableType = typeof InternalTable;

type CompoundedComponent = InternalTableType & {
  useWatch: typeof useWatch;
  useTable: typeof useTable;
};

const STable = InternalTable as CompoundedComponent;

STable.useWatch = useWatch;
STable.useTable = useTable;

export default STable;
