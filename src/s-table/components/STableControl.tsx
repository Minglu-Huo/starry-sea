import Icon, {
  FullscreenExitOutlined,
  FullscreenOutlined,
  SearchOutlined,
  SettingOutlined,
  SyncOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Popover,
  Row,
  Tooltip,
  Tree,
  TreeProps,
  Typography,
} from 'antd';
import { cloneDeep, isFunction } from 'lodash';
import React from 'react';
import screenfull from 'screenfull';
import { useStore } from 'zustand';
import { TableContext } from '../context';
import { generateColumnMap } from '../utils/generateColumnMap';

const AdvSearch = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path
      d="M639.627772 892.931872 226.749304 892.931872c-54.56985 0-98.806353-44.237527-98.806353-98.806353L127.942951 226.14146c0-54.56985 44.237527-98.806353 98.806353-98.806353l569.914014 0c54.56985 0 98.806353 44.237527 98.806353 98.806353l0 413.525198 63.960731 0L959.430402 209.447243c0-80.317257-65.109903-145.426137-145.426137-145.426137L209.408357 64.021106c-80.316234 0-145.426137 65.109903-145.426137 145.426137L63.98222 814.043151c0 80.317257 65.109903 145.426137 145.426137 145.426137l430.219415 0L639.627772 892.931872zM959.430402 921.185356 710.73425 672.489204c35.524075-43.930535 56.81396-99.846032 56.81396-160.742984 0-141.29812-114.544803-255.842922-255.842922-255.842922S255.863389 370.447077 255.863389 511.745197s114.544803 255.842922 255.842922 255.842922c60.896952 0 116.813472-21.289885 160.744008-56.81396l248.696152 248.696152L959.430402 921.185356zM511.706311 703.627389c-105.97359 0-191.882192-85.908602-191.882192-191.882192s85.908602-191.882192 191.882192-191.882192 191.882192 85.908602 191.882192 191.882192S617.679901 703.627389 511.706311 703.627389z"
      fill="#272636"
    ></path>
  </svg>
);

const ScrollYOpen = () => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
      <path
        d="M512 993.415l275.094-412.641H236.906z m0-962.83L236.906 443.226h550.188z"
        fill="#333333"
      ></path>
    </svg>
  );
};

const ScrollYClose = () => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
    <path d="M481.706667 414.293333a42.666667 42.666667 0 0 0 60.586666 0l213.333334-213.333333a42.666667 42.666667 0 1 0-60.586667-60.586667L512 323.84l-183.04-183.466667a42.666667 42.666667 0 0 0-60.586667 60.586667z m60.586666 195.413334a42.666667 42.666667 0 0 0-60.586666 0l-213.333334 213.333333a42.666667 42.666667 0 0 0 60.586667 60.586667l183.04-183.466667 183.04 183.466667a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667z"></path>
  </svg>
);

const ScrollXClose = () => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
      <path d="M200.96 268.373333a42.666667 42.666667 0 0 0-60.586667 60.586667L323.84 512l-183.466667 183.04a42.666667 42.666667 0 0 0 0 60.586667 42.666667 42.666667 0 0 0 60.586667 0l213.333333-213.333334a42.666667 42.666667 0 0 0 0-60.586666zM700.16 512l183.466667-183.04a42.666667 42.666667 0 1 0-60.586667-60.586667l-213.333333 213.333334a42.666667 42.666667 0 0 0 0 60.586666l213.333333 213.333334a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667z"></path>
    </svg>
  );
};
const ScrollXOpen = () => {
  return (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
      <path
        d="M409.6 307.2l-256 204.8 256 204.8zM614.4 307.2l256 204.8-256 204.8z"
        fill="#000000"
      ></path>
    </svg>
  );
};

