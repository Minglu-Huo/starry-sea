import { Button } from 'antd';
import React from 'react';

interface IProps {
  title: string;
}

const Foo = (props: IProps) => (
  <h4>
    {props.title}
    <Button>按钮</Button>
  </h4>
);

export default Foo;
