import { RestOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, FormItemProps, FormProps } from 'antd';
import { isFunction } from 'lodash';
import React from 'react';
import { useStore } from 'zustand';
import { TableContext } from '../context';

export const COMPONENT_MAP = new Map();

// COMPONENT_MAP.set(COMPONENT_ENUM.XApiSelector, XApiSelector);

interface IFormItemProps extends FormItemProps {
  component: FormItemProps['children'];
}

export interface STableSearchPropsType {
  formlist?: Array<IFormItemProps>;
  form?: FormInstance;
  formProps?: FormProps;
}

function STableSearch(props: STableSearchPropsType) {
  const context = React.useContext(TableContext);

  if (!context) {
    throw new Error('Missing StoreProvider');
  }

  const { formlist, form, formProps } = props;

  const [internalForm] = Form.useForm(form);
  const { search, run, loading } = useStore(context, (state) => {
    return {
      search: state.control.search,
      run: state.action.run,
      loading: state.loading,
    };
  });

  const renderItems = React.useMemo(() => {
    const items = formlist
      ?.map((formItem) => {
        const { component, ...rest } = formItem;

        if (isFunction(component)) {
          return (
            <Form.Item {...rest} key={rest.name}>
              {component}
            </Form.Item>
          );
        }

        if (React.isValidElement(component)) {
          return (
            <Form.Item {...rest} key={rest.name}>
              {component}
            </Form.Item>
          );
        }
        return false;
      })
      .filter(Boolean);

    if (items?.length) {
      items.push(
        // <Col>
        <Form.Item key="operation">
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            icon={<SearchOutlined />}
            loading={loading}
            disabled={loading as any as boolean}
            onClick={() => {
              run(internalForm.getFieldsValue());
            }}
          >
            查询
          </Button>
          <Button
            loading={loading}
            disabled={loading as any as boolean}
            icon={<RestOutlined />}
            onClick={() => {
              internalForm?.resetFields();
            }}
          >
            重置
          </Button>
        </Form.Item>,
        // </Col>,
      );
    }
    return items;
  }, [formlist, internalForm, run]);

  if (search?.disabled || !search?.visible) return null;
  if (!Array.isArray(formlist) || formlist?.length < 1) return null;

  return (
    <Form form={internalForm} layout="inline" {...formProps}>
      {renderItems}
    </Form>
  );
}

export default React.memo(STableSearch);