function Cheboxlist({
  colSettingsOptions,
  handleFixed,
  handleDrop,
  handleChange,
  checkedKeys,
  title,
  fixed,
}: {
  colSettingsOptions: any;
  handleFixed: any;
  handleDrop: any;
  handleChange: any;
  checkedKeys: any;
  title: string;
  fixed?: string;
}) {
  const [activeNodeKey, setActiveNodeKey] = React.useState('');

  const realCheckedKeys = checkedKeys.filter((checked: string) => {
    return colSettingsOptions.some((col: any) => {
      return col.key === checked;
    });
  });

  const showIcon = (key: string) => {
    const fixToLeft = (
      <Tooltip title="固定在左侧">
        <VerticalAlignTopOutlined
          onClick={handleFixed(key as string, 'left')}
          style={{ color: '#1677FF' }}
        />
      </Tooltip>
    );

    const fixToRight = (
      <Tooltip title="固定在右侧">
        <VerticalAlignBottomOutlined
          onClick={handleFixed(key as string, 'right')}
          style={{ color: '#1677FF' }}
        />
      </Tooltip>
    );

    const nofix = (
      <Tooltip title="取消固定">
        <VerticalAlignMiddleOutlined
          onClick={handleFixed(key as string)}
          style={{ color: '#1677FF' }}
        />
        bbb
      </Tooltip>
    );

    if (fixed === 'left') {
      return (
        <Col>
          {nofix}
          {fixToRight}
        </Col>
      );
    }

    if (fixed === 'right') {
      return (
        <Col>
          {fixToLeft}
          {nofix}
        </Col>
      );
    }

    return (
      <Col>
        {fixToLeft}
        {fixToRight}
      </Col>
    );
  };

  return (
    <>
      <Typography.Text type="secondary"> {title}</Typography.Text>
      <Tree
        treeData={colSettingsOptions}
        checkedKeys={realCheckedKeys}
        blockNode
        titleRender={(node) => {
          return (
            <Row
              justify="space-between"
              onClick={(e) => e.stopPropagation()}
              onMouseMove={() => setActiveNodeKey(node.key as string)}
            >
              <Col>{node.title as React.ReactNode}</Col>
              {activeNodeKey === node.key && showIcon(node.key)}
            </Row>
          );
        }}
        onDrop={handleDrop}
        selectable={false}
        onCheck={handleChange as TreeProps['onCheck']}
        checkable
        draggable
      />
    </>
  );
}

function PopoverContent({
  colSettingsOptions,
  handleFixed,
  handleDrop,
  handleChange,
  checkedKeys,
}: {
  colSettingsOptions: any;
  handleFixed: any;
  handleDrop: any;
  handleChange: any;
  checkedKeys: any;
}) {
  const leftlist = colSettingsOptions.filter((col: any) => {
    return col.fixed === 'left';
  });

  // const

  const rightlist = colSettingsOptions.filter((col: any) => {
    return col.fixed === 'right';
  });

  const nofixedlist = colSettingsOptions.filter((col: any) => {
    return col.fixed !== 'right' && col.fixed !== 'left';
  });

  let showTitle = true;

  if (
    (leftlist.length === 0 && rightlist.length === 0) ||
    (leftlist.length === 0 && nofixedlist.length === 0) ||
    (rightlist.length === 0 && nofixedlist.length === 0)
  ) {
    showTitle = false;
  }

  return (
    <div>
      {leftlist.length > 0 ? (
        <Cheboxlist
          title={showTitle ? '固定在左侧' : ''}
          fixed="left"
          colSettingsOptions={leftlist}
          handleFixed={handleFixed}
          handleChange={handleChange}
          handleDrop={handleDrop}
          checkedKeys={checkedKeys}
        />
      ) : null}
      {nofixedlist.length > 0 ? (
        <Cheboxlist
          // fixed="right"
          title={showTitle ? '未固定' : ''}
          colSettingsOptions={nofixedlist}
          handleFixed={handleFixed}
          handleChange={handleChange}
          handleDrop={handleDrop}
          checkedKeys={checkedKeys}
        />
      ) : null}
      {rightlist.length > 0 ? (
        <Cheboxlist
          fixed="right"
          title={showTitle ? '固定在右侧' : ''}
          colSettingsOptions={rightlist}
          handleFixed={handleFixed}
          handleChange={handleChange}
          handleDrop={handleDrop}
          checkedKeys={checkedKeys}
        />
      ) : null}
    </div>
  );
}

