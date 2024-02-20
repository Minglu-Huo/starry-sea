import { useDebounceFn, useLatest, useRequest } from 'ahooks';
import type {
  Service,
  Options as ServiceOptions,
} from 'ahooks/lib/useRequest/src/types';
import { Select, SelectProps, Spin } from 'antd';
import React from 'react';

interface SApiSelectorProps<ApiResult = any, Params = any> extends SelectProps {
  service: Service<ApiResult, Params[]>;
  serviceOptions?: ServiceOptions<ApiResult, Params[]>;
  formatResult?: (result: ApiResult) => SelectProps['options'];
  formatParams?: (params: Params) => any;
  searchKey?: string;
}

const defaultServiceOptions: SApiSelectorProps['serviceOptions'] = {
  manual: true,
  debounceWait: 600,
};

function SApiSelector<ApiResult = any, Params = any>(
  props: SApiSelectorProps<ApiResult, Params>,
) {
  const {
    service,
    serviceOptions,
    searchKey = 'keywords',
    formatResult,
    formatParams,
    ...restSelectProps
  } = props;

  const opts = {
    ...defaultServiceOptions,
    ...serviceOptions,
  };

  const { data, loading, mutate, run } = useRequest<ApiResult, Params[]>(
    service,
    opts,
  );

  const formatParamsRef = useLatest(formatParams);
  const formatResultRef = useLatest(formatResult);

  const options = React.useMemo(() => {
    if (!Array.isArray(data) || data.length < 1) {
      return [];
    }

    if (typeof formatResultRef.current === 'function') {
      return formatResultRef.current(data);
    }

    return data;
  }, [data]);

  const onSearch = (params: string) => {
    mutate();

    let searchParmas = { [searchKey]: params } as Params;
    if (typeof formatParamsRef.current === 'function') {
      searchParmas = formatParamsRef.current(searchParmas);
    }
    run(searchParmas);
  };

  const search = useDebounceFn(onSearch, {
    wait: 300,
  });

  const notFoundContent = loading ? (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <Spin size="small" />
    </div>
  ) : null;

  return (
    <Select
      options={options}
      showSearch
      filterOption={false}
      labelInValue
      onSearch={search.run}
      loading={loading}
      notFoundContent={notFoundContent}
      allowClear
      {...restSelectProps}
    />
  );
}

export default SApiSelector;
