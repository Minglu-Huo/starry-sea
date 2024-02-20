import React from 'react';
import { SApiSelector } from 'starry-sea';

type SearchParams = {
  value: string;
};

type Result = { name: string; id: number }[];

function service(params: SearchParams): Promise<Result> {
  console.log('🚀 ~ service ~ params:', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ name: params?.value, id: Math.round(Math.random() * 10) }]);
    }, 2000);
  });
}

function Demo() {
  return (
    <SApiSelector<Result, SearchParams>
      service={service}
      style={{ width: 200 }}
      formatResult={(ret) => {
        return ret.map((it) => ({
          label: it.name,
          value: it.id,
        }));
      }}
      formatParams={(params) => {
        console.log('🚀 ~ Demo ~ params:', params);
        // params.value
        return params;
      }}
      searchKey="value"
      serviceOptions={{ defaultParams: [{ value: '1' }] }}
    />
  );
}

export default Demo;
