import React from 'react';
import { SGlobalConfigProvider, STable } from 'starry-sea';
import { STableProps } from '../STable';

type Record = { name: string; phone: string; address: string };

type Result = {
  list: Array<Record>;
  total: number;
};

const getData = (size: number) => {
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push({
      name: '张飞',
      phone: '0571-' + Math.round(Math.random() * 10000000),
      address: '北京市石景山区启迪香山',
    });
  }
  return data;
};

function service(params: any): Promise<Result> {
  console.log('🚀 ~ service ~ params:', params);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: getData(100),
        total: 100,
      });
    }, 1000);
  });
}

const columns: STableProps<Record>['columns'] = [
  { title: '序号', dataIndex: 'frontendSortnum' },
  { title: '姓名', dataIndex: 'name', sorter: true },
  {
    title: '电话',
    dataIndex: 'phone',
    filters: [
      { text: '1', value: 1 },
      { text: '2', value: 2 },
      { text: '3', value: 3, children: [{ text: '3-1', value: 31 }] },
    ],
    onFilter(value, record) {
      console.log('🚀 ~ onFilter ~ record:', record, value);
      return String(record.phone).indexOf(String(value)) !== -1;
    },
    // filteredValue: [2],
  },
  { title: '地址', dataIndex: 'address' },
  { title: '地址1', dataIndex: '1' },
  { title: '地址2', dataIndex: '2' },
  { title: '地址3', dataIndex: '3' },
];

function Demo() {
  const [table] = STable.useTable();

  // table.setState(state => {state})

  const wrapref = React.useRef(null);

  return (
    <div ref={wrapref}>
      <SGlobalConfigProvider
        table={{
          fetchSettings: {
            pageNumField: 'c',
            pageSizeField: 'pagesize',
          },
          columnProps: {
            align: 'right',
          },
        }}
      >
        <STable<Record, Result>
          table={table}
          fStatic
          service={service}
          control={{
            scrollY: {
              status: 2,
            },
          }}
          columns={columns}
          onChange={(p, f, s) => {
            console.log(p, f, s);
          }}
        />
      </SGlobalConfigProvider>
    </div>
  );
}

export default Demo;
