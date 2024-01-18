import { Button } from 'antd';
import React, { type FC } from 'react';

const Foo: FC<{ title: string }> = (props) => (
  <h4>
    {props.title}
    <Button>按钮</Button>
  </h4>
);

export default Foo;