function STableControl() {
  const store = React.useContext(TableContext);

  // const [control, set]

  if (!store) {
    throw new Error('Missing StoreProvider');
  }

  const {
    control,
    columnMap,
    loading,
    columns,
    tableWrapRef,
    onScreenfullRef,
    screenfullWrapRef,
    action: { setControl, refresh, setColumnMap },
  } = useStore(store, (state) => {
    return {
      control: state.control,
      columnMap: state.columnMap,
      columns: state.columns,
      loading: state.loading,
      action: state.action,
      tableWrapRef: state.tableWrapRef,
      onScreenfullRef: state.onScreenfullRef,
      screenfullWrapRef: state.screenfullWrapRef,
    };
  });

  const colSettingWrap = React.useRef(null);

  React.useEffect(() => {
    const handler = () => {
      if (screenfull.isFullscreen) {
        setControl('screenfull', {
          status: 2,
        });
      } else {
        setControl('screenfull', {
          status: 1,
        });
      }
    };
    screenfull.on('change', handler);
    return () => {
      screenfull.off('change', handler);
    };
  }, []);

  const visibleColIndex = React.useMemo(() => {
    return Object.keys(columnMap).filter((colkey) => {
      if (columnMap[colkey].hidden !== true) {
        return true;
      }
      return false;
    });
  }, [columnMap]);
  const handleClick = (type: string, status?: number) => {
    return () => {
      switch (type) {
        case 'search':
          setControl(type, { status });
        // break;
        case 'scrollX':
        case 'scrollY':
          setControl(type, { status });
          break;
        case 'screenfull':
          if (isFunction(onScreenfullRef?.current)) {
            onScreenfullRef?.current?.();
            return;
          }

          if (screenfull.isFullscreen) {
            screenfull.exit();
          } else {
            if (screenfullWrapRef.current) {
              screenfull.request(screenfullWrapRef.current);
            } else if (tableWrapRef.current) {
              screenfull.request(tableWrapRef.current);
            }
          }
          break;

        default:
          break;
      }
    };
  };

  const colSettingsOptions = React.useMemo(() => {
    if (!columnMap) return [];

    const columns = Object.keys(columnMap);
    return columns
      .map((col) => {
        return {
          title: columnMap[col].title,
          key: col,
          fixed: columnMap[col].fixed,
        };
      })
      .sort((a, b) => {
        return columnMap[a.key].order - columnMap[b.key].order;
      });
  }, [columnMap]);

  const hanldeReset = () => {
    // setColumns(columnsRef.current);
    setColumnMap(generateColumnMap(columns));
  };

  const handleFixed = (key: string, direction?: 'left' | 'right') => {
    return () => {
      const columnsMap_ = cloneDeep(columnMap);

      columnsMap_[key].fixed = direction;
      setColumnMap(columnsMap_);
    };
  };

  const handleChange = React.useCallback(
    (checkedValues: any[]) => {
      const columnMap_ = cloneDeep(columnMap);
      const columns = Object.keys(columnMap_);

      columns.forEach((col) => {
        // return checkedValues.inclue
        if (!checkedValues.includes(col)) {
          columnMap_[col].hidden = true;
        } else {
          columnMap_[col].hidden = false;
        }
      });
      setColumnMap(columnMap_);
    },
    [setColumnMap, columnMap],
  );

  const handleDrop = React.useCallback(
    (info: any) => {
      const targetNode = info.node;

      const dragNode = info.dragNode;

      // const columns = Object.keys(columnMap);

      const columnMap_ = cloneDeep(columnMap);

      const targetCol = columnMap_[targetNode.key];

      const dragCol = columnMap_[dragNode.key];

      const temp = targetCol.order;

      targetCol.order = dragCol.order;
      dragCol.order = temp;

      setColumnMap(columnMap_);
    },
    [columnMap, setColumnMap],
  );

  return (
    <Row gutter={[5, 5]}>
      {control?.search?.visible && (
        <Col>
          <Tooltip
            title={
              control.search.option?.statusMap[control.search.status!].title
            }
            getPopupContainer={() =>
              colSettingWrap.current as any as HTMLElement
            }
          >
            <Button
              disabled={control.search.disabled}
              onClick={handleClick(
                'search',
                control.search.status === 1 ? 2 : 1,
              )}
              icon={
                control.search.status === 1 ? (
                  <SearchOutlined />
                ) : (
                  <Icon component={AdvSearch} />
                )
              }
            />
          </Tooltip>
        </Col>
      )}

      {control?.screenfull?.visible && (
        <Col>
          <Tooltip
            title={
              control.screenfull.option?.statusMap[control.screenfull.status!]
                .title
            }
            getPopupContainer={() =>
              colSettingWrap.current as any as HTMLElement
            }
          >
            <Button
              onClick={handleClick('screenfull')}
              disabled={control.screenfull.disabled}
              icon={
                control.screenfull.status === 1 ? (
                  <FullscreenOutlined />
                ) : (
                  <FullscreenExitOutlined />
                )
              }
            />
          </Tooltip>
        </Col>
      )}

      {control?.scrollX?.visible && (
        <Col>
          <Tooltip
            title={
              control.scrollX.option?.statusMap[control.scrollX.status!].title
            }
            getPopupContainer={() =>
              colSettingWrap.current as any as HTMLElement
            }
          >
            <Button
              disabled={control.scrollX.disabled}
              onClick={handleClick(
                'scrollX',
                control.scrollX.status === 1 ? 2 : 1,
              )}
              icon={
                <Icon
                  component={
                    control.scrollX.status === 1 ? ScrollXOpen : ScrollXClose
                  }
                />
              }
            />
          </Tooltip>
        </Col>
      )}
      {control?.scrollY?.visible && (
        <Col>
          <Tooltip
            title={
              control.scrollY.option?.statusMap[control.scrollY.status!].title
            }
            getPopupContainer={() =>
              colSettingWrap.current as any as HTMLElement
            }
          >
            <Button
              disabled={control.scrollY.disabled}
              onClick={handleClick(
                'scrollY',
                control.scrollY.status === 1 ? 2 : 1,
              )}
              icon={
                <Icon
                  component={
                    control.scrollY.status === 1 ? ScrollYOpen : ScrollYClose
                  }
                />
              }
            />
          </Tooltip>
        </Col>
      )}

      {control?.refresh?.visible && (
        <Col>
          <Tooltip
            title={
              control.refresh.option?.statusMap[control.refresh.status!].title
            }
            getPopupContainer={() =>
              colSettingWrap.current as any as HTMLElement
            }
          >
            <Button
              onClick={refresh}
              disabled={control.refresh.disabled}
              icon={<SyncOutlined spin={loading as boolean} />}
            />
          </Tooltip>
        </Col>
      )}
      {control?.colSettings?.visible && (
        <Col ref={colSettingWrap}>
          <Popover
            placement="leftBottom"
            showArrow
            trigger="click"
            getPopupContainer={() =>
              colSettingWrap.current as any as HTMLElement
            }
            title={
              <Row justify="space-between" align="middle">
                <Col>列设置</Col>
                <Col>
                  <Button type="link" onClick={hanldeReset}>
                    重置
                  </Button>
                </Col>
              </Row>
            }
            content={
              <PopoverContent
                handleChange={handleChange}
                handleFixed={handleFixed}
                colSettingsOptions={colSettingsOptions}
                handleDrop={handleDrop}
                checkedKeys={visibleColIndex}
              />
            }
          >
            <Tooltip
              title={
                control.colSettings.option?.statusMap[
                  control.colSettings.status!
                ].title
              }
              getPopupContainer={() =>
                colSettingWrap.current as any as HTMLElement
              }
            >
              <Button
                disabled={control.colSettings.disabled}
                icon={<SettingOutlined />}
              />
            </Tooltip>
          </Popover>
        </Col>
      )}
    </Row>
  );
}

export default React.memo(STableControl);
